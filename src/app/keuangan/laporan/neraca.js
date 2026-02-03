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

  return (
    <div className="neraca-table">

      <div>
        <div className="group-title">Aset Lancar</div>
        {data.asetLancar.map((r) => (
          <div key={r.id_akun} className="row indent">
            <span>{r.nama_akun}</span>
            <span>{renderNilai(r.nilai)}</span>
          </div>
        ))}
        <div className="row total">
          <span>Total Aset Lancar</span>
          <span>Rp {formatRupiah(total.totalAsetLancar)}</span>
        </div>

        <div className="group-title">Aset Tetap</div>
        {data.asetTidakLancar.map((r) => (
          <div
            key={r.id_akun}
            className={`row indent ${r.nilai < 0 ? "muted" : ""}`}
          >
            <span>{r.nama_akun}</span>
            <span>{renderSigned(r.nilai)}</span>
          </div>
        ))}

        <div className="row final balance-total">
          <span>Total Aset</span>
          <span>Rp {formatRupiah(total.totalAset)}</span>
        </div>
      </div>

      <div>
        <div className="group-title">Liabilitas</div>
        {data.liabilitasJangkaPendek.map((r) => (
          <div key={r.id_akun} className="row indent">
            <span>{r.nama_akun}</span>
            <span>{renderNilai(r.nilai)}</span>
          </div>
        ))}
        <div className="row total">
          <span>Total Liabilitas</span>
          <span>Rp {formatRupiah(total.totalLiabilitas)}</span>
        </div>

        <div className="group-title">Ekuitas</div>
        {data.ekuitas.map((r) => (
          <div
            key={r.id_akun}
            className={`row indent ${r.nilai < 0 ? "muted" : ""}`}
          >
            <span>{r.nama_akun}</span>
            <span>{renderSigned(r.nilai)}</span>
          </div>
        ))}

        <div className="row final balance-total">
          <span>Total Liabilitas & Ekuitas</span>
          <span>Rp {formatRupiah(total.totalLiabilitasEkuitas)}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function NeracaView({ activeMonth, formatRupiah }) {

  const previewRef = useRef(null);

  /* ================= TEMPLATE ================= */

  const TEMPLATE = useMemo(
    () => ({
      asetLancar: [
        { id_akun: "1111", nama_akun: "Kas", nilai: null },
        { id_akun: "1112", nama_akun: "Bank", nilai: null },
        { id_akun: "1116", nama_akun: "Persediaan", nilai: null },
        { id_akun: "1117", nama_akun: "Piutang Usaha", nilai: null },
        { id_akun: "1119", nama_akun: "PPh 22", nilai: null },
        { id_akun: "1118", nama_akun: "PPh 23", nilai: null },
        { id_akun: "1120", nama_akun: "PPh 25", nilai: null },
        { id_akun: "1121", nama_akun: "PPN Masukan", nilai: null },
        { id_akun: "1122", nama_akun: "PPN Instansi", nilai: null },
      ],
      asetTidakLancar: [
        { id_akun: "1211", nama_akun: "Aset Tetap", nilai: null },
        { id_akun: "1212", nama_akun: "Akumulasi Penyusutan", nilai: null },
      ],
      liabilitasJangkaPendek: [
        { id_akun: "2111", nama_akun: "Hutang", nilai: null },
        { id_akun: "2121", nama_akun: "PPN Keluaran", nilai: null },
      ],
      ekuitas: [
        { id_akun: "3111", nama_akun: "Modal Disetor", nilai: null },
        { id_akun: "3112", nama_akun: "Prive / Dividen", nilai: null },
        { id_akun: "3113", nama_akun: "Laba Ditahan", nilai: null },
      ],
    }),
    []
  );

  const [ledgerSummary, setLedgerSummary] = useState(TEMPLATE);

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
    setLedgerSummary(TEMPLATE);

    apiPost("laporan.neraca", {
      periode_awal: startDate,
      periode_akhir: endDate,
    }).then((res) => {
      if (cancelled) return;

      const merge = (base, data = []) =>
        base.map((r) => {
          const f = data.find((d) => d.id_akun === r.id_akun);
          return { ...r, nilai: f ? f.nilai : null };
        });

      setLedgerSummary({
        asetLancar: merge(TEMPLATE.asetLancar, res?.asetLancar),
        asetTidakLancar: merge(TEMPLATE.asetTidakLancar, res?.asetTidakLancar),
        liabilitasJangkaPendek: merge(
          TEMPLATE.liabilitasJangkaPendek,
          res?.liabilitasJangkaPendek
        ),
        ekuitas: merge(TEMPLATE.ekuitas, res?.ekuitas),
      });
    });

    return () => (cancelled = true);
  }, [activeMonth, startDate, endDate]);

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    const sum = (a) => a.reduce((x, y) => x + (Number(y.nilai) || 0), 0);

    const totalAsetLancar = sum(ledgerSummary.asetLancar);
    const totalAsetTidakLancar = sum(ledgerSummary.asetTidakLancar);

    const totalLiabilitas = sum(ledgerSummary.liabilitasJangkaPendek);
    const totalEkuitas = sum(ledgerSummary.ekuitas);

    return {
      totalAsetLancar,
      totalAsetTidakLancar,
      totalAset: totalAsetLancar + totalAsetTidakLancar,
      totalLiabilitas,
      totalEkuitas,
      totalLiabilitasEkuitas: totalLiabilitas + totalEkuitas,
    };
  }, [ledgerSummary]);

  /* ================= EXPORT ================= */

  async function handleExportPDF() {
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
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
