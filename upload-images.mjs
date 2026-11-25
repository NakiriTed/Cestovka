/**
 * upload-images.mjs
 * ─────────────────
 * Nahrává všechny obrázky ze složky ./img/ (a seoul_subway_map.webp)
 * přímo do databáze Cloud Firestore (kolekce itineraries/_media/items),
 * takže není potřeba placený tarif Blaze pro Firebase Storage.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccountPath = join(__dirname, 'service-account.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch {
  console.error('❌ Nenalezen service-account.json');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
db.settings({ databaseId: 'cestovka' });

const mimeMap = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

/**
 * Pokud je obrázek větší než ~650 KB (aby se po Base64 kódování vešel do 1 MiB limitu Firestore dokumentu),
 * zmenší ho pomocí vestavěného .NET System.Drawing na max 1400px JPEG (kvalita 82).
 */
function getCompressedDataUrl(localPath, ext) {
  const rawBuffer = readFileSync(localPath);
  const mime = mimeMap[ext] || 'image/jpeg';

  // 700 KB raw = ~933 KB Base64 (< 1 MiB limit Firestore)
  if (rawBuffer.length <= 700 * 1024) {
    return `data:${mime};base64,${rawBuffer.toString('base64')}`;
  }

  // Komprese přes PowerShell System.Drawing pro velké fotky (např. 3-4 MB)
  const psScript = `
    Add-Type -AssemblyName System.Drawing
    $img = [System.Drawing.Image]::FromFile('${localPath.replace(/'/g, "''")}')
    $maxW = 1400
    $w = $img.Width
    $h = $img.Height
    if ($w -gt $maxW) {
      $h = [int]($h * ($maxW / $w))
      $w = $maxW
    }
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $ms = New-Object System.IO.MemoryStream
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]80)
    $bmp.Save($ms, $codec, $ep)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    [Convert]::ToBase64String($ms.ToArray())
  `;

  const base64 = execFileSync('powershell', ['-NoProfile', '-Command', psScript], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  }).trim();

  return `data:image/jpeg;base64,${base64}`;
}

async function run() {
  const imgDir = join(__dirname, 'img');
  const files = readdirSync(imgDir)
    .filter(f => statSync(join(imgDir, f)).isFile())
    .map(f => ({ name: f, path: join(imgDir, f) }));

  const seoulMapPath = join(__dirname, 'public', 'img', 'seoul_subway_map.webp');
  if (existsSync(seoulMapPath) && !files.some(f => f.name === 'seoul_subway_map.webp')) {
    files.push({ name: 'seoul_subway_map.webp', path: seoulMapPath });
  }

  console.log(`\n🚀 Nahrávám ${files.length} obrázků přímo do databáze Firestore (itineraries/_media/items)...\n`);

  const mediaCol = db.collection('itineraries').doc('_media').collection('items');

  for (const { name, path } of files) {
    const ext = extname(name).toLowerCase();
    try {
      const dataUrl = getCompressedDataUrl(path, ext);
      await mediaCol.doc(name).set({
        name,
        dataUrl,
        updatedAt: new Date().toISOString(),
      });
      const sizeKB = Math.round((dataUrl.length * 0.75) / 1024);
      console.log(`  ✅ ${name} (${sizeKB} KB uloženo ve Firestore)`);
    } catch (err) {
      console.error(`  ❌ ${name}: ${err.message}`);
    }
  }

  console.log('\n🎉 Všechny obrázky jsou nahrané v databázi Firestore!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
