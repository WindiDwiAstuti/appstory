import { router } from "./router.js";
import { subscribePush, PUBLIC_VAPID_KEY } from "./push.js";

const app = document.getElementById("app");
const pushBtn = document.getElementById("pushToggleBtn");
const installBtn = document.getElementById("installBtn");
let deferredPrompt = null;

function navigate() {
  if (document.startViewTransition) {
    document.startViewTransition(() => router(app));
  } else {
    router(app);
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", () => {
  navigate();

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("Service Worker registered");
    }).catch(console.error);
  }

  // Handle install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.hash = "/login";
});

pushBtn.addEventListener("click", async () => {
  if (pushBtn.getAttribute("aria-pressed") === "true") {
    pushBtn.setAttribute("aria-pressed", "false");
    pushBtn.textContent = "Enable Notifications";
    return;
  }
  try {
    if (!PUBLIC_VAPID_KEY) {
      alert("Masukkan PUBLIC_VAPID_KEY terlebih dahulu.");
      return;
    }
    await subscribePush();
    pushBtn.setAttribute("aria-pressed", "true");
    pushBtn.textContent = "Disable Notifications";
    alert("Push notification aktif!");
  } catch (err) {
    console.error(err);
    alert("Gagal subscribe push: " + err.message);
  }
});
