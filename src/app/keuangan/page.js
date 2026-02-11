"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/keuangan.css";

import KeuanganRingkasanPage from "./ringkasan/KeuanganRingkasanPage";
import LaporanKeuanganPage from "./laporan/page";
import TambahTransaksiPage from "@/app/keuangan/transaksi/tambah-transaksi/page";
import DataTransaksiPage from "./transaksi/data-transaksi/page";
import JurnalUmumPage from "./transaksi/jurnal/page";
import LedgerPage from "./transaksi/ledger/page";

import { apiPost } from "@/lib/api";

function TransaksiPlaceholder({ title }) {
  return (
    <div className="transaksi-placeholder">
      <h3>{title}</h3>
      <p className="muted">
        Halaman ini belum diimplementasikan.
        <br />
        Silakan lanjutkan development modul ini.
      </p>
    </div>
  );
}

export default function KeuanganPage() {
  /* ================= MAIN TAB ================= */
  const [activeMainTab, setActiveMainTab] = useState("ringkasan");

  /* ================= SUB TAB TRANSAKSI ================= */
  const [activeTransaksiTab, setActiveTransaksiTab] = useState("tambah");
	const TRANSAKSI_TABS = {
	  tambah: {
		label: "Tambah Transaksi",
		component: () => <TambahTransaksiPage embedded />,
	  },
		data: {
		  label: "Data Transaksi",
		  component: () => <DataTransaksiPage embedded />,
		},
		jurnal: {
		  label: "Jurnal",
		  component: () => <JurnalUmumPage embedded />,
		},
		ledger: {
		  label: "Ledger",
		  component: () => <LedgerPage embedded />,
		},
	};

  /* ================= DATA ================= */
  const [bankSummary, setBankSummary] = useState([]);
  const [recentTrx, setRecentTrx] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCHER ================= */
  async function loadKeuanganData() {
    setLoading(true);
    try {
      const bankRes = await apiPost("masterBank.list");
      if (!bankRes.success) throw new Error(bankRes.message);

      setBankSummary(
        bankRes.data.map((item) => ({
          id_bank: item.id_bank,
          bank: item.nama_bank,
          noRekening: item.nomor_rekening,
          liniBisnis: item.nama_lini_usaha,
          saldo: Number(item.saldo_akhir) || 0,
        }))
      );

      const trxRes = await apiPost("keuangan.transaksiRingkasan");
      if (!trxRes.success) throw new Error(trxRes.message);

      setRecentTrx(
        trxRes.data.map((trx) => ({
          tanggal: trx.tanggal,
          bank: trx.bank,
          liniBisnis: trx.liniBisnis,
          keterangan: trx.keterangan,
          tipe: trx.tipe,
          amount: Number(trx.amount) || 0,
        }))
      );
    } catch (err) {
      alert(err.message || "Gagal memuat data keuangan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKeuanganData();
  }, []);

  /* ================= HELPER ================= */
  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  /* ================= RENDER ================= */
  return (
    <MainContainer title="Keuangan">
      <div className="keuangan-page">

        {/* ================= MAIN TAB ================= */}
        <nav className="keuangan-main-tabs">
          <button
            className={activeMainTab === "ringkasan" ? "active" : ""}
            onClick={() => setActiveMainTab("ringkasan")}
          >
            Ringkasan
          </button>

          <button
            className={activeMainTab === "transaksi" ? "active" : ""}
            onClick={() => setActiveMainTab("transaksi")}
          >
            Transaksi
          </button>

          <button
            className={activeMainTab === "laporan" ? "active" : ""}
            onClick={() => setActiveMainTab("laporan")}
          >
            Laporan Keuangan
          </button>
        </nav>

        {/* ================= RINGKASAN ================= */}
        {activeMainTab === "ringkasan" && (
          <KeuanganRingkasanPage
            bankSummary={bankSummary}
            recentTrx={recentTrx}
            loading={loading}
            formatRupiah={formatRupiah}
          />
        )}

        {/* ================= TRANSAKSI ================= */}
        {activeMainTab === "transaksi" && (
          <section className="keuangan-section full">

            {/* SUB TAB TRANSAKSI */}
			<nav className="keuangan-sub-tabs">
			  {Object.entries(TRANSAKSI_TABS).map(([key, tab]) => (
				<button
				  key={key}
				  className={activeTransaksiTab === key ? "active" : ""}
				  onClick={() => setActiveTransaksiTab(key)}
				>
				  {tab.label}
				</button>
			  ))}
			</nav>
            {/* SUB PAGE */}
			<div className="keuangan-sub-content">
			  {TRANSAKSI_TABS[activeTransaksiTab]?.component()}
			</div>
          </section>
        )}

        {/* ================= LAPORAN ================= */}
        {activeMainTab === "laporan" && (
          <section className="keuangan-section full">
            <LaporanKeuanganPage embedded />
          </section>
        )}
      </div>
    </MainContainer>
  );
}
