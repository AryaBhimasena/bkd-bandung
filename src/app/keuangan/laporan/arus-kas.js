"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "@/lib/api";
import "@/styles/pages/arus-kas.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TABLE ================= */
function Group({ title, rows, totalLabel, totalValue, renderNilai }) {
  return (
    <>
      <div className="group-title">{title}</div>

      {rows.map((r, i) => (
        <div key={i} className="row indent">
          <span>{r.akun}</span>
          <span>{renderNilai(r.nilai)}</span>
        </div>
      ))}

      <div className="row total">
        <span>{totalLabel}</span>
        <span>{renderNilai(totalValue)}</span>
      </div>
    </>
  );
}

function ArusKasTable({ data, renderNilai }) {
  return (
    <div className="arus-kas-table">
      <Group
        title="Arus Kas dari Aktivitas Operasi"
        rows={data.operasi}
        totalLabel="Kas Bersih dari Aktivitas Operasi"
        totalValue={data.totalOperasi}
        renderNilai={renderNilai}
      />

      <Group
        title="Arus Kas dari Aktivitas Investasi"
        rows={data.investasi}
        totalLabel="Kas Bersih dari Aktivitas Investasi"
        totalValue={data.totalInvestasi}
        renderNilai={renderNilai}
      />

      <Group
        title="Arus Kas dari Aktivitas Pendanaan"
        rows={data.pendanaan}
        totalLabel="Kas Bersih dari Aktivitas Pendanaan"
        totalValue={data.totalPendanaan}
        renderNilai={renderNilai}
      />

      <div className="row final">
        <span>Kenaikan (Penurunan) Kas Bersih</span>
        <span>
          {renderNilai(
            data.totalOperasi +
            data.totalInvestasi +
            data.totalPendanaan
          )}
        </span>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function ArusKasView({ activeMonth, formatRupiah }) {
  const previewRef = useRef(null);
  const [data, setData] = useState(null);

  /* ================= PERIODE ================= */

  const { startDate, endDate } = useMemo(() => {
    if (!activeMonth) return {};
    const [y, m] = activeMonth.split("-").map(Number);

    const f = d =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    return {
      startDate: f(new Date(y, m - 1, 1)),
      endDate: f(new Date(y, m, 0))
    };
  }, [activeMonth]);

  const periodeLabel = useMemo(() => {
    if (!startDate) return "";
    return new Date(startDate).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric"
    });
  }, [startDate]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!startDate || !endDate) return;

    setData(null);

    apiGet("laporan.arusKas", {
      periode_awal: startDate,
      periode_akhir: endDate
    }).then(res => {
      setData(res); // backend sudah lengkap
    });

  }, [startDate, endDate]);

  /* ================= FORMAT ================= */

  const renderNilai = v =>
    v == null
      ? "-"
      : v < 0
      ? `(Rp ${formatRupiah(Math.abs(v))})`
      : `Rp ${formatRupiah(v)}`;

  /* ================= EXPORT ================= */

async function handleExportPDF() {
  const canvas = await html2canvas(previewRef.current, {
    scale: 1.2, // cukup 1.2 agar tetap tajam & ringan
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const img = canvas.toDataURL("image/jpeg", 0.8);

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

  // Hitung scale agar muat dalam 1 halaman
  const ratio = Math.min(
    pageWidth / imgWidth,
    pageHeight / imgHeight
  );

  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  // Center di halaman
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

  pdf.save(`Arus-Kas-${periodeLabel}.pdf`);
}

  if (!data) return null;

  /* ================= RENDER ================= */

  return (
    <div className="report-page">

      <section className="editor-section">
        <div className="laporan-header">
          <h3>Laporan Arus Kas</h3>
          <p className="muted">{periodeLabel}</p>
        </div>

        <ArusKasTable data={data} renderNilai={renderNilai} />
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

          <ArusKasTable data={data} renderNilai={renderNilai} />
        </div>
      </section>

    </div>
  );
}
