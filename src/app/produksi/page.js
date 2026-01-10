"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/produksi.css";

import ProduksiModal from "@/components/modal/produksiModal";

import {
  fetchMasterProduk,
  fetchProduksi,
} from "@/lib/masterProdukHelper";

export default function ProduksiPage() {
  /* ================================
     MASTER PRODUK STATE
  ================================= */
  const [masterProdukData, setMasterProdukData] = useState([]);
  const [loadingProduk, setLoadingProduk] = useState(false);
  
/* ================================
   PRODUKSI STATE
================================= */
const [produksiData, setProduksiData] = useState([]);
const [loadingProduksi, setLoadingProduksi] = useState(false);

  /* ================================
     UI STATE
  ================================= */
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================================
     FETCHER (SAMA POLA)
  ================================= */
  async function loadMasterProduk() {
    setLoadingProduk(true);
    const res = await fetchMasterProduk();
    if (res?.success) {
      setMasterProdukData(res.data || []);
    }
    setLoadingProduk(false);
  }
  
	async function loadProduksi() {
	  setLoadingProduksi(true);
	  const res = await fetchProduksi();
	  if (res?.success) {
		setProduksiData(res.data || []);
	  }
	  setLoadingProduksi(false);
	}

  /* ================================
     EFFECT
  ================================= */
useEffect(() => {
  loadMasterProduk();
  loadProduksi();
}, []);


  /* ================================
     HANDLER
  ================================= */
  const handleSelectProduk = (item) => {
    setSelectedProduk(item);
    setModalOpen(true);
  };

function formatTanggalID(value) {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

  /* ================================
     RENDER
  ================================= */
  return (
    <MainContainer title="Produksi">
      <div className="produksi-page">

        {/* ================= SECTION ATAS ================= */}
        <section className="produksi-section top">
          <div className="produksi-card">
            <div className="card-header">
              <h3>Input Produksi</h3>
            </div>

            {loadingProduk ? (
              <p>Memuat data produk...</p>
            ) : (
              <>
                {/* ===== SELECTOR PRODUK (HORIZONTAL) ===== */}
                <div className="produk-horizontal">
                  {masterProdukData.length === 0 && (
                    <div className="empty">
                      Belum ada produk
                    </div>
                  )}

{masterProdukData.map(item => (
  <div
    key={item.ID_Produk}
    className="produk-card-mini"
    onClick={() => handleSelectProduk(item)}
  >
    <div className="produk-title">
      {item.Merek}
    </div>
    <div className="produk-subtitle">
      {item.Produk}
    </div>
  </div>
))}

                </div>
			 </>
            )}
          </div>
        </section>

        {/* ================= SECTION BAWAH ================= */}
        <section className="produksi-section bottom">
          <div className="produksi-card">
            <div className="card-header">
              <h3>Riwayat Produksi</h3>
            </div>

{loadingProduksi ? (
  <p>Memuat data produksi...</p>
) : produksiData.length === 0 ? (
  <div className="empty">
    Belum ada data produksi
  </div>
) : (
  <table className="produksi-table">
    <thead>
      <tr>
        <th>ID Produksi</th>
        <th>Tanggal</th>
        <th>Produk</th>
        <th>Qty</th>
        <th>Satuan</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {produksiData.map((row, i) => (
        <tr key={i}>
          <td>{row.ID_Produksi}</td>
          <td>{formatTanggalID(row.Tanggal)}</td>
          <td>{row.Merek} - {row.Produk}</td>
          <td>{row.Qty_Produksi}</td>
          <td>{row.Satuan_Produk}</td>
          <td>{row.Status_Produksi}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

          </div>
        </section>

        {modalOpen && (
          <ProduksiModal
            produk={selectedProduk}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </MainContainer>
  );
}
