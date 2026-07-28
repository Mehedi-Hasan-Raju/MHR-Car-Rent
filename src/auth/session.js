const KEY = "dreamsrent_auth";

export function saveSession(token, user) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
