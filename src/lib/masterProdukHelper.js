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
