"use client";

import { ExternalLink, MapPin } from "lucide-react";

export function MapCard() {
  const position = [12.996456, 80.249596];
  const addressQuery = "93/206, Canal Bank Rd, Indira Nagar, Adyar, Chennai, Tamil Nadu 600020";
  const mapsUrl = "https://maps.app.goo.gl/phSVoXA9iMRFxZhc6";

  const iframeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #000000;
        }
        .leaflet-container {
          background: #000000 !important;
          font-family: system-ui, -apple-system, sans-serif;
        }
        /* Custom glowing pin */
        .glowing-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        /* Pulsing outer glow ring */
        .pin-glow {
          width: 32px;
          height: 32px;
          background-color: rgba(140, 198, 63, 0.25);
          border-radius: 50%;
          position: absolute;
          border: 1.5px solid rgba(140, 198, 63, 0.45);
          box-shadow: 0 0 15px 5px rgba(140, 198, 63, 0.55);
          animation: pinPulse 2s infinite ease-in-out;
        }
        /* Solid inner pin point */
        .pin-pulse {
          width: 12px;
          height: 12px;
          background-color: #8CC63F;
          border-radius: 50%;
          position: absolute;
          border: 2px solid #EEEEEE;
          box-shadow: 0 0 10px #8CC63F;
        }
        @keyframes pinPulse {
          0% {
            transform: scale(0.75);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.25;
          }
          100% {
            transform: scale(0.75);
            opacity: 0.8;
          }
        }
        /* Leaflet Dark Theme Controls styling */
        .leaflet-bar {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-bar a {
          background-color: #080808 !important;
          color: #EEEEEE !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          transition: all 0.2s ease;
        }
        .leaflet-bar a:hover {
          background-color: #111111 !important;
          color: #8CC63F !important;
        }
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.75) !important;
          color: #999999 !important;
          font-size: 10px !important;
          border-top-left-radius: 4px;
        }
        .leaflet-control-attribution a {
          color: #8CC63F !important;
          text-decoration: none;
        }
        .leaflet-control-attribution a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const pos = [${position[0]}, ${position[1]}];
        const map = L.map('map', {
          center: pos,
          zoom: 15,
          zoomControl: true,
          attributionControl: true
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);
        
        const customIcon = L.divIcon({
          className: 'glowing-pin',
          html: '<div class="pin-glow"></div><div class="pin-pulse"></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        L.marker(pos, { icon: customIcon }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <div className="mt-8 rounded-xl border border-border-primary bg-bg-card p-4 shadow-premium hover:border-signal/50 hover:shadow-[0_0_25px_rgba(140,198,63,0.18)] transition-all duration-300 group overflow-hidden">
      {/* Map Container */}
      <div className="relative h-64 w-full rounded-lg overflow-hidden border border-border-primary/50 group-hover:border-signal/30 transition-all duration-300">
        <iframe
          srcDoc={iframeHtml}
          className="w-full h-full border-none"
          title="TEXAWAVE Office Location Map"
          sandbox="allow-scripts allow-popups allow-same-origin"
        />
      </div>

      {/* Address & Navigation Details */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-3 items-start">
          <MapPin className="text-signal mt-1 shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold tracking-widest text-signal uppercase">Headquarters</h4>
            <p className="mt-1 text-sm text-text-primary leading-relaxed">
              93/206, Canal Bank Road,<br />
              Indira Nagar, Adyar,
              <br />Chennai - 600020
            </p>
          </div>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-signal/10 hover:bg-signal border border-signal/20 hover:border-transparent text-signal hover:text-white font-bold text-sm tracking-wide transition-all duration-300 shrink-0 self-start sm:self-center"
        >
          Open in Google Maps
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
