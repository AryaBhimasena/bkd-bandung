"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "@/lib/api";
import "@/styles/pages/arus-kas.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TABLE ================= */

function ArusKasTable({ arusKas, total, renderNilai }) {
  const operasiMasuk = arusKas.operasi.filter(
    (r) => r.id_akun === "4110"
  );
  const operasiKeluar = arusKas.operasi.filter(
    (r) => r.id_akun !== "4110"
  );

  return (
    <div className="arus-kas-table">

      <div className="group-title">
        Arus Kas dari Aktivitas Operasi
      </div>

      <div className="sub-group-title">Penerimaan Kas</div>
      {operasiMasuk.map((row) => (
        <div key={row.id_akun} className="row indent">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
        </div>
      ))}

      <div className="sub-group-title">Pengeluaran Kas</div>
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

      <div className="row final">
        <span>Kenaikan (Penurunan) Kas</span>
        <span>{renderNilai(total.kenaikanKas)}</span>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function ArusKasView({ activeMonth, formatRupiah }) {

  const previewRef = useRef(null);

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

  /* ===== PERIODE STANDARD (SAMA DENGAN NERACA) ===== */

  const { startDate, endDate } = useMemo(() => {
    if (!activeMonth) return {};
    const [y, m] = activeMonth.split("-").map(Number);

    const f = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    return {
      startDate: f(new Date(y, m - 1, 1)),
      endDate: f(new Date(y, m, 0)),
    };
  }, [activeMonth]);

  const periodeLabel = useMemo(() => {
    if (!startDate) return "";
    return new Date(startDate).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, [startDate]);

  /* ===== LOAD ===== */

  useEffect(() => {
    if (!startDate || !endDate) return;

    apiPost("laporan.arusKas", {
      periode_awal: startDate,
      periode_akhir: endDate,
    }).then((res) => {
      const merge = (base, data = []) =>
        base.map((r) => {
          const f = data.find((d) => d.id_akun === r.id_akun);
          return { ...r, nilai: f ? f.nilai : null };
        });

      setArusKas({
        operasi: merge(template.operasi, res?.operasi),
        investasi: merge(template.investasi, res?.investasi),
        pendanaan: merge(template.pendanaan, res?.pendanaan),
      });
    });
  }, [startDate, endDate]);

  /* ===== TOTAL ===== */

  const total = useMemo(() => {
    const sum = (a) => a.reduce((x, y) => x + (Number(y.nilai) || 0), 0);

    const totalOperasi = sum(arusKas.operasi);
    const totalInvestasi = sum(arusKas.investasi);
    const totalPendanaan = sum(arusKas.pendanaan);

    return {
      totalOperasi,
      totalInvestasi,
      totalPendanaan,
      kenaikanKas: totalOperasi + totalInvestasi + totalPendanaan,
    };
  }, [arusKas]);

  const renderNilai = (v) =>
    v == null
      ? "-"
      : v < 0
      ? `(Rp ${formatRupiah(Math.abs(v))})`
      : `Rp ${formatRupiah(v)}`;

  /* ===== EXPORT ===== */

  async function handleExportPDF() {
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`Arus-Kas-${periodeLabel}.pdf`);
  }

  /* ===== RENDER ===== */

  return (
    <div className="report-page">

      <section className="editor-section">
        <div className="laporan-header">
          <h3>Laporan Arus Kas</h3>
          <p className="muted">{periodeLabel}</p>
        </div>

        <ArusKasTable
          arusKas={arusKas}
          total={total}
          renderNilai={renderNilai}
        />
      </section>

      <section className="preview-section">

        <button className="btn-export" onClick={handleExportPDF}>
          Export PDF
        </button>

        <div ref={previewRef} className="preview-paper">
          <div className="laporan-header">
            <h3>Laporan Arus Kas</h3>
            <p className="muted">{periodeLabel}</p>
          </div>

          <ArusKasTable
            arusKas={arusKas}
            total={total}
            renderNilai={renderNilai}
          />
        </div>

      </section>
    </div>
  );
}
