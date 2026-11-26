import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function MapPage() {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const tileLayerRef = useRef(null);
  const { theme } = useTheme();
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const navigate = useNavigate();

  const plansDB = {
    'Tokyo': {
      lat: 35.6762, lng: 139.6503, plans: [
        { planId: 'jp-gold', title: isEn ? 'Classic Japan: Golden Route (14 days)' : 'Zlatý okruh Japonskem (14 dní)', term: '14. 5. - 28. 5. 2026', tag: isEn ? 'Active date' : 'Aktivní termín' },
        { planId: 'jp-anime', title: isEn ? 'Akihabara & Pop Culture (12 days)' : 'Akihabara & Pop-Kultura (12 dní)', term: isEn ? 'Sold out' : 'Obsazeno', tag: isEn ? 'Fun' : 'Zábava' }
      ]
    },
    'Kyoto': {
      lat: 35.0116, lng: 135.7681, plans: [
        { planId: 'jp-gold', title: isEn ? 'Classic Japan: Golden Route (14 days)' : 'Zlatý okruh Japonskem (14 dní)', term: '14. 5. - 28. 5. 2026', tag: isEn ? 'Active date' : 'Aktivní termín' },
        { planId: 'jp-anime', title: isEn ? 'Akihabara & Pop Culture (12 days)' : 'Akihabara & Pop-Kultura (12 dní)', term: isEn ? 'Sold out' : 'Obsazeno', tag: isEn ? 'Fun' : 'Zábava' }
      ]
    },
    'Osaka': {
      lat: 34.6937, lng: 135.5023, plans: [
        { planId: 'jp-gold', title: isEn ? 'Classic Japan: Golden Route (14 days)' : 'Zlatý okruh Japonskem (14 dní)', term: '14. 5. - 28. 5. 2026', tag: isEn ? 'Active date' : 'Aktivní termín' },
        { planId: 'jp-anime', title: isEn ? 'Akihabara & Pop Culture (12 days)' : 'Akihabara & Pop-Kultura (12 dní)', term: isEn ? 'Sold out' : 'Obsazeno', tag: isEn ? 'Fun' : 'Zábava' }
      ]
    },
    'Soul (Seoul)': {
      lat: 37.5665, lng: 126.9780, plans: [
        { planId: 'kr-seoul', title: isEn ? 'Best of South Korea (10 days)' : 'Korejská metropole & Historie (10 dní)', term: '1. 6. - 10. 6. 2026', tag: isEn ? 'Culture' : 'Exotika' }
      ]
    },
    'Pusan (Busan)': {
      lat: 35.1796, lng: 129.0756, plans: [
        { planId: 'kr-seoul', title: isEn ? 'Best of South Korea (10 days)' : 'Korejská metropole & Historie (10 dní)', term: '1. 6. - 10. 6. 2026', tag: isEn ? 'Port city' : 'Přístav' }
      ]
    },
    'Fuji (Kawaguchiko)': {
      lat: 35.5031, lng: 138.7679, plans: [
        { planId: 'jp-gold', title: isEn ? 'Classic Japan: Golden Route (14 days)' : 'Zlatý okruh Japonskem (14 dní)', term: '14. 5. - 28. 5. 2026', tag: isEn ? 'Icon' : 'Ikona' }
      ]
    }
  };

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS if not already loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!window.L || leafletInstance.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [36.5, 137.5],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
      });

      leafletInstance.current = map;

      const cartoKey = 'cb1_3uzm_1_4767ad8acc9bf6ee2987ae8b';
      const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const initialUrl = initialTheme === 'light'
        ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
        : `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;

      tileLayerRef.current = L.tileLayer(initialUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      // Custom Glowing Markers
      const createIcon = (hasPlans) => L.divIcon({
        className: '',
        html: `<div style="
          width: 18px; 
          height: 18px; 
          background: ${hasPlans ? 'var(--accent-color, #ef233c)' : '#666'}; 
          border-radius: 50%; 
          border: 2px solid white; 
          box-shadow: ${hasPlans ? '0 0 0 4px rgba(239,35,60,0.4), 0 0 12px rgba(239,35,60,0.8)' : 'none'};
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10]
      });

      Object.entries(plansDB).forEach(([city, data]) => {
        const hasPlans = data.plans.length > 0;
        const marker = L.marker([data.lat, data.lng], { icon: createIcon(hasPlans) });

        let popupContent = `<div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
          <h3 style="color:#ef233c; margin: 0 0 10px; font-size:1rem; border-bottom: 1px solid rgba(239,35,60,0.3); padding-bottom: 6px;">📍 ${city}</h3>`;

        if (hasPlans) {
          data.plans.forEach(p => {
            const isSoldOut = p.term === 'Obsazeno' || p.term === 'Sold out';
            const url = isSoldOut
              ? `/planner?plan=${encodeURIComponent(p.planId)}`
              : `/planner?plan=${encodeURIComponent(p.planId)}&date=${encodeURIComponent(p.term)}`;
            popupContent += `
              <div style="margin-bottom: 10px; padding: 8px; background: rgba(239,35,60,0.07); border-radius: 8px; border: 1px solid rgba(239,35,60,0.2);">
                <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 2px;">${p.title}</div>
                <div style="color: #aaa; font-size: 0.78rem; margin-bottom: 6px;">🗓 ${p.term}</div>
                <a href="${url}" data-navlink="true" style="
                  display: inline-block;
                  background: #ef233c;
                  color: white;
                  text-decoration: none;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 0.78rem;
                  font-weight: 600;
                  cursor: pointer;
                ">${isEn ? 'View trip →' : 'Zobrazit zájezd →'}</a>
              </div>
            `;
          });
        } else {
          popupContent += `<p style="color:#888; margin:0;">${isEn ? 'No active trips here right now' : 'Sem teď nejezdíme'}</p>`;
        }

        popupContent += `</div>`;

        const popup = L.popup({ maxWidth: 280 }).setContent(popupContent);
        marker.bindPopup(popup);

        // Handle SPA navigation via event delegation after popup opens
        marker.on('popupopen', () => {
          setTimeout(() => {
            document.querySelectorAll('[data-navlink="true"]').forEach(el => {
              el.addEventListener('click', (e) => {
                e.preventDefault();
                const href = el.getAttribute('href');
                marker.closePopup();
                navigate(href);
              });
            });
          }, 50);
        });

        marker.addTo(map);
      });
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      script.onerror = () => {
        const fallbackCss = document.getElementById('leaflet-css');
        if (fallbackCss) fallbackCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        fallbackScript.onload = initMap;
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [isEn]);

  // Swap tile layer reactively when theme changes
  useEffect(() => {
    if (!leafletInstance.current || !tileLayerRef.current) return;
    const map = leafletInstance.current;
    const cartoKey = 'cb1_3uzm_1_4767ad8acc9bf6ee2987ae8b';
    const newUrl = theme === 'light'
      ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
      : `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;
    map.removeLayer(tileLayerRef.current);
    tileLayerRef.current = window.L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
  }, [theme]);

  return (
    <main className="map-wrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem' }}><i className="fa-solid fa-map-location-dot" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Interactive Trip Map' : 'Interaktivní mapa zájezdů'}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{isEn ? 'Click on any glowing marker on the map to see which itineraries visit that destination.' : 'Klikněte na svítící bod na mapě a zjistěte, které plány vás do tohoto místa zavedou.'}</p>
      </div>

      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '580px',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      />
    </main>
  );
}
