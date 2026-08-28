import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="40" height="40">
      <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4H4v4zm2-8h12v5c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-5zm-1 9h1m8 0h1m-12 0h1m10 0h1"/>
      <circle cx="7" cy="17" r="1.5" fill="#1e40af"/>
      <circle cx="17" cy="17" r="1.5" fill="#1e40af"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Stop icon
const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="20" height="20">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function MapView({
  route = [],
  stops = [],
  currentLocation = null,
  center = [12.9716, 77.5946],
  zoom = 10,
  height = '400px',
  showControls = true,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayerRef = useRef(null);
  const stopsLayerRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      // Add route layer
      routeLayerRef.current = L.layerGroup().addTo(mapInstance.current);
      stopsLayerRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update center when it changes
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Draw route polyline
  useEffect(() => {
    if (!mapInstance.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (route.length > 1) {
      const polyline = L.polyline(route, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(routeLayerRef.current);

      // Fit bounds to route
      mapInstance.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [route]);

  // Draw stops
  useEffect(() => {
    if (!mapInstance.current || !stopsLayerRef.current) return;

    stopsLayerRef.current.clearLayers();

    stops.forEach((stop) => {
      L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .bindPopup(`<strong>${stop.name}</strong>`)
        .addTo(stopsLayerRef.current);
    });
  }, [stops]);

  // Update current location marker
  useEffect(() => {
    if (!mapInstance.current) return;

    if (currentLocation) {
      if (markerRef.current) {
        markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      } else {
        markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
          icon: busIcon,
          title: 'Bus Location',
        })
          .bindPopup('Current Bus Location')
          .addTo(mapInstance.current);
      }

      markerRef.current.setPopupContent(`
        <div class="text-center">
          <strong>Bus Location</strong><br/>
          ${currentLocation.speed ? `Speed: ${Math.round(currentLocation.speed)} km/h` : ''}
        </div>
      `);
    }
  }, [currentLocation]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} style={{ height, width: '100%' }} />

      {showControls && (
        <div className="absolute top-3 right-3 z-[1000]">
          <div className="bg-white rounded-lg shadow-md p-2 flex flex-col gap-1">
            <button
              onClick={() => mapInstance.current?.zoomIn()}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => mapInstance.current?.zoomOut()}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white rounded-lg shadow-md p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Route Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Bus Stops</span>
        </div>
      </div>
    </div>
  );
}