"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "@/lib/api";
import "@/styles/pages/neraca.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TABLE COMPONENT ================= */

function NeracaTable({ data, total, formatRupiah }) {
  const renderNilai = (v) =>
    v == null ? "-" : `Rp ${formatRupiah(v)}`;

  const renderSigned = (v) =>
    v == null
      ? "-"
      : v < 0
      ? `(${formatRupiah(Math.abs(v))})`
      : `Rp ${formatRupiah(v)}`;

  const renderRows = (rows, signed = false) =>
    rows?.length ? (
      rows.map((r) => (
        <div
          key={r.id_akun}
          className={`row indent ${signed && r.nilai < 0 ? "muted" : ""}`}
        >
          <span>{r.nama_akun}</span>
          <span>{signed ? renderSigned(r.nilai) : renderNilai(r.nilai)}</span>
        </div>
      ))
    ) : (
      <div className="row indent muted">Tidak ada data</div>
    );

  return (
    <div className="neraca-table">

      {/* ===== ASET ===== */}
      <div>
        <div className="group-title">Aset Lancar</div>
        {renderRows(data.asetLancar)}
        <div className="row total">
          <span>Total Aset Lancar</span>
          <span>Rp {formatRupiah(total.totalAsetLancar)}</span>
        </div>

        <div className="group-title">Aset Tidak Lancar</div>
        {renderRows(data.asetTidakLancar, true)}

        <div className="row final balance-total">
          <span>Total Aset</span>
          <span>Rp {formatRupiah(total.totalAset)}</span>
        </div>
      </div>

      {/* ===== KEWAJIBAN & EKUITAS ===== */}
      <div>
        <div className="group-title">Kewajiban Jangka Pendek</div>
        {renderRows(data.kewajibanJangkaPendek)}
        <div className="row total">
          <span>Total Kewajiban</span>
          <span>Rp {formatRupiah(total.totalKewajiban)}</span>
        </div>

        <div className="group-title">Ekuitas</div>
        {renderRows(data.ekuitas, true)}

        <div className="row final balance-total">
          <span>Total Kewajiban & Ekuitas</span>
          <span>Rp {formatRupiah(total.totalKewajibanEkuitas)}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function NeracaView({ activeMonth, formatRupiah }) {
  const previewRef = useRef(null);

  const [ledgerSummary, setLedgerSummary] = useState({
    asetLancar: [],
    asetTidakLancar: [],
    kewajibanJangkaPendek: [],
    kewajibanJangkaPanjang: [],
    ekuitas: [],
  });

  /* ================= PERIODE ================= */

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

  /* ================= LOAD ================= */

  useEffect(() => {
    if (!activeMonth) return;

    let cancelled = false;

    apiPost("laporan.neraca", {
      periode_awal: startDate,
      periode_akhir: endDate,
    }).then((res) => {
      if (cancelled) return;

      setLedgerSummary({
        asetLancar: res?.asetLancar || [],
        asetTidakLancar: res?.asetTidakLancar || [],
        kewajibanJangkaPendek: res?.kewajibanJangkaPendek || [],
        kewajibanJangkaPanjang: res?.kewajibanJangkaPanjang || [],
        ekuitas: res?.ekuitas || [],
      });
    });

    return () => (cancelled = true);
  }, [activeMonth, startDate, endDate]);

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    const sum = (a = []) =>
      a.reduce((x, y) => x + (Number(y.nilai) || 0), 0);

    const totalAsetLancar = sum(ledgerSummary.asetLancar);
    const totalAsetTidakLancar = sum(ledgerSummary.asetTidakLancar);

    const totalKewajiban =
      sum(ledgerSummary.kewajibanJangkaPendek) +
      sum(ledgerSummary.kewajibanJangkaPanjang);

    const totalEkuitas = sum(ledgerSummary.ekuitas);

    return {
      totalAsetLancar,
      totalAsetTidakLancar,
      totalAset: totalAsetLancar + totalAsetTidakLancar,
      totalKewajiban,
      totalEkuitas,
      totalKewajibanEkuitas: totalKewajiban + totalEkuitas,
    };
  }, [ledgerSummary]);

  /* ================= EXPORT ================= */

async function handleExportPDF() {
  if (!previewRef.current) return;

  const canvas = await html2canvas(previewRef.current, {
    scale: 1.2,                 // ⬅️ turunkan dari 2
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const img = canvas.toDataURL("image/jpeg", 0.8); // ⬅️ JPEG lebih ringan

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Hitung rasio supaya muat 1 halaman
  const ratio = Math.min(
    pageWidth / imgWidth,
    pageHeight / imgHeight
  );

  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  // Center
  const x = (pageWidth - finalWidth) / 2;
  const y = (pageHeight - finalHeight) / 2;

  pdf.addImage(
    img,
    "JPEG",
    x,
    y,
    finalWidth,
    finalHeight,
    undefined,
    "FAST"
  );

  pdf.save(`Neraca-${periodeLabel}.pdf`);
}

  /* ================= RENDER ================= */

  return (
    <div className="report-page">

      {/* ===== LEFT ===== */}
      <section className="editor-section">
        <div className="laporan-header">
          <h3>Laporan Posisi Keuangan</h3>
          <p className="company-name">PT. Bejana Kopi Dunia</p>
          <p className="muted">{periodeLabel}</p>
        </div>

        <NeracaTable
          data={ledgerSummary}
          total={total}
          formatRupiah={formatRupiah}
        />
      </section>

      {/* ===== RIGHT ===== */}
      <section className="preview-section">
	    <button className="btn-export" onClick={handleExportPDF}>
          Export PDF
        </button>
        <div ref={previewRef} className="preview-paper">
          <div className="laporan-header">
            <h3>Laporan Posisi Keuangan</h3>
			<p className="company-name">PT. Bejana Kopi Dunia</p>
            <p className="muted">{periodeLabel}</p>
          </div>

          <NeracaTable
            data={ledgerSummary}
            total={total}
            formatRupiah={formatRupiah}
          />
        </div>
      </section>
    </div>
  );
}
