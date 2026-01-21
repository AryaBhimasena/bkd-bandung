"use client";

import { useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import "@/styles/pages/laba-rugi.css";

export default function LabaRugiView({ periode, formatRupiah }) {

  /* ======================================================
     TEMPLATE AKUN (WAJIB SELALU TAMPIL)
  ====================================================== */
	const template = {
	  pendapatan: [
		{ id_akun: "4110", nama_akun: "Pendapatan Usaha", nilai: null },
	  ],

	  hpp: [
		{ id_akun: "5110", nama_akun: "HPP", nilai: null },
	  ],

	  bebanOperasional: [
		{ id_akun: "5120", nama_akun: "Beban Jasa", nilai: null },
		{ id_akun: "5130", nama_akun: "Beban Gaji Karyawan", nilai: null },
		{ id_akun: "5140", nama_akun: "Beban Listrik, Internet, PDAM", nilai: null },
		{ id_akun: "5150", nama_akun: "Beban BPJS", nilai: null },
		{ id_akun: "5160", nama_akun: "Beban Operasional", nilai: null },
		{ id_akun: "5170", nama_akun: "Beban Pemasaran", nilai: null },
		{ id_akun: "5180", nama_akun: "Beban Transport", nilai: null },
		{ id_akun: "5190", nama_akun: "Beban Pemeliharaan", nilai: null },
		{ id_akun: "5200", nama_akun: "Beban Sewa", nilai: null },
		{ id_akun: "5210", nama_akun: "Beban Administrasi & Umum", nilai: null },
	  ],

	  bebanNonKas: [
		{ id_akun: "5220", nama_akun: "Beban Depresiasi", nilai: null },
	  ],

	  bebanPajak: [
		{ id_akun: "5230", nama_akun: "Beban Pajak", nilai: null },
	  ],
	};

  const [ledgerSummary, setLedgerSummary] = useState(template);

  /* ======================================================
     LOAD & MERGE DATA (TIDAK MENGHAPUS TEMPLATE)
  ====================================================== */
useEffect(() => {
  console.log("[LabaRugi] useEffect triggered");

  if (!periode?.startDate || !periode?.endDate) {
    console.warn("[LabaRugi] Periode belum lengkap", periode);
    return;
  }

  const payload = {
    periode_awal: periode.startDate,
    periode_akhir: periode.endDate,
  };

  console.log("[LabaRugi] Request payload", payload);

  apiPost("laporan.labaRugi", payload)
    .then((res) => {
      console.log("[LabaRugi] Response API", res);

      if (!res) {
        console.warn("[LabaRugi] Response kosong / null");
        return;
      }

      const merge = (base, data = []) =>
        base.map((row) => {
          const found = data.find((d) => d.id_akun === row.id_akun);
          return {
            ...row,
            nilai: found ? found.nilai : null,
          };
        });

      const mergedData = {
        pendapatan: merge(template.pendapatan, res.pendapatan),
        hpp: merge(template.hpp, res.hpp),
        bebanOperasional: merge(
          template.bebanOperasional,
          res.bebanOperasional
        ),
        bebanNonKas: merge(template.bebanNonKas, res.bebanNonKas),
        bebanPajak: merge(template.bebanPajak, res.bebanPajak),
      };

      console.log("[LabaRugi] Merged result", mergedData);

      setLedgerSummary(mergedData);
    })
    .catch((err) => {
      console.error("[LabaRugi] API error", err);
    });
}, [periode.startDate, periode.endDate]);

  /* ======================================================
     HELPER RENDER NILAI
  ====================================================== */
  const renderNilai = (v) =>
    v === null || v === undefined ? "-" : `Rp ${formatRupiah(v)}`;

  /* ======================================================
     TOTAL (HANYA HITUNG NILAI VALID)
  ====================================================== */
  const total = useMemo(() => {
    const sum = (arr) =>
      arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);

    const totalPendapatan = sum(ledgerSummary.pendapatan);
    const totalHpp = sum(ledgerSummary.hpp);
    const labaKotor = totalPendapatan - totalHpp;

    const totalBebanOperasional = sum(ledgerSummary.bebanOperasional);
    const totalBebanNonKas = sum(ledgerSummary.bebanNonKas);
    const labaUsaha =
      labaKotor - totalBebanOperasional - totalBebanNonKas;

    const totalPajak = sum(ledgerSummary.bebanPajak);
    const labaBersih = labaUsaha - totalPajak;

    return {
      totalPendapatan,
      totalHpp,
      labaKotor,
      totalBebanOperasional,
      totalBebanNonKas,
      labaUsaha,
      totalPajak,
      labaBersih,
    };
  }, [ledgerSummary]);

  /* ======================================================
     RENDER — SECTION TIDAK PERNAH HILANG
  ====================================================== */
  return (
<div className="laporan-block">
  <h3>Laporan Laba Rugi</h3>
  <p className="muted">
    Periode {periode.startDate} s.d {periode.endDate}
  </p>

  <div className="laporan-list">

    {/* ================= Pendapatan ================= */}
    <div className="group-title">Pendapatan Usaha</div>
    {ledgerSummary.pendapatan.map((row) => (
      <div key={row.id_akun} className="row indent">
        <span>{row.nama_akun}</span>
        <span>{renderNilai(row.nilai)}</span>
      </div>
    ))}
    <div className="row total">
      <span>Total Pendapatan</span>
      <span>{renderNilai(total.totalPendapatan)}</span>
    </div>

    {/* ================= HPP ================= */}
    <div className="group-title">Harga Pokok Penjualan</div>
    {ledgerSummary.hpp.map((row) => (
      <div key={row.id_akun} className="row indent">
        <span>{row.nama_akun}</span>
        <span>{renderNilai(row.nilai)}</span>
      </div>
    ))}
    <div className="row total">
      <span>Total HPP</span>
      <span>{renderNilai(total.totalHpp)}</span>
    </div>

    {/* ================= Laba Kotor ================= */}
    <div className="row subtotal">
      <span>Laba Kotor</span>
      <span>{renderNilai(total.labaKotor)}</span>
    </div>

    {/* ================= Beban Operasional ================= */}
    <div className="group-title">Beban Operasional</div>
    {ledgerSummary.bebanOperasional.map((row) => (
      <div key={row.id_akun} className="row indent">
        <span>{row.nama_akun}</span>
        <span>{renderNilai(row.nilai)}</span>
      </div>
    ))}

    {/* ================= Beban Non Kas ================= */}
    <div className="group-title">Beban Non Kas</div>
    {ledgerSummary.bebanNonKas.map((row) => (
      <div key={row.id_akun} className="row indent">
        <span>{row.nama_akun}</span>
        <span>{renderNilai(row.nilai)}</span>
      </div>
    ))}

    {/* ================= Laba Usaha ================= */}
    <div className="row subtotal">
      <span>Laba Usaha</span>
      <span>{renderNilai(total.labaUsaha)}</span>
    </div>

    {/* ================= Beban Pajak ================= */}
    <div className="group-title">Beban Pajak</div>
    {ledgerSummary.bebanPajak.map((row) => (
      <div key={row.id_akun} className="row indent">
        <span>{row.nama_akun}</span>
        <span>{renderNilai(row.nilai)}</span>
      </div>
    ))}

    {/* ================= Laba Bersih ================= */}
    <div className="row final">
      <span>Laba Bersih</span>
      <span>{renderNilai(total.labaBersih)}</span>
    </div>

  </div>
</div>

  );
}
