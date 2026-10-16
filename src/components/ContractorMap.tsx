import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Contractor, HomeOwnerLocation } from '../types';
import { formatDistance } from '../utils/geo';
import { MapPin, Navigation, Compass, Phone, Mail, Sparkles } from 'lucide-react';

interface ContractorMapProps {
  homeLocation: HomeOwnerLocation;
  contractors: Contractor[];
  selectedContractor: Contractor | null;
  onSelectContractor: (contractor: Contractor) => void;
  onOpenQuoteWithContractor?: (contractor: Contractor) => void;
  radiusKm?: number;
}

export const ContractorMap: React.FC<ContractorMapProps> = ({
  homeLocation,
  contractors,
  selectedContractor,
  onSelectContractor,
  onOpenQuoteWithContractor,
  radiusKm = 10,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const homeMarkerRef = useRef<L.Marker | null>(null);
  const radiusCirclesRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Singapore / Home location
    const map = L.map(mapContainerRef.current, {
      center: [homeLocation.lat, homeLocation.lng],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // High reliability OpenStreetMap standard tile layer (keyless, fast, no external token needed)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data: One Map &amp; data.gov.sg',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    radiusCirclesRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Trigger invalidateSize to ensure tiles render immediately upon mount
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ResizeObserver to automatically call invalidateSize when container dimensions change (e.g. tab switches!)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    ro.observe(mapContainerRef.current);

    return () => {
      ro.disconnect();
    };
  }, []);

  // Update homeowner marker and radius circles when home location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    // Update Home Marker
    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove();
    }

    const homeIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 bg-amber-400 rounded-full animate-ping opacity-75"></div>
        <div class="relative w-10 h-10 bg-amber-500 text-neutral-950 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      </div>
    `;

    const homeIcon = L.divIcon({
      html: homeIconHtml,
      className: 'custom-home-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    const homeMarker = L.marker([homeLocation.lat, homeLocation.lng], { icon: homeIcon })
      .bindPopup(`
        <div class="p-3 text-xs">
          <div class="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold uppercase text-[10px] mb-1">
            Homeowner Reference Location
          </div>
          <div class="font-bold text-sm text-neutral-900">${homeLocation.buildingName}</div>
          <div class="text-neutral-500 mt-0.5">${homeLocation.address}</div>
          <div class="text-[11px] font-mono text-emerald-700 font-semibold mt-1">OneMap Verified Postal: ${homeLocation.postalCode}</div>
        </div>
      `)
      .addTo(map);

    homeMarkerRef.current = homeMarker;

    // Update proximity circles around Homeowner
    if (radiusCirclesRef.current) {
      radiusCirclesRef.current.clearLayers();

      // 3km inner radius
      L.circle([homeLocation.lat, homeLocation.lng], {
        radius: 3000,
        color: '#10b981',
        weight: 1.5,
        fillColor: '#10b981',
        fillOpacity: 0.05,
        dashArray: '4, 4',
      }).addTo(radiusCirclesRef.current);

      // 5km mid radius
      L.circle([homeLocation.lat, homeLocation.lng], {
        radius: 5000,
        color: '#f59e0b',
        weight: 1.5,
        fillColor: '#f59e0b',
        fillOpacity: 0.03,
        dashArray: '4, 4',
      }).addTo(radiusCirclesRef.current);

      // 10km outer radius
      L.circle([homeLocation.lat, homeLocation.lng], {
        radius: 10000,
        color: '#6366f1',
        weight: 1,
        fillColor: '#6366f1',
        fillOpacity: 0.02,
        dashArray: '4, 4',
      }).addTo(radiusCirclesRef.current);
    }
  }, [homeLocation]);

  // Update contractor pins on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Render top 150 closest or filtered contractors
    const visibleContractors = contractors.slice(0, 150);

    visibleContractors.forEach((contractor) => {
      const isSelected = selectedContractor?.id === contractor.id;
      const dist = contractor.distanceKm ?? 0;

      // Color based on proximity
      let badgeColor = 'bg-indigo-600';
      if (dist <= 3) badgeColor = 'bg-emerald-600';
      else if (dist <= 6) badgeColor = 'bg-amber-600';

      const iconHtml = `
        <div class="relative cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${isSelected ? '<div class="absolute -inset-2 bg-amber-400 rounded-full animate-ping opacity-60"></div>' : ''}
          <div class="w-8 h-8 ${isSelected ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-300' : `${badgeColor} text-white`} rounded-full border border-white shadow-md flex items-center justify-center font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
              <path d="M17.64 15 22 10.64"/>
              <path d="m20.91 3.26-1.25-1.25a2 2 0 0 0-2.83 0l-1.8 1.8 4.09 4.09 1.8-1.8a2 2 0 0 0 0-2.84Z"/>
            </svg>
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-contractor-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3.5 text-xs max-w-xs';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
            HDB Registered
          </span>
          <span class="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]">
            📍 ${formatDistance(dist)} away
          </span>
        </div>
        <div class="font-bold text-sm text-neutral-900 leading-snug">${contractor.companyName}</div>
        <div class="text-[11px] text-neutral-500 font-mono mt-0.5">Ref: ${contractor.id} | UEN: ${contractor.uen}</div>
        <div class="text-neutral-600 mt-2 text-[11px] leading-relaxed">
          ${contractor.address} (Postal ${contractor.postalCode})
        </div>
        <div class="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          ${contractor.contactNo ? `<a href="tel:${contractor.contactNo}" class="text-xs font-bold text-neutral-800 hover:text-amber-600 flex items-center gap-1">📞 ${contractor.contactNo}</a>` : ''}
          ${contractor.email ? `<a href="mailto:${contractor.email}" class="text-xs font-medium text-neutral-600 hover:text-neutral-900">✉️ Email</a>` : ''}
        </div>
      `;

      const actionBtn = document.createElement('button');
      actionBtn.className = 'w-full mt-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-1.5 px-3 rounded text-[11px] transition-colors';
      actionBtn.textContent = 'Request Quotation / Direct Engagement';
      actionBtn.onclick = () => {
        if (onOpenQuoteWithContractor) {
          onOpenQuoteWithContractor(contractor);
        }
      };
      popupContent.appendChild(actionBtn);

      const marker = L.marker([contractor.lat, contractor.lng], { icon: markerIcon })
        .bindPopup(popupContent)
        .on('click', () => {
          onSelectContractor(contractor);
        });

      marker.addTo(markersLayer);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [contractors, selectedContractor]);

  // Pan to selected contractor when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedContractor) return;

    map.flyTo([selectedContractor.lat, selectedContractor.lng], 14, {
      duration: 0.8,
    });
  }, [selectedContractor]);

  const recenterHome = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.invalidateSize();
    map.flyTo([homeLocation.lat, homeLocation.lng], 12, { duration: 0.6 });
    if (homeMarkerRef.current) {
      homeMarkerRef.current.openPopup();
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm">
      {/* Map Canvas with guaranteed min-height and clear dimensions */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[420px] sm:h-[480px] lg:h-[520px] z-10 block" 
        style={{ minHeight: '420px' }}
      />

      {/* Floating Map Controls & Legends */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={recenterHome}
          className="bg-white/95 backdrop-blur-sm p-2 rounded-xl border border-neutral-200 shadow-md text-neutral-800 hover:text-neutral-950 hover:bg-white active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          title="Recenter map on Homeowner location"
        >
          <Navigation className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="hidden sm:inline">Recenter on Home</span>
        </button>
      </div>

      {/* Proximity Distance Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-200/90 shadow-md text-xs pointer-events-none">
        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-neutral-600" />
          Proximity from OneMap Home (178903)
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-700">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt; 3 km
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 3 - 6 km
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> 6 - 10+ km
          </span>
        </div>
      </div>
    </div>
  );
};
