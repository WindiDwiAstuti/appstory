import { loginUser } from "../api.js";

export function renderLogin(app) {
  app.innerHTML = `
    <section class="form-section">
      <h2>Login</h2>
      <form id="loginForm">
        <label for="email">Email</label>
        <input id="email" type="email" required>

        <label for="password">Password</label>
        <input id="password" type="password" required>

        <button type="submit">Masuk</button>
      </form>
      <p id="msg" role="status" aria-live="polite"></p>
      <p>Belum punya akun? <a href="#/register">Daftar</a></p>
    </section>
  `;

  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await loginUser(email.value, password.value);
    msg.textContent = res.message || "";
    if (!res.error) window.location.hash = "/home";
  });
}
