import { renderHome } from "./pages/home.js";
import { renderAdd } from "./pages/add.js";
import { renderLogin } from "./pages/login.js";
import { renderRegister } from "./pages/register.js";
import { renderDrafts } from "./pages/drafts.js"; // ← 

export function router(app) {
  const hash = window.location.hash || "#/login";
  switch (hash) {
    case "#/home": renderHome(app); break;
    case "#/add": renderAdd(app); break;
    case "#/register": renderRegister(app); break;
    case "#/drafts": renderDrafts(app); break; // ← TAMBAHKAN
    default: renderLogin(app); break;
  }
}
