import { apiPost } from "@/lib/api";

/* ================================
   FETCH FIFO STOCK + JOIN MASTER
================================= */
export async function fetchStockFIFO() {
  const [fifoRes, masterRes] = await Promise.all([
    apiPost("stockFIFO.list"),
    apiPost("masterStock.list"),
  ]);

  if (!fifoRes?.success) return fifoRes;
  if (!masterRes?.success) return masterRes;

  /* --------------------------------
     Build lookup Master Stock
  --------------------------------- */
  const masterMap = {};
  masterRes.data.forEach(item => {
    masterMap[item.ID_Stock] = item;
  });

  /* --------------------------------
     Normalize & Join FIFO
  --------------------------------- */
  const data = fifoRes.data.map(row => {
    const master = masterMap[row.ID_Stock] || {};

    const qtyBase = normalizeQty(row.Qty, row.Satuan_Qty);
    const tanggal = parseIDDate(row.Tanggal);

    return {
      ...row,

      /* JOINED FROM MASTER */
      Stock_Nama: master.Item || "-",
      Stock_Jenis: master.Jenis || "-",
      Stock_Kategori: master.Kategori_Stock || "-",

      Qty: qtyBase.value,
      Satuan_Qty: qtyBase.unit,

      Total_Amount: calculateTotalAmount(
        qtyBase.value,
        row.Harga
      ),

      Tanggal_Obj: tanggal,
      Tanggal_Display: formatIDDate(tanggal),
    };
	
  });

  return { success: true, data };
}

/* ================================
   FIFO – GENERATE ID REF
================================ */
export async function generateFifoIdRef() {
  const res = await apiPost("fifo.generateId");

  if (!res?.success) {
    return {
      success: false,
      message: res?.message || "Gagal generate ID FIFO"
    };
  }

  return {
    success: true,
    id_ref: res.id_ref
  };
}

/* ================================
   FILTERING
================================= */
export function filterStockData(data, { search, status }) {
  return data.filter(row => {
    const matchSearch =
      !search ||
      row.Stock_Nama?.toLowerCase().includes(search.toLowerCase()) ||
      row.ID_Ref?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "all"
        ? true
        : status === "available"
        ? row.Sisa_Stock > 0
        : row.Sisa_Stock === 0;

    return matchSearch && matchStatus;
  });
}

/* ================================
   KALKULASI
================================= */
export function calculateTotalAmount(qty, harga) {
  return (Number(qty) || 0) * (Number(harga) || 0);
}

/* ================================
   KONVERSI SATUAN
================================= */
export function normalizeQty(qty, satuan) {
  const value = Number(qty) || 0;

  if (satuan === "Gram") {
    return { value: value / 1000, unit: "KG" };
  }

  return { value, unit: satuan };
}

/* ================================
   DATE PARSER (SAFE & FLEXIBLE)
================================= */
export function parseIDDate(value) {
  if (!value) return null;

  // Jika sudah Date object (dari GAS)
  if (value instanceof Date) return value;

  if (typeof value !== "string") return null;

  const parts = value.split("-");

  if (parts.length !== 3) return null;

  // yyyy-MM-dd
  if (parts[0].length === 4) {
    const [yyyy, mm, dd] = parts;
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  // dd-MM-yyyy
  if (parts[2].length === 4) {
    const [dd, mm, yyyy] = parts;
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  return null;
}

export function formatIDDate(date) {
  if (!date) return "-";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export function toISODate(date) {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

/* ================================
   FETCH MASTER STOCK
================================= */
export async function fetchMasterStock() {
  const res = await apiPost("masterStock.list");

  if (!res?.success) return res;

  const data = res.data.map(row => ({
    ID_Stock: row.ID_Stock,
    Item: row.Item,
    Jenis: row.Jenis,
    Kategori_Stock: row.Kategori_Stock,
    Satuan_Qty: row.Satuan_Qty,

    /* Untuk dropdown */
    label: `${row.ID_Stock} - ${row.Item} - ${row.Jenis}`,
  }));

  return { success: true, data };
}

/* ======================================================
   FIFO – PENERIMAAN STOCK
====================================================== */
export async function receiveStockFIFO(form) {
  /*
    form:
    {
      ID_Ref,
      Tanggal,
      ID_Stock,
      Qty,
      Satuan_Qty,
      Harga,
      Penggunaan_Stock
    }
  */

  // NOTE:
  // - FIFO calculation BELUM dilakukan
  // - Fungsi ini hanya bertugas mengirim data mentah ke GAS
  // - Validasi & kalkulasi akan dilakukan di layer backend

  return apiPost("fifoStock.receive", {
    ...form,
  });
}
