"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues with window object in Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

import storesData from "@/data/stores.json";

// Fix Leaflet marker icons in Next.js
const customMarkerHtml = `
  <div style="background-color: #D9042B; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
`;

export default function StoreLocator() {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Dynamically load leaflet core for custom icons
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!mounted || !L) return <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl"></div>;

  const customIcon = L.divIcon({
    html: customMarkerHtml,
    className: "custom-leaflet-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <section id="locator" className="py-24 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-brand-dark dark:text-brand-light uppercase tracking-tight mb-4">
            Find <span className="text-brand-red">Us.</span>
          </h2>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
            Stocking fridges nationwide. Find Let's Reset near you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative z-0">
          <div className="lg:col-span-2 h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none border dark:border-white/10 relative z-0">
            <MapContainer 
              center={[39.8283, -98.5795]} 
              zoom={4} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {storesData.map((store) => (
                <Marker 
                  key={store.id} 
                  position={[store.lat, store.lng]}
                  icon={customIcon}
                >
                  <Popup className="font-sans">
                    <div className="p-1">
                      <h3 className="font-bold text-gray-900 text-lg m-0">{store.name}</h3>
                      <p className="text-gray-600 text-xs mt-1 mb-2">{store.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {store.stock.map(flavor => (
                           <span key={flavor} className="bg-gray-100 text-gray-800 text-[10px] px-2 py-1 rounded-full font-bold uppercase">{flavor}</span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="bg-white dark:bg-[#1a1515] rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border dark:border-white/10 h-[500px] overflow-y-auto">
            <h3 className="text-2xl font-black text-brand-dark dark:text-brand-light mb-6">Stockists</h3>
            <div className="space-y-6">
              {storesData.map(store => (
                <div key={store.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 p-4 -mx-4 rounded-xl cursor-pointer transition-colors">
                  <h4 className="font-bold text-brand-dark dark:text-brand-light">{store.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{store.address}</p>
                  <div className="flex gap-2">
                     {store.stock.map(flavor => (
                        <div key={flavor} className={`w-3 h-3 rounded-full ${flavor.includes("Cranberry") ? "bg-brand-red" : flavor.includes("Jamun") ? "bg-brand-purple" : "bg-brand-orange"}`} title={flavor}></div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
