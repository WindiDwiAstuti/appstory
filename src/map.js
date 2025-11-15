import { getStories } from "./api.js";

export async function showStoriesOnMap(token, mapContainer) {
  const map = L.map(mapContainer).setView([-2.5, 118], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // optional second tilelayer (for advanced)
  const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png");

  L.control.layers({ "OSM": map._layers[Object.keys(map._layers)[0]], "Topo": topo }).addTo(map);

  const stories = await getStories(token);

  // ensure stories is array
  if (!Array.isArray(stories)) return;

  stories.forEach((s) => {
    if (s.lat && s.lon) {
      const marker = L.marker([s.lat, s.lon]).addTo(map);
      marker.bindPopup(`
        <strong>${escapeHtml(s.name || 'No title')}</strong><br>
        ${escapeHtml((s.description || '').slice(0, 120))}<br>
        <img src="${s.photoUrl}" alt="${escapeHtml(s.name || '')}" width="120" />
      `);
    }
  });
}

export function enablePickLocation(mapContainer, callback) {
  const map = L.map(mapContainer).setView([-2.5, 118], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  let marker = null;
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    if (marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(map);
    callback(lat, lng);
  });
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
