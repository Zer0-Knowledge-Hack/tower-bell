/**
 * Assign demo coordinates around a local center so the free OSM map
 * can show nearby beacons without a paid Maps API.
 * Center: Buenos Aires microcentro (hackathon venue vibe).
 */
export const MAP_CENTER = {
  lat: -34.6037,
  lng: -58.3816,
  label: 'Your location',
};

function offsetFromDistance(meters, angle) {
  const lat = MAP_CENTER.lat + (meters / 111320) * Math.cos(angle);
  const lng = MAP_CENTER.lng + (meters / (111320 * Math.cos((MAP_CENTER.lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat, lng };
}

export function withMapCoords(record, index = 0, total = 1) {
  if (typeof record.lat === 'number' && typeof record.lng === 'number') return record;
  const distance = Number(record.distance) || 80 + index * 35;
  const angle = ((index + 1) / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  const { lat, lng } = offsetFromDistance(distance, angle);
  return { ...record, lat, lng };
}

export function merchantsForMap(list) {
  return (list || []).map((item, index) => withMapCoords(item, index, list.length));
}
