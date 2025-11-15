import { getStories } from "./api.js";

export async function renderStoryList() {
  const token = localStorage.getItem("token");
  const listEl = document.getElementById("storyList");
  if (!token || !listEl) return;

  listEl.innerHTML = "Memuat...";
  try {
    const stories = await getStories(token);
    if (!Array.isArray(stories) || stories.length === 0) {
      listEl.innerHTML = "<p>Tidak ada cerita.</p>";
      return;
    }

    listEl.innerHTML = stories.map(s => `
      <article class="card" tabindex="0" aria-labelledby="title-${s.id}">
        <img src="${s.photoUrl}" alt="${escapeHtml(s.name || '')}" />
        <h3 id="title-${s.id}">${escapeHtml(s.name || '')}</h3>
        <p>${escapeHtml((s.description || '').slice(0,160))}</p>
        <p><small>${s.lat && s.lon ? `Lat: ${s.lat.toFixed(5)}, Lon: ${s.lon.toFixed(5)}` : 'Lokasi tidak tersedia'}</small></p>
      </article>
    `).join("");
  } catch (e) {
    listEl.textContent = "Gagal memuat daftar cerita.";
    console.error(e);
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
