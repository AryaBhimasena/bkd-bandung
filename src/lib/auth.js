// lib/auth.js

import { apiPost } from "./api";

const STORAGE_KEY = "auth_user";

export async function login(username, password) {
  const result = await apiPost("login", { username, password });

  if (!result.success) {
    throw new Error(result.message);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(result.data)
  );

  return result.data;
}

export function getAuthUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}
