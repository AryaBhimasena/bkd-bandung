"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TEMPLATE ================= */
export const TEMPLATE_LABA_RUGI = {
  pendapatan: [{ id_akun: "4114", nama_akun: "Pendapatan", nilai: 0 }],

  hpp: [{ id_akun: "5114", nama_akun: "HPP", nilai: 0 }],

  bebanOperasional: [
    { id_akun: "5115", nama_akun: "Biaya Jasa", nilai: 0 },
    { id_akun: "5116", nama_akun: "Biaya Gaji", nilai: 0 },
    { id_akun: "5117", nama_akun: "Biaya Listrik & Internet", nilai: 0 },
    { id_akun: "5118", nama_akun: "Biaya BPJS", nilai: 0 },
    { id_akun: "5119", nama_akun: "Biaya Operasional", nilai: 0 },
    { id_akun: "5120", nama_akun: "Biaya Pemasaran", nilai: 0 },
    { id_akun: "5121", nama_akun: "Biaya Transport", nilai: 0 },
    { id_akun: "5122", nama_akun: "Biaya Pemeliharaan", nilai: 0 },
    { id_akun: "5123", nama_akun: "Biaya Sewa", nilai: 0 },
    { id_akun: "5124", nama_akun: "Biaya Administrasi & Umum", nilai: 0 },
    { id_akun: "5125", nama_akun: "Biaya Depresiasi", nilai: 0 },
  ],

  bebanPajak: [{ id_akun: "5126", nama_akun: "Biaya Pajak", nilai: 0 }],
};

/* ================= HOOK ================= */
export function useLabaRugi(activeMonth, formatRupiah) {
  const [ledgerSummary, setLedgerSummary] = useState(TEMPLATE_LABA_RUGI);
  const previewRef = useRef(null);

  /* ================= PERIODE ================= */
  const { startDate, endDate } = useMemo(() => {
    if (!activeMonth) return {};

    const [year, month] = activeMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const f = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    return { startDate: f(start), endDate: f(end) };
  }, [activeMonth]);

  const periodeLabel = useMemo(() => {
    if (!startDate) return "";
    return new Date(startDate).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, [startDate]);

  /* ================= TOTAL ================= */
  const total = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);

    const totalPendapatan = sum(ledgerSummary.pendapatan);
    const totalHpp = sum(ledgerSummary.hpp);

    const labaKotor = totalPendapatan - totalHpp;

    const totalBebanOperasional = sum(ledgerSummary.bebanOperasional);
    const labaUsaha = labaKotor - totalBebanOperasional;

    const totalPajak = sum(ledgerSummary.bebanPajak);
    const labaBersih = labaUsaha - totalPajak;

    return {
      totalPendapatan,
      totalHpp,
      labaKotor,
      totalBebanOperasional,
      labaUsaha,
      labaBersih,
    };
  }, [ledgerSummary]);

  /* ================= UTIL ================= */
  const renderNilai = (v) =>
    v == null ? "-" : `Rp ${formatRupiah(v)}`;

  /* ================= LOAD DATA ================= */
useEffect(() => {
  if (!activeMonth || !startDate || !endDate) return;

  let cancelled = false;

  // reset ke template dulu
  setLedgerSummary(TEMPLATE_LABA_RUGI);

  apiPost("laporan.labaRugi", {
    periode_awal: startDate,
    periode_akhir: endDate,
  }).then((res) => {
    if (cancelled) return;

    const merge = (base = [], data = []) => {
      if (!Array.isArray(base)) base = [];
      if (!Array.isArray(data)) data = [];

      return base.map((row) => {
        const found = data.find((d) => d.id_akun === row.id_akun);
        return {
          ...row,
          nilai: found ? Number(found.nilai) : 0,
        };
      });
    };

    setLedgerSummary({
      pendapatan: merge(TEMPLATE_LABA_RUGI.pendapatan, res?.pendapatan),
      hpp: merge(TEMPLATE_LABA_RUGI.hpp, res?.hpp),
      bebanOperasional: merge(
        TEMPLATE_LABA_RUGI.bebanOperasional,
        res?.bebanOperasional
      ),
      bebanPajak: merge(TEMPLATE_LABA_RUGI.bebanPajak, res?.bebanPajak),
    });
  });

  return () => {
    cancelled = true;
  };
}, [activeMonth, startDate, endDate]);

  /* ================= EXPORT PDF ================= */
const handleExportPdf = async () => {
  if (!previewRef.current) return;

  const canvas = await html2canvas(previewRef.current, {
    scale: 1.2,                 // ⬅️ jangan 2 (terlalu besar)
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.8); // ⬅️ JPEG lebih ringan

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

  // Hitung agar selalu muat 1 halaman
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
    imgData,
    "JPEG",
    x,
    y,
    finalWidth,
    finalHeight,
    undefined,
    "FAST"
  );

  pdf.save(`Laporan-Laba-Rugi-${periodeLabel}.pdf`);
};

  return {
    ledgerSummary,
    total,
    renderNilai,
    previewRef,
    periodeLabel,
    handleExportPdf,
  };
}
