"use client";

import { useEffect, useState } from "react";
import "@/styles/master-produk-tab.css";

export default function MasterProdukTab({
  data = [],
  onSelect, // opsional, untuk parent jika perlu tahu selection
}) {
  const [selectedProduk, setSelectedProduk] = useState(null);

  /* =========================================
     SYNC STATE SAAT DATA BERUBAH
  ========================================= */
  useEffect(() => {
    if (!selectedProduk) return;

    const stillExists = data.some(
      p =>
        p.ID_Produk === selectedProduk.ID_Produk
    );

    if (!stillExists) {
      setSelectedProduk(null);
    }
  }, [data, selectedProduk]);

  const handleSelect = (item) => {
    setSelectedProduk(item);
    onSelect?.(item);
  };

  return (
    <section className="produk-wrapper">
      {/* ================= CARD KIRI ================= */}
      <div className="produk-card list-card">
        <div className="card-header">
          <h3>Daftar Produk</h3>
        </div>

        <div className="produk-list">
          {data.length === 0 && (
            <div className="empty">Belum ada produk</div>
          )}

          {data.map(item => {
            const isActive =
              selectedProduk?.ID_Produk === item.ID_Produk;

            return (
              <div
                key={item.ID_Produk}
                className={`produk-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelect(item)}
              >
                <div className="produk-thumb">
                  {item.Foto ? (
                    <img src={item.Foto} alt={item.Merek} />
                  ) : (
                    <div className="thumb-placeholder" />
                  )}
                </div>

                <div className="produk-info">
                  <div className="produk-merek">{item.Merek}</div>
                  <div className="produk-nama">{item.Produk}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CARD KANAN ================= */}
      <div className="produk-card resep-card">
        <div className="card-header">
          <h3>Resep Produk</h3>
        </div>

        {!selectedProduk && (
          <div className="empty">
            Pilih produk untuk melihat resep
          </div>
        )}

        {selectedProduk && (
          <div className="resep-profile">
            <div className="resep-header">
              <h2>{selectedProduk.Merek}</h2>
              <p>{selectedProduk.Produk}</p>
            </div>

            <div className="resep-section">
              <h4>Informasi Produk</h4>
              <ul>
                <li>
                  Qty Produk: {selectedProduk.Qty_Produk}{" "}
                  {selectedProduk.Satuan_Produk}
                </li>
              </ul>
            </div>

            <div className="resep-section">
              <h4>Bahan Baku Utama</h4>
              <ul>
                <li>
                  {selectedProduk.Bahan_Baku} –{" "}
                  {selectedProduk.Jenis_BB} (
                  {selectedProduk.Komposisi_BB})
                </li>
              </ul>
            </div>

            <div className="resep-section">
              <h4>Kombinasi Bahan Alternatif</h4>
              <ul>
                {selectedProduk.Bahan_Baku1 && (
                  <li>
                    {selectedProduk.Bahan_Baku1} –{" "}
                    {selectedProduk.Jenis_BB1} (
                    {selectedProduk.Komposisi_BB1})
                  </li>
                )}
                {selectedProduk.Bahan_Baku2 && (
                  <li>
                    {selectedProduk.Bahan_Baku2} –{" "}
                    {selectedProduk.Jenis_BB2} (
                    {selectedProduk.Komposisi_BB2})
                  </li>
                )}
              </ul>
            </div>

            <div className="resep-section">
              <h4>Kemasan & Label</h4>
              <ul>
                <li>
                  Kemasan: {selectedProduk.Kemasan_Produk} (
                  {selectedProduk.Qty_Kemasan}{" "}
                  {selectedProduk.Satuan_Kemasan})
                </li>
                <li>
                  Label: {selectedProduk.Label} (
                  {selectedProduk.Qty_Label}{" "}
                  {selectedProduk.Satuan_Label})
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
