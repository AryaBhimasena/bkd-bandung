"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/keuangan.css";

import KeuanganRingkasanPage from "./ringkasan/KeuanganRingkasanPage";
import ModalTransaksi from "@/components/modal/ModalTransaksi";
import { submitTransaksi } from "@/lib/ModalTransaksiHelper";
import { apiPost } from "@/lib/api";

import LaporanKeuanganPage from "./laporan/page";

export default function KeuanganPage() {
  /* ================= STATE ================= */
  const [activeMainTab, setActiveMainTab] = useState("ringkasan");

  const [bankSummary, setBankSummary] = useState([]);
  const [recentTrx, setRecentTrx] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  /* ================= SUBMIT ================= */
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

  /* ================= FETCHER ================= */
  async function loadKeuanganData() {
    setLoading(true);
    try {
      const bankRes = await apiPost("masterBank.list");
      if (!bankRes.success) {
        throw new Error(bankRes.message);
      }

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
      if (!trxRes.success) {
        throw new Error(trxRes.message);
      }

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
      alert(err.message);
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

        {/* TAB UTAMA */}
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

        {/* ACTION */}
        <div className="keuangan-action-bar">
          <button
            className="btn-primary"
            onClick={() => setOpenModal(true)}
          >
            + Tambah Transaksi
          </button>
        </div>

        {/* RINGKASAN */}
        {activeMainTab === "ringkasan" && (
          <KeuanganRingkasanPage
            bankSummary={bankSummary}
            recentTrx={recentTrx}
            loading={loading}
            formatRupiah={formatRupiah}
          />
        )}

        {/* LAPORAN */}
        {activeMainTab === "laporan" && (
          <section className="keuangan-section full">
            <LaporanKeuanganPage embedded />
          </section>
        )}
      </div>

      <ModalTransaksi
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitTransaksi}
      />
    </MainContainer>
  );
}
