"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/produksi.css";

import ProduksiModal from "@/components/modal/produksiModal";

import {
  fetchMasterProduk,
} from "@/lib/masterProdukHelper";

export default function ProduksiPage() {
  /* ================================
     MASTER PRODUK STATE
  ================================= */
  const [masterProdukData, setMasterProdukData] = useState([]);
  const [loadingProduk, setLoadingProduk] = useState(false);

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

  /* ================================
     EFFECT
  ================================= */
  useEffect(() => {
    loadMasterProduk();
  }, []);

  /* ================================
     HANDLER
  ================================= */
  const handleSelectProduk = (item) => {
    setSelectedProduk(item);
    setModalOpen(true);
  };

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
                      key={`${item.Merek}-${item.Produk}`}
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

            <div className="empty">
              Belum ada data produksi
            </div>
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
