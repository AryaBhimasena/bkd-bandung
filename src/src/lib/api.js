// lib/api.js

const API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbx1VwJosppA-bh1qNXE4byz2y8HVhtLWPLe3YLDmjjv7-c2qLYXHuaiIx5d9vmQwB8M/exec";

export async function apiPost(endpoint, params = {}) {
  const body = new URLSearchParams({
    endpoint,
    ...params,
  });

  let res;
  try {
    res = await fetch(API_BASE_URL, {
      method: "POST",
      body,
    });
  } catch {
    throw new Error("Tidak dapat terhubung dengan server");
  }

  return res.json();
}

export async function apiGet(endpoint, params = {}) {
  const query = new URLSearchParams({
    path: endpoint,
    ...params,
  }).toString();

  let res;
  try {
    res = await fetch(`${API_BASE_URL}?${query}`, {
      method: "GET",
	  cache: "no-store",
    });
  } catch {
    throw new Error("Tidak dapat terhubung dengan server");
  }

  return res.json();
}
