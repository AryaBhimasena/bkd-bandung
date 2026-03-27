// lib/masterStockHelper.js

import { apiPost } from "@/lib/api";

/* ======================================================
   ID GENERATOR (FRONTEND)
====================================================== */

export function generateStockId(category, existingIds = []) {
  const prefixMap = {
    Greenbean: "BBG",
    Roastbean: "BBR",
    Kemasan: "KMS",
    Label: "LBL",
    Packaging: "PCK",
  };

  const prefix = prefixMap[category];
  if (!prefix) {
    throw new Error("Kategori stock tidak valid");
  }

  const numbers = existingIds
    .filter((id) => typeof id === "string" && id.startsWith(prefix))
    .map((id) => parseInt(id.split("-")[1], 10))
    .filter((n) => !isNaN(n));

  const nextNumber =
    numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

/* ======================================================
   CRUD API (KONSISTEN DENGAN Code.gs)
====================================================== */

export async function fetchMasterStock() {
  return apiPost("masterStock.list");
}

export async function createMasterStock(data) {
  return apiPost("masterStock.create", data);
}

export async function updateMasterStock(data) {
  return apiPost("masterStock.update", data);
}

export async function deleteMasterStock(ID_Stock) {
  return apiPost("masterStock.delete", { ID_Stock });
}
