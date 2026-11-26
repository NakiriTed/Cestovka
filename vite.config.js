import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tedův Východní Svět',
        short_name: 'Tedův Svět',
        description: 'Průvodce a rezervace zájezdů do Asie.',
        theme_color: '#0f0f19',
        background_color: '#0f0f19',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp,jpg}']
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    }),
    {
      name: 'serve-img-folder',
      configureServer(server) {
        server.middlewares.use('/img', (req, res, next) => {
          const filePath = path.join(process.cwd(), 'img', req.url);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
              '.png': 'image/png', '.webp': 'image/webp',
              '.gif': 'image/gif', '.svg': 'image/svg+xml'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });

        server.middlewares.use('/api/createStripeCheckout', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { planTitle, price, email, planId } = JSON.parse(body || '{}');
              const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
              const match = envContent.match(/VITE_STRIPE_SECRET_KEY=([^\r\n]+)/);
              const stripeKey = match ? match[1].trim() : process.env.VITE_STRIPE_SECRET_KEY;

              const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${stripeKey}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  'payment_method_types[0]': 'card',
                  ...(email ? { customer_email: email } : {}),
                  'line_items[0][price_data][currency]': 'czk',
                  'line_items[0][price_data][product_data][name]': planTitle || 'Zájezd',
                  'line_items[0][price_data][product_data][description]': `Zájezd: ${planId || ''}`,
                  'line_items[0][price_data][unit_amount]': String(Math.round((Number(price) || 49900) * 100)),
                  'line_items[0][quantity]': '1',
                  'mode': 'payment',
                  'success_url': 'http://localhost:8080/profile?payment=success',
                  'cancel_url': 'http://localhost:8080/planner?payment=canceled',
                }),
              });

              const data = await stripeRes.json();
              res.setHeader('Content-Type', 'application/json');
              if (data.url) {
                res.statusCode = 200;
                res.end(JSON.stringify({ id: data.id, url: data.url }));
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: data.error?.message || 'Chyba Stripe API' }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
        }
      }
    }
  },
  server: {
    port: 8080,
    strictPort: true
  }
});

