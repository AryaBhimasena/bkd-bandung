"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/keuangan.css";
import LaporanKeuanganView from "./laporan/LaporanKeuanganView";
import KeuanganRingkasanPage from "./ringkasan/KeuanganRingkasanPage";
import ModalTransaksi from "@/components/modal/ModalTransaksi";
import { submitTransaksi } from "@/lib/ModalTransaksiHelper";
import { apiPost } from "@/lib/api";

export default function KeuanganPage() {
  /* ================================
     STATE
  ================================= */
  const [activeMainTab, setActiveMainTab] = useState("ringkasan");
  const [activeReportTab, setActiveReportTab] = useState("laba-rugi");
  const [periode, setPeriode] = useState("2026-01");

  const [bankSummary, setBankSummary] = useState([]);
  const [recentTrx, setRecentTrx] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  /* ================================
     SUBMIT TRANSAKSI
  ================================= */
  const handleSubmitTransaksi = async (payload) => {
    try {
      await submitTransaksi(payload);
      alert("Transaksi berhasil disimpan");
      setOpenModal(false);
      loadKeuanganData();
    } catch (err) {
      alert(err.message);
    }
  };

/* ================================
   FETCHER
================================ */
async function loadKeuanganData() {
  console.log("=== LOAD KEUANGAN DATA: START ===");
  setLoading(true);

  try {
    /* =====================================================
       FETCH BANK & SALDO
    ===================================================== */
    console.log("[API] Request → masterBank.list");
    const bankRes = await apiPost("masterBank.list");
    console.log("[API] Response ← masterBank.list:", bankRes);

    if (!bankRes.success) {
      throw new Error(bankRes.message || "Gagal mengambil data bank");
    }

    console.log("[DATA] Raw bank data:", bankRes.data);

    const bankList = bankRes.data.map((item, index) => {
      const mapped = {
        id_bank: item.id_bank,
        bank: item.nama_bank,
        noRekening: item.nomor_rekening,
        liniBisnis: item.nama_lini_usaha,
        saldo: Number(item.saldo_akhir) || 0,
      };

      console.log(`[MAP] Bank #${index + 1}:`, mapped);
      return mapped;
    });

    console.log("[STATE] setBankSummary →", bankList);
    setBankSummary(bankList);

    /* =====================================================
       FETCH TRANSAKSI RINGKASAN (IN / OUT)
    ===================================================== */
    console.log("[API] Request → keuangan.transaksiRingkasan");
    const trxRes = await apiPost("keuangan.transaksiRingkasan");
    console.log(
      "[API] Response ← keuangan.transaksiRingkasan:",
      trxRes
    );

    if (!trxRes.success) {
      throw new Error(
        trxRes.message || "Gagal mengambil transaksi ringkasan"
      );
    }

    console.log("[DATA] Raw recent trx:", trxRes.data);

    const trxList = trxRes.data.map((trx, index) => {
      const mapped = {
        tanggal: trx.tanggal,
        bank: trx.bank,
        liniBisnis: trx.liniBisnis,
        keterangan: trx.keterangan,
        tipe: trx.tipe, // IN | OUT
        amount: Number(trx.amount) || 0,
      };

      console.log(`[MAP] Trx #${index + 1}:`, mapped);
      return mapped;
    });

    console.log("[STATE] setRecentTrx →", trxList);
    setRecentTrx(trxList);

    console.log("=== LOAD KEUANGAN DATA: SUCCESS ===");
  } catch (err) {
    console.error("❌ LOAD KEUANGAN DATA ERROR:", err);
    alert(err.message);
  } finally {
    setLoading(false);
    console.log("[STATE] setLoading(false)");
    console.log("=== LOAD KEUANGAN DATA: END ===");
  }
}

useEffect(() => {
  console.log("[HOOK] useEffect → loadKeuanganData()");
  loadKeuanganData();
}, []);


  /* ================================
     HELPER
  ================================= */
  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  /* ================================
     RENDER
  ================================= */
  return (
    <MainContainer title="Keuangan">
      <div className="keuangan-page">
        {/* ===== TAB UTAMA ===== */}
        <nav className="keuangan-main-tabs">
          <button
            className={activeMainTab === "ringkasan" ? "active" : ""}
            onClick={() => setActiveMainTab("ringkasan")}
          >
            Ringkasan
          </button>
          <button
            className={activeMainTab === "laporan" ? "active" : ""}
            onClick={() => setActiveMainTab("laporan")}
          >
            Laporan Keuangan
          </button>
        </nav>

        {/* ===== ACTION BAR ===== */}
        <div className="keuangan-action-bar">
          <button
            className="btn-primary"
            onClick={() => setOpenModal(true)}
          >
            + Tambah Transaksi
          </button>
        </div>

        {/* ================= RINGKASAN ================= */}
        {activeMainTab === "ringkasan" && (
          <KeuanganRingkasanPage
            periode={periode}
            bankSummary={bankSummary}
            recentTrx={recentTrx}
            loading={loading}
            formatRupiah={formatRupiah}
          />
        )}

        {/* ================= LAPORAN ================= */}
        {activeMainTab === "laporan" && (
          <section className="keuangan-section full">
            <LaporanKeuanganView
              embedded
              activeTab={activeReportTab}
              setActiveTab={setActiveReportTab}
              periode={periode}
              setPeriode={setPeriode}
              formatRupiah={formatRupiah}
            />
          </section>
        )}
      </div>

      {/* ===== MODAL TRANSAKSI ===== */}
      <ModalTransaksi
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitTransaksi}
      />
    </MainContainer>
  );
}
