"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "@/styles/pages/perubahan-modal.css";

const bulanLabel = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agu","Sep","Okt","Nov","Des"
];

/* ================= TABLE ================= */

function PerubahanModalTable({ data, renderNilai }) {
  if (!data) return null;

  const {
    perubahan_modal = [],
    total_ekuitas_akhir = [],
  } = data;

  const jumlahBulan = total_ekuitas_akhir.length;

  return (
    <table className="pm-table">
      <thead>
        <tr>
          <th className="pm-sticky-col">Akun</th>
          {bulanLabel.slice(0, jumlahBulan).map(b => (
            <th key={b} className="pm-right">{b}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {perubahan_modal.map((row, i) => (
          <tr key={i}>
            <td className="pm-sticky-col">{row.akun}</td>
            {row.nilai.map((v, idx) => (
              <td key={idx} className="pm-right">
                {renderNilai(v)}
              </td>
            ))}
          </tr>
        ))}

        <tr className="pm-total-row">
          <td className="pm-sticky-col">Total Ekuitas Akhir</td>
          {total_ekuitas_akhir.map((v, i) => (
            <td key={i} className="pm-right pm-bold">
              {renderNilai(v)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/* ================= PAGE ================= */

export default function PerubahanModalView({ activeMonth, formatRupiah }) {
  const previewRef = useRef(null);
  const [data, setData] = useState(null);

  /* ================= TAHUN ================= */

  const year = useMemo(() => {
    if (!activeMonth) return null;
    return Number(activeMonth.split("-")[0]);
  }, [activeMonth]);

  const periodeLabel = useMemo(() => {
    if (!year) return "";
    return `Tahun ${year}`;
  }, [year]);

  /* ================= FETCH API ================= */

  useEffect(() => {
    if (!year) return;

    const fetchData = async () => {
      try {
        const periodeAwal = `${year}-01-01`;
        const periodeAkhir = `${year}-12-31`;

        const res = await apiGet("laporan.perubahanModal", {
          periode_awal: periodeAwal,
          periode_akhir: periodeAkhir,
        });

        if (!res.success) {
          console.error("Gagal ambil data:", res.message);
          return;
        }

        // ✅ Endpoint baru langsung dipakai
        setData(res.data);

      } catch (err) {
        console.error("Error fetch laporan perubahan modal:", err.message);
      }
    };

    fetchData();
  }, [year]);

  /* ================= FORMAT ================= */

  const renderNilai = v =>
    v == null || v === 0
      ? "-"
      : v < 0
      ? `(${formatRupiah(Math.abs(v))})`
      : `${formatRupiah(v)}`;

  /* ================= EXPORT ================= */

  async function handleExportPDF() {
    const node = previewRef.current;

    node.classList.remove("mode-preview");
    node.classList.add("mode-print");

    const canvas = await html2canvas(node, {
      scale: 1.4,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.75);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    const imgW = pdfW;
    const imgH = (canvas.height * imgW) / canvas.width;

    const y = (pdfH - imgH) / 2;

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      y,
      imgW,
      imgH,
      undefined,
      "FAST"
    );

    pdf.save(`Perubahan-Modal-${year}.pdf`);

    node.classList.remove("mode-print");
    node.classList.add("mode-preview");
  }

  /* ================= RENDER ================= */

  return (
    <div className="perubahan-modal-page">

      <button className="pm-btn-export" onClick={handleExportPDF}>
        Export PDF
      </button>

      <div
        ref={previewRef}
        className="pm-preview-paper pm-mode-preview"
      >

        <div className="pm-header">
          <div className="pm-header-title">LAPORAN PERUBAHAN MODAL</div>
          <div className="pm-header-company">PT. Bejana Kopi Dunia</div>
          <div className="pm-header-periode">Periode : {periodeLabel}</div>
        </div>

        <PerubahanModalTable
          data={data}
          renderNilai={renderNilai}
        />

      </div>

    </div>
  );
}
