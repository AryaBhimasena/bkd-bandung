import { apiPost } from "@/lib/api";

export function fetchMasterProduk() {
  return apiPost("masterProduk.list");
}

export function createMasterProduk(data) {
  return apiPost("masterProduk.create", data);
}

export function updateMasterProduk(data) {
  return apiPost("masterProduk.update", data);
}

export function deleteMasterProduk({ Merek, Produk }) {
  return apiPost("masterProduk.delete", { Merek, Produk });
}

export function fetchMasterStock() {
  return apiPost("masterStock.list");
}

export function fetchStockFIFO() {
  return apiPost("stockFIFO.list");
}

export function fetchProduksi() {
  return apiPost("produksi.list");
}

export function createProduksi(data) {
  return apiPost("produksi.create", data);
}
