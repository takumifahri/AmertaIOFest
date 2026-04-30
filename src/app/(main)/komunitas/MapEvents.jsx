'use client';
import { useMapEvents } from 'react-leaflet';
import { getAddressFromCoords } from '@/lib/geo';
import { useEffect } from 'react';

export default function MapEvents({ onLocationSelect }) {
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  useMapEvents({
    async click(e) {
      const address = await getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      onLocationSelect(e.latlng.lat, e.latlng.lng, address);
    },
  });
  return null;
}