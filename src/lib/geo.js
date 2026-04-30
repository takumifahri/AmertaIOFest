export const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    const addr = data.address;
    if (!addr) return 'Lokasi tidak dikenal';
    
    // Construct a more detailed address
    const street = addr.road || addr.pedestrian || addr.path;
    const houseNumber = addr.house_number;
    const neighborhood = addr.neighbourhood || addr.suburb || addr.village || addr.hamlet;
    const city = addr.city || addr.town || addr.municipality;
    
    const parts = [];
    if (street) parts.push(street);
    if (houseNumber) parts.push(houseNumber);
    if (neighborhood) parts.push(neighborhood);
    if (city && parts.length < 2) parts.push(city);
    
    return parts.join(', ') || data.display_name.split(',').slice(0, 2).join(',') || 'Lokasi tidak dikenal';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Lokasi tidak dikenal';
  }
};
