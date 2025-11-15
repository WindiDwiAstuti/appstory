import { registerUser } from "../api.js";

export function renderRegister(app) {
  app.innerHTML = `
    <section class="form-section">
      <h2>Register</h2>
      <form id="regForm">
        <label for="name">Nama</label>
        <input id="name" type="text" required>

        <label for="email">Email</label>
        <input id="email" type="email" required>

        <label for="password">Password</label>
        <input id="password" type="password" required minlength="8">

        <button type="submit">Daftar</button>
      </form>
      <p id="msg" role="status" aria-live="polite"></p>
      <p>Sudah punya akun? <a href="#/login">Login</a></p>
    </section>
  `;

  const form = document.getElementById("regForm");
  const msg = document.getElementById("msg");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // kirim data dengan benar
    const res = await registerUser(
      nameInput.value.trim(),
      emailInput.value.trim(),
      passwordInput.value.trim()
    );

    msg.textContent = res.message || "";

    if (!res.error) {
      window.location.hash = "/login";
    }
  });
}
