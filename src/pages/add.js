import { addStory } from "../api.js";
import { enablePickLocation } from "../map.js";
import { addDraft, getAllDrafts, deleteDraft } from "../db.js";

export function renderAdd(app) {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.hash = "/login");

  app.innerHTML = `
    <section class="form-section">
      <h2>Tambah Story</h2>

      <form id="addForm">
        <label for="name">Nama</label>
        <input id="name" name="name" type="text" required>

        <label for="description">Deskripsi</label>
        <input id="description" name="description" type="text" required>

        <label for="photo">Foto</label>
        <input id="photo" name="photo" type="file" accept="image/*" required>

        <p>Klik pada peta untuk memilih lokasi:</p>
        <div id="map" class="map-box" role="region" aria-label="Peta pilih lokasi"></div>

        <p>Koordinat: <span id="coords">Belum dipilih</span></p>

        <button type="submit">Kirim</button>
        <button type="button" id="saveDraft">Simpan Draft</button>
      </form>

      <p id="msg" role="status" aria-live="polite"></p>

      <h3>Drafts</h3>
      <div id="draftsList"></div>
    </section>
  `;

  // lokasi
  let lat = null;
  let lon = null;

  enablePickLocation("map", (lt, ln) => {
    lat = lt;
    lon = ln;
    document.getElementById("coords").textContent =
      `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  });

  const form = document.getElementById("addForm");
  const msg = document.getElementById("msg");
  const saveBtn = document.getElementById("saveDraft");

  // =====================
  //  SUBMIT STORY
  // =====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const desc = document.getElementById("description").value;
    const file = document.getElementById("photo").files[0];

    if (!file) {
      msg.textContent = "Pilih foto dulu!";
      return;
    }

    if (lat === null || lon === null) {
      msg.textContent = "Pilih lokasi dulu!";
      return;
    }

    try {
      const res = await addStory(token, `${name} - ${desc}`, file, lat, lon);
      msg.textContent = res.message || "Story berhasil dikirim!";

      if (!res.error) {
        window.location.hash = "/home";
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Gagal mengirim story.";
    }
  });

  // =====================
  //  DRAFTS DISPLAY
  // =====================
  async function refreshDrafts() {
    const drafts = await getAllDrafts();
    const el = document.getElementById("draftsList");

    if (!drafts.length) {
      el.innerHTML = "<p>Tidak ada draft.</p>";
      return;
    }

    el.innerHTML = drafts
      .map(
        (d) => `
        <div class="card">
          <p><strong>${d.name}</strong></p>
          <p>${d.description}</p>
          <p>
            <button data-id="${d.id}" class="delDraft">Hapus</button>
          </p>
        </div>
      `
      )
      .join("");

    // Tombol hapus
    el.querySelectorAll(".delDraft").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await deleteDraft(Number(btn.dataset.id));
        refreshDrafts();
      });
    });
  }

  // =====================
  //  SAVE DRAFT
  // =====================
  saveBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const desc = document.getElementById("description").value;

    if (!name || !desc) {
      msg.textContent = "Nama & Deskripsi wajib diisi sebelum simpan draft.";
      return;
    }

    await addDraft({
      name,
      description: desc,
      lat,
      lon,
      createdAt: Date.now(),
    });

    msg.textContent = "Draft tersimpan.";
    refreshDrafts();
  });

  refreshDrafts();
}
