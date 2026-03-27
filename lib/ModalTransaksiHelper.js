// lib/ModalTransaksiHelper.js
import { apiPost } from "@/lib/api";

/* ===============================
   FETCH & MAP COA
=============================== */
export async function fetchCOAList() {
  const res = await apiPost("coa.list");

  if (!res?.success && res?.status !== "OK") return [];

  const rows = Array.isArray(res.data) ? res.data : [];

  return rows
    .filter(
      (coa) => String(coa.status).trim().toLowerCase() === "aktif"
    )
    .map((coa) => ({
	  id : coa.id_akun,
      kode: coa.kode_akun,
      nama: coa.nama_akun,
      tipe: String(coa.tipe_akun),
      saldo: coa.saldo_normal,
    }));
}

/* ===============================
   FETCH & MAP BANK
=============================== */
export async function fetchBankList() {
  const res = await apiPost("bank.list");

  if (!res?.success) return [];

  const rows = Array.isArray(res.data) ? res.data : [];

  return rows.map((bank) => ({
    id: bank.id_bank,
    nama: bank.nama_bank,
    rekening: bank.nomor_rekening,
    liniUsaha: {
      id: bank.lini_usaha?.id || "",
      kode: bank.lini_usaha?.kode || "",
      nama: bank.lini_usaha?.nama || "",
    },
	status: bank.status,
  }));
}

/* ===============================
   FETCH & MAP JENIS TRANSAKSI
=============================== */
export async function fetchJenisTransaksi() {
  const res = await apiPost("jenisTransaksi.list");

  if (!res?.success) return [];

  const rows = Array.isArray(res.data) ? res.data : [];

  return rows.map(jt => ({
    id: jt.id_jenis_transaksi,
    nama: jt.jenis_transaksi,
  }));
}

/* ===============================
   FILTER BANK BY LINI USAHA
=============================== */
export function filterBankByLiniUsaha(bankList, liniUsahaId) {
  if (!liniUsahaId) return [];

  return bankList.filter(
    (b) =>
      String(b.liniUsaha?.id) === String(liniUsahaId) &&
      String(b.status).toLowerCase() === "aktif"
  );
}

/* ===============================
   DEDUP LINI USAHA OPTIONS
=============================== */
export function getLiniUsahaOptions(bankList) {
  const map = {};
  bankList.forEach((b) => {
    if (b.liniUsaha?.id) {
      map[b.liniUsaha.id] = b.liniUsaha;
    }
  });
  return Object.values(map);
}

/* ===============================
   FORMAT NOMINAL INPUT
=============================== */
export function formatNominal(value) {
  const raw = value.replace(/[^\d]/g, "");
  return new Intl.NumberFormat("id-ID").format(raw || 0);
}

/* ===============================
   HANDLE SUBMIT
=============================== */
export async function submitTransaksi(payload) {
  try {
    const res = await apiPost("keuangan.transaksi.create", payload);

    if (!res.success) {
      throw new Error(res.message || "Gagal menyimpan transaksi");
    }

    return res;
  } catch (err) {
    console.error("Submit transaksi gagal:", err);
    throw err;
  }
}
