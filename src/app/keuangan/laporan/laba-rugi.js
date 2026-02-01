"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "@/styles/pages/laba-rugi.css";

function LabaRugiTable({ ledgerSummary, total, renderNilai }) {
  return (
    <div className="table">
      <div className="thead">
        <span>Uraian</span>
        <span>Nominal</span>
        <span>Total</span>
      </div>

      {ledgerSummary.pendapatan.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total Pendapatan</span>
        <span />
        <span>{renderNilai(total.totalPendapatan)}</span>
      </div>

      <div className="group">Harga Pokok Penjualan</div>

      {ledgerSummary.hppDetail.map((row) => (
        <div key={row.key} className="trow">
          <span>{row.nama}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total HPP</span>
        <span />
        <span>{renderNilai(total.totalHpp)}</span>
      </div>

      <div className="trow subtotal">
        <span>Laba Kotor</span>
        <span />
        <span>{renderNilai(total.labaKotor)}</span>
      </div>

      <div className="group">Beban Operasional</div>

      {ledgerSummary.bebanOperasional.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total Beban Operasional</span>
        <span />
        <span>{renderNilai(total.labaKotor - total.labaUsaha)}</span>
      </div>

      <div className="trow subtotal">
        <span>Laba Usaha</span>
        <span />
        <span>{renderNilai(total.labaUsaha)}</span>
      </div>

      <div className="group">Beban Pajak</div>

      {ledgerSummary.bebanPajak.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow subtotal final">
        <span>Laba Bersih</span>
        <span />
        <span>{renderNilai(total.labaBersih)}</span>
      </div>
    </div>
  );
}

export default function LabaRugiView({ activeMonth, formatRupiah }) {
  /* ================= TEMPLATE ================= */
  const TEMPLATE = useMemo(
    () => ({
      pendapatan: [
        { id_akun: "4114", nama_akun: "Pendapatan Usaha", nilai: null },
      ],
      hppDetail: [
        { key: "awal", nama: "Persediaan Awal", nilai: null },
        { key: "pembelian", nama: "Pembelian", nilai: null },
        { key: "akhir", nama: "Persediaan Akhir", nilai: null },
      ],
      bebanOperasional: [
        { id_akun: "5115", nama_akun: "Biaya Sehubungan dengan Jasa", nilai: null },
        { id_akun: "5116", nama_akun: "Biaya Gaji Karyawan", nilai: null },
        { id_akun: "5117", nama_akun: "Biaya Listrik, Internet, PDAM", nilai: null },
        { id_akun: "5118", nama_akun: "Biaya BPJS", nilai: null },
        { id_akun: "5119", nama_akun: "Biaya Operasional", nilai: null },
        { id_akun: "5120", nama_akun: "Biaya Pemasaran", nilai: null },
        { id_akun: "5121", nama_akun: "Biaya Transport", nilai: null },
        { id_akun: "5122", nama_akun: "Biaya Pemeliharaan", nilai: null },
        { id_akun: "5223", nama_akun: "Biaya Sewa", nilai: null },
        { id_akun: "5224", nama_akun: "Biaya Administrasi & Umum", nilai: null },
        { id_akun: "5225", nama_akun: "Biaya Depresiasi", nilai: null },
      ],
      bebanPajak: [
        { id_akun: "5230", nama_akun: "Beban Pajak", nilai: null },
      ],
    }),
    []
  );

  const [ledgerSummary, setLedgerSummary] = useState(TEMPLATE);
  const previewRef = useRef(null);

  /* ================= TOTAL ================= */
  const total = useMemo(() => {
    const sum = (arr) =>
      arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);

    const totalPendapatan = sum(ledgerSummary.pendapatan);

    const hppAwal = Number(ledgerSummary.hppDetail[0]?.nilai || 0);
    const hppPembelian = Number(ledgerSummary.hppDetail[1]?.nilai || 0);
    const hppAkhir = Number(ledgerSummary.hppDetail[2]?.nilai || 0);
    const totalHpp = hppAwal + hppPembelian - hppAkhir;

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

	const { startDate, endDate } = useMemo(() => {
	  if (!activeMonth) return {};

	  const [year, month] = activeMonth.split("-").map(Number);

	  const start = new Date(year, month - 1, 1);
	  const end = new Date(year, month, 0);

	  const f = (d) =>
		  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
			d.getDate()
		  ).padStart(2, "0")}`;

	  return {
		startDate: f(start),
		endDate: f(end),
	  };
	}, [activeMonth]);

	const periodeLabel = useMemo(() => {
	  if (!startDate) return "";
	  return new Date(startDate).toLocaleDateString("id-ID", {
		month: "long",
		year: "numeric",
	  });
	}, [startDate]);

  /* ================= LOAD DATA ================= */
	useEffect(() => {
	  if (!activeMonth) return;

	  let cancelled = false;

	  // reset LANGSUNG sebelum fetch
	  setLedgerSummary(TEMPLATE);

	  apiPost("laporan.labaRugi", {
		periode_awal: startDate,
		periode_akhir: endDate,
	  }).then((res) => {
		if (cancelled) return;

		const merge = (base, data = []) =>
		  base.map((row) => {
			const found = data.find((d) => d.id_akun === row.id_akun);
			return { ...row, nilai: found ? found.nilai : null };
		  });

		setLedgerSummary({
		  pendapatan: merge(TEMPLATE.pendapatan, res?.pendapatan),
		  hppDetail: [
			{ key: "awal", nama: "Persediaan Awal", nilai: res?.hppAwal || null },
			{ key: "pembelian", nama: "Pembelian", nilai: res?.hppPembelian || null },
			{ key: "akhir", nama: "Persediaan Akhir", nilai: res?.hppAkhir || null },
		  ],
		  bebanOperasional: merge(
			TEMPLATE.bebanOperasional,
			[...(res?.bebanOperasional || []), ...(res?.bebanNonKas || [])]
		  ),
		  bebanPajak: merge(TEMPLATE.bebanPajak, res?.bebanPajak),
		});
	  });

	  return () => {
		cancelled = true;
	  };
	}, [activeMonth, startDate, endDate]);

  /* ================= EXPORT PDF ================= */
  const handleExportPdf = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Laporan-Laba-Rugi-${periodeLabel}.pdf`);
  };

  /* ================= RENDER ================= */
  return (
    <div className="laba-rugi-page">
      {/* LEFT */}
      <section className="editor-section">
	    <h3>Laporan Laba Rugi - PT. Bejana Kopi Dunia</h3>
	    <p className="periode">{periodeLabel}</p>

	    <LabaRugiTable
		  ledgerSummary={ledgerSummary}
		  total={total}
		  renderNilai={renderNilai}
	    />
	  </section>

      {/* RIGHT */}
      <section className="preview-section">
        <div className="preview-header">
          <button onClick={handleExportPdf}>Export PDF</button>
        </div>

		<div ref={previewRef} className="preview-paper">
		  <h3>Laporan Laba Rugi - PT. Bejana Kopi Dunia</h3>
		  <p className="periode">{periodeLabel}</p>
		  <br />

		  <LabaRugiTable
			ledgerSummary={ledgerSummary}
			total={total}
			renderNilai={renderNilai}
		  />
		</div>

      </section>
    </div>
  );
}
