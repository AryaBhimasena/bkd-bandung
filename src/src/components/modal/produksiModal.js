"use client";

import { useEffect, useState } from "react";
import "@/styles/produksi-modal.css";

import {
  fetchMasterStock,
  fetchStockFIFO,
  createProduksi
} from "@/lib/masterProdukHelper";

export default function ProduksiModal({ produk, onClose }) {

  const [tanggal, setTanggal] = useState("");
  const [qty, setQty] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const [stockMap, setStockMap] = useState({});     // ID_Stock -> nama + total
  const [loading, setLoading] = useState(true);

  if (!produk) return null;

  /* ==========================================================
     LOAD MASTER STOCK + FIFO
  ========================================================== */
  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      const [ms, fifo] = await Promise.all([
        fetchMasterStock(),
        fetchStockFIFO()
      ]);

      const master = ms?.data || [];
      const fifoData = fifo?.data || [];

      // --- total stok per ID_Stock (FIFO) ---
      const fifoTotal = {};
      fifoData.forEach(row => {
        const id = row.ID_Stock;
        const qty = Number(row.Sisa_Stock || 0);
        if (!fifoTotal[id]) fifoTotal[id] = 0;
        fifoTotal[id] += qty;
      });

      // --- bangun map final ---
      const map = {};
      master.forEach(item => {
        map[item.ID_Stock] = {
          nama: `${item.Item} - ${item.Jenis}`,
          total: fifoTotal[item.ID_Stock] || 0,
          satuan: item.Satuan_Qty || ""
        };
      });

      setStockMap(map);
      setLoading(false);
    }

    loadAll();
  }, []);

  /* ==========================================================
     HELPER UNTUK RENDER NAMA & STOCK
  ========================================================== */

  function renderStockName(id) {
    return stockMap[id]?.nama || id || "-";
  }

  function renderStockQty(id) {
    return stockMap[id]?.total ?? "-";
  }

  function renderStockUnit(id) {
    return stockMap[id]?.satuan ?? "-";
  }
  
async function handleSave() {

  setErrorMsg("");

  if (!tanggal) {
    setErrorMsg("Tanggal produksi wajib diisi.");
    return;
  }

  if (!qty || Number(qty) <= 0) {
    setErrorMsg("Qty produksi harus lebih besar dari 0.");
    return;
  }

  try {
    setSaving(true);

    const payload = {
      Tanggal: tanggal,
      ID_Produk: produk.ID_Produk,
      Merek: produk.Merek,
      Produk: produk.Produk,
      Qty_Produksi: Number(qty),
      Satuan_Produk: produk.Satuan_Produk,
      User: "SYSTEM",          // sesuaikan jika Anda punya user login
      Catatan: ""
    };

    const res = await createProduksi(payload);

    if (!res?.success) {
      throw new Error(res?.message || "Gagal menyimpan produksi");
    }

    // sukses → tutup modal
    onClose();

  } catch (err) {
    setErrorMsg(err.message || "Terjadi kesalahan");
  } finally {
    setSaving(false);
  }
}


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="modal-backdrop">
      <div className="modal-card produksi-modal">

        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <h3>Produksi {produk.Merek}</h3>
          <span className="subtitle">{produk.Produk}</span>
          <div className="small-info">
            ID Produk: {produk.ID_Produk}
          </div>
        </div>

        {loading ? (
          <p>Memuat data stock...</p>
        ) : (
        <>
        {/* ======================== SECTION BAHAN BAKU ====================== */}
        <div className="modal-section">
          <h4>Bahan Baku</h4>

          <table className="borderless-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Komposisi</th>
                <th>Satuan</th>
                <th>Stock Tersedia</th>
              </tr>
            </thead>

            <tbody>
              {produk.ID_BB1 && (
                <tr>
                  <td>{renderStockName(produk.ID_BB1)}</td>
                  <td>{produk.Komposisi_BB1}</td>
                  <td>{renderStockUnit(produk.ID_BB1)}</td>
                  <td>{renderStockQty(produk.ID_BB1)}</td>
                </tr>
              )}

              {produk.ID_BB2 && (
                <tr>
                  <td>{renderStockName(produk.ID_BB2)}</td>
                  <td>{produk.Komposisi_BB2}</td>
                  <td>{renderStockUnit(produk.ID_BB2)}</td>
                  <td>{renderStockQty(produk.ID_BB2)}</td>
                </tr>
              )}

              {produk.ID_BB3 && (
                <tr>
                  <td>{renderStockName(produk.ID_BB3)}</td>
                  <td>{produk.Komposisi_BB3}</td>
                  <td>{renderStockUnit(produk.ID_BB3)}</td>
                  <td>{renderStockQty(produk.ID_BB3)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================== SECTION PACKAGING ======================= */}
        <div className="modal-section">
          <h4>Packaging</h4>

          <table className="borderless-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Satuan</th>
                <th>Stock Tersedia</th>
              </tr>
            </thead>

            <tbody>
              {produk.ID_Kemasan && (
                <tr>
                  <td>{renderStockName(produk.ID_Kemasan)}</td>
                  <td>{produk.Qty_Kemasan}</td>
                  <td>{renderStockUnit(produk.ID_Kemasan)}</td>
                  <td>{renderStockQty(produk.ID_Kemasan)}</td>
                </tr>
              )}

              {produk.ID_Label && (
                <tr>
                  <td>{renderStockName(produk.ID_Label)}</td>
                  <td>{produk.Qty_Label}</td>
                  <td>{renderStockUnit(produk.ID_Label)}</td>
                  <td>{renderStockQty(produk.ID_Label)}</td>
                </tr>
              )}

              {produk.ID_Packaging && (
                <tr>
                  <td>{renderStockName(produk.ID_Packaging)}</td>
                  <td>{produk.Qty_Packaging}</td>
                  <td>{renderStockUnit(produk.ID_Packaging)}</td>
                  <td>{renderStockQty(produk.ID_Packaging)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
        )}

        {/* ===== FORM PRODUKSI ===== */}
        <div className="modal-section">
          <label>
            Tanggal Produksi
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
            />
          </label>

          <label>
            Qty Produksi ({produk.Satuan_Produk})
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </label>
        </div>

        {/* ===== ACTION ===== */}
        <div className="modal-actions">
{errorMsg && (
  <div className="error-text">
    {errorMsg}
  </div>
)}

<button onClick={onClose}>Batal</button>

<button
  className="primary"
  disabled={saving}
  onClick={handleSave}
>
  {saving ? "Menyimpan..." : "Simpan Produksi"}
</button>

        </div>

      </div>
    </div>
  );
}
