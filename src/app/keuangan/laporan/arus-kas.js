"use client";

import { useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import "@/styles/pages/arus-kas.css";

export default function ArusKasView({ periode, formatRupiah }) {

  /* ======================================================
     TEMPLATE AKUN (WAJIB SELALU TAMPIL)
  ====================================================== */
const template = {
  operasi: [
    { id_akun: "4110", nama_akun: "Pendapatan Usaha", nilai: null },

    { id_akun: "5110", nama_akun: "Pembayaran HPP", nilai: null },
    { id_akun: "5120", nama_akun: "Pembayaran Beban Jasa", nilai: null },
    { id_akun: "5130", nama_akun: "Pembayaran Beban Gaji", nilai: null },
    { id_akun: "5140", nama_akun: "Pembayaran Beban Utilitas", nilai: null },
    { id_akun: "5150", nama_akun: "Pembayaran Beban BPJS", nilai: null },
    { id_akun: "5160", nama_akun: "Pembayaran Beban Operasional Lainnya", nilai: null },
    { id_akun: "5170", nama_akun: "Pembayaran Beban Pemasaran", nilai: null },
    { id_akun: "5180", nama_akun: "Pembayaran Beban Transport", nilai: null },
    { id_akun: "5190", nama_akun: "Pembayaran Beban Pemeliharaan", nilai: null },
    { id_akun: "5200", nama_akun: "Pembayaran Beban Sewa", nilai: null },
    { id_akun: "5210", nama_akun: "Pembayaran Beban Administrasi & Umum", nilai: null },

    { id_akun: "5230", nama_akun: "Pembayaran Pajak", nilai: null },
  ],

  investasi: [
    { id_akun: "1160", nama_akun: "Perolehan Aset Tetap", nilai: null },
  ],

  pendanaan: [
    { id_akun: "3110", nama_akun: "Setoran Modal", nilai: null },
    { id_akun: "3120", nama_akun: "Tambahan Modal Disetor", nilai: null },
    { id_akun: "3130", nama_akun: "Prive / Dividen", nilai: null },
  ],
};

  const [arusKas, setArusKas] = useState(template);

  /* ======================================================
     LOAD & MERGE DATA (POLA SAMA DENGAN LABA RUGI)
  ====================================================== */
  useEffect(() => {
    console.log("[ArusKas] useEffect triggered");

    if (!periode?.startDate || !periode?.endDate) {
      console.warn("[ArusKas] Periode belum lengkap", periode);
      return;
    }

    const payload = {
      periode_awal: periode.startDate,
      periode_akhir: periode.endDate,
    };

    console.log("[ArusKas] Request payload", payload);

    apiPost("laporan.arusKas", payload)
      .then((res) => {
        console.log("[ArusKas] Response API", res);

        if (!res) {
          console.warn("[ArusKas] Response kosong / null");
          return;
        }

        const merge = (base, data = []) =>
          base.map((row) => {
            const found = data.find(
              (d) => d.id_akun === row.id_akun
            );
            return {
              ...row,
              nilai: found ? found.nilai : null,
            };
          });

        const mergedData = {
          operasi: merge(template.operasi, res.operasi),
          investasi: merge(template.investasi, res.investasi),
          pendanaan: merge(template.pendanaan, res.pendanaan),
        };

        console.log("[ArusKas] Merged result", mergedData);

        setArusKas(mergedData);
      })
      .catch((err) => {
        console.error("[ArusKas] API error", err);
      });
  }, [periode.startDate, periode.endDate]);

  /* ======================================================
     HELPER RENDER NILAI
  ====================================================== */
  const renderNilai = (v) =>
    v === null || v === undefined
      ? "-"
      : v < 0
      ? `(Rp ${formatRupiah(Math.abs(v))})`
      : `Rp ${formatRupiah(v)}`;

  /* ======================================================
     TOTAL (HANYA HITUNG NILAI VALID)
  ====================================================== */
  const total = useMemo(() => {
    const sum = (arr) =>
      arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);

    const totalOperasi = sum(arusKas.operasi);
    const totalInvestasi = sum(arusKas.investasi);
    const totalPendanaan = sum(arusKas.pendanaan);

    return {
      totalOperasi,
      totalInvestasi,
      totalPendanaan,
      kenaikanKas:
        totalOperasi + totalInvestasi + totalPendanaan,
    };
  }, [arusKas]);
  
const operasiMasuk = arusKas.operasi.filter(
  (r) => r.id_akun === "4110"
);

const operasiKeluar = arusKas.operasi.filter(
  (r) => r.id_akun !== "4110"
);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="laporan-block">
      <h3>Laporan Arus Kas</h3>
      <p className="muted">
        Periode {periode.startDate} s.d {periode.endDate}
      </p>

{/* ================= OPERASI ================= */}
<div className="group-title">
  Arus Kas dari Aktivitas Operasi
</div>

{/* --- PENERIMAAN --- */}
<div className="sub-group-title">
  Penerimaan Kas
</div>
{operasiMasuk.map((row) => (
  <div key={row.id_akun} className="row indent">
    <span>{row.nama_akun}</span>
    <span>{renderNilai(row.nilai)}</span>
  </div>
))}

{/* --- PENGELUARAN --- */}
<div className="sub-group-title">
  Pengeluaran Kas
</div>
{operasiKeluar.map((row) => (
  <div key={row.id_akun} className="row indent">
    <span>{row.nama_akun}</span>
    <span>{renderNilai(row.nilai)}</span>
  </div>
))}

<div className="row total">
  <span>Kas Bersih dari Aktivitas Operasi</span>
  <span>{renderNilai(total.totalOperasi)}</span>
</div>


      {/* ================= INVESTASI ================= */}
      <div className="group-title">
        Arus Kas dari Aktivitas Investasi
      </div>
      {arusKas.investasi.map((row) => (
        <div key={row.id_akun} className="row indent">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
        </div>
      ))}
      <div className="row total">
        <span>Kas Bersih dari Aktivitas Investasi</span>
        <span>{renderNilai(total.totalInvestasi)}</span>
      </div>

      {/* ================= PENDANAAN ================= */}
      <div className="group-title">
        Arus Kas dari Aktivitas Pendanaan
      </div>
      {arusKas.pendanaan.map((row) => (
        <div key={row.id_akun} className="row indent">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
        </div>
      ))}
      <div className="row total">
        <span>Kas Bersih dari Aktivitas Pendanaan</span>
        <span>{renderNilai(total.totalPendanaan)}</span>
      </div>

      {/* ================= FINAL ================= */}
      <div className="row final">
        <span>Kenaikan (Penurunan) Kas</span>
        <span>{renderNilai(total.kenaikanKas)}</span>
      </div>
    </div>
  );
}
