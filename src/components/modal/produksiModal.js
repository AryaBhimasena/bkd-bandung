"use client";

import { useState } from "react";
import "@/styles/produksi-modal.css";

export default function ProduksiModal({ produk, onClose }) {
  const [tanggal, setTanggal] = useState("");
  const [qty, setQty] = useState("");

  if (!produk) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card produksi-modal">

        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <h3>Produksi {produk.Merek}</h3>
          <span className="subtitle">{produk.Produk}</span>
        </div>

        {/* ===== DETAIL RESEP ===== */}
        <div className="modal-section">
          <h4>Komposisi Bahan</h4>
          <ul className="resep-list">
            <li>
              <span>{produk.Bahan_Baku}</span>
              <span className="qty">{produk.Komposisi_BB}</span>
            </li>

            {produk.Bahan_Baku1 && (
              <li>
                <span>{produk.Bahan_Baku1}</span>
                <span className="qty">{produk.Komposisi_BB1}</span>
              </li>
            )}

            {produk.Bahan_Baku2 && (
              <li>
                <span>{produk.Bahan_Baku2}</span>
                <span className="qty">{produk.Komposisi_BB2}</span>
              </li>
            )}
          </ul>
        </div>

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
            Qty Produksi
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </label>
        </div>

        {/* ===== ACTION ===== */}
        <div className="modal-actions">
          <button onClick={onClose}>Batal</button>
          <button className="primary">Simpan Produksi</button>
        </div>

      </div>
    </div>
  );
}
