import { getAllDrafts, deleteDraft } from "../db.js";

export async function renderDrafts(app) {
  app.innerHTML = `
    <h2>Draft Cerita</h2>
    <div id="draft-list">Loading...</div>
  `;

  const drafts = await getAllDrafts();
  const list = document.getElementById("draft-list");

  if (drafts.length === 0) {
    list.innerHTML = "<p>Belum ada draft.</p>";
    return;
  }

  list.innerHTML = drafts.map(d => `
    <div class="draft-card">
      <h3>${d.title}</h3>
      <p>${d.content}</p>
      <button class="delete-draft" data-id="${d.id}">Hapus</button>
    </div>
  `).join("");

  document.querySelectorAll(".delete-draft").forEach(btn => {
    btn.onclick = async () => {
      await deleteDraft(Number(btn.dataset.id));
      renderDrafts(app); // refresh
    };
  });
}
