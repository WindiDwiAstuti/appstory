const BASE_URL = "https://story-api.dicoding.dev/v1";

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.error) localStorage.setItem("token", data.loginResult.token);
  return data;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function getStories(token) {
  const res = await fetch(`${BASE_URL}/stories?location=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.listStory || [];
}

export async function addStory(token, description, photo, lat, lon) {
  const fd = new FormData();
  fd.append("description", description);
  fd.append("photo", photo);
  if (lat !== undefined && lon !== undefined) {
    fd.append("lat", lat);
    fd.append("lon", lon);
  }
  const res = await fetch(`${BASE_URL}/stories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  return res.json();
}
