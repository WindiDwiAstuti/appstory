import { showStoriesOnMap } from "../map.js";
import { renderStoryList } from "../storyList.js";

export function renderHome(app) {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.hash = "/login");

  app.innerHTML = `
    <section>
      <h2>Daftar Cerita</h2>
      <div id="storyList" class="card-list" aria-live="polite"></div>

      <h2>Peta Cerita</h2>
      <div id="map" class="map-box" role="region" aria-label="Peta cerita"></div>
    </section>
  `;

  // render list and map
  renderStoryList().catch(console.error);
  showStoriesOnMap(token, "map").catch(console.error);
}
