'use client';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MapEvents from '@/app/(main)/komunitas/MapEvents';
import 'leaflet/dist/leaflet.css';
import { getAddressFromCoords } from '@/lib/geo';

export default function MapComponent({ mapCenter, formData, setFormData, setMapCenter, setSearchQuery, L, mapMode }) {
  if (!L) return null;

  const tileUrl = mapMode === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={17} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer url={tileUrl} />
      <MapEvents onLocationSelect={(lat, lng, address) => {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, address }));
        setMapCenter([lat, lng]);
        setSearchQuery(address);
      }} />
      {formData.latitude && (
        <Marker
          position={[formData.latitude, formData.longitude]}
          draggable={true}
          eventHandlers={{
            dragend: async (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              const address = await getAddressFromCoords(position.lat, position.lng);
              setFormData(prev => ({ 
                ...prev, 
                latitude: position.lat, 
                longitude: position.lng, 
                address 
              }));
              setSearchQuery(address);
            },
          }}
          icon={L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-container"><div class="marker-pulse" style="background-color: #2B4C3B"></div><div class="marker-core" style="background-color: #2B4C3B"></div></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })}
        />
      )}
    </MapContainer>
  );
}
