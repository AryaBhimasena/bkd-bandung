"use client";

import { useMemo } from "react";
import "@/styles/pages/keuangan-ringkasan.css";

export default function KeuanganRingkasanPage({
  periode,
  bankSummary = [],
  recentTrx = [],
  loading = false,
  formatRupiah,
}) {
  /* ================================
     KPI TOTAL SALDO
  ================================ */
  const totalSaldo = useMemo(() => {
    return bankSummary.reduce((total, bank) => {
      return total + (bank.saldo || 0);
    }, 0);
  }, [bankSummary]);

  const totalMasuk = recentTrx
    .filter((t) => t.tipe === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalKeluar = recentTrx
    .filter((t) => t.tipe === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  const labaRugi = totalMasuk - totalKeluar;

/* ================================
   HELPER FORMAT TANGGAL
================================ */
function formatTanggal(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (isNaN(d)) return value;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

  return (
    <div className="keuangan-ringkasan">
      {/* ===== HEADER + FILTER ===== */}
      <div className="ringkasan-header">
        <h2>Ringkasan Keuangan</h2>

        <div className="ringkasan-filter">
          <select defaultValue={periode}>
            <option value="2026-01">Jan 2026</option>
            <option value="2025-12">Des 2025</option>
          </select>

          <select defaultValue="all">
            <option value="all">Semua Lini Bisnis</option>
            <option value="trading">Trading</option>
            <option value="roastery">Roastery</option>
            <option value="penjualan">Penjualan</option>
          </select>
        </div>
      </div>

      {/* ===== KPI ===== */}
      <section className="ringkasan-kpi">
        <div className="kpi-card accent-neutral">
          <span className="kpi-title">Total Saldo</span>
          <div className="kpi-value mono">
            <span className="rp">Rp</span>
            <span>{formatRupiah(totalSaldo)}</span>
          </div>
        </div>

        <div className="kpi-card accent-in">
          <span className="kpi-title">Pemasukan</span>
          <div className="kpi-value mono">
            <span className="rp">Rp</span>
            <span>{formatRupiah(totalMasuk)}</span>
          </div>
        </div>

        <div className="kpi-card accent-out">
          <span className="kpi-title">Pengeluaran</span>
          <div className="kpi-value mono">
            <span className="rp">Rp</span>
            <span>{formatRupiah(totalKeluar)}</span>
          </div>
        </div>

        <div
          className={`kpi-card accent-profit ${
            labaRugi < 0 ? "negative" : ""
          }`}
        >
          <span className="kpi-title">Laba / Rugi</span>
          <div className="kpi-value mono">
            <span className="rp">Rp</span>
            <span>{formatRupiah(labaRugi)}</span>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="ringkasan-main">
        {/* ===== POSISI KAS & BANK ===== */}
        <section className="ringkasan-section card">
          <div className="section-header">
            <h3>Posisi Kas & Bank</h3>
          </div>

          {loading ? (
            <p className="loading-text">Memuat saldo...</p>
          ) : (
            <table className="ringkasan-table">
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>No. Rekening</th>
                  <th>Lini Bisnis</th>
                  <th className="text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {bankSummary.map((bank, i) => (
                  <tr key={i}>
                    <td>{bank.bank}</td>
                    <td>{bank.noRekening || "-"}</td>
                    <td>{bank.liniBisnis || "-"}</td>
                    <td className="amount-cell">
                      <span className="rp">Rp</span>
                      <span className="amount">
                        {formatRupiah(bank.saldo)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>
                    <strong>Total Saldo</strong>
                  </td>
                  <td className="amount-cell total">
                    <span className="rp">Rp</span>
                    <span className="amount">
                      {formatRupiah(totalSaldo)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </section>

		{/* ===== AKTIVITAS TERAKHIR ===== */}
		<section className="ringkasan-section card">
		  <div className="section-header">
			<h3>Aktivitas Terakhir</h3>
		  </div>

		  {loading ? (
			<p className="loading-text">Memuat transaksi...</p>
		  ) : (
			<table className="ringkasan-table trx-table">
			  <thead>
				<tr>
				  <th>Tanggal</th>
				  <th>Bank</th>
				  <th>Lini Bisnis</th>
				  <th>Keterangan</th>
				  <th className="text-right">Masuk</th>
				  <th className="text-right">Keluar</th>
				</tr>
			  </thead>
			  <tbody>
				{recentTrx.slice(0, 10).map((row, i) => (
				  <tr key={i}>
					<td>{formatTanggal(row.tanggal)}</td>
					<td>{row.bank || "-"}</td>
					<td>{row.liniBisnis || "-"}</td>
					<td>{row.keterangan}</td>

					<td className="trx-amount in">
					  {row.tipe === "IN" ? (
						<>
						  <span className="trx-rp">Rp</span>
						  <span className="trx-value">
							{formatRupiah(row.amount)}
						  </span>
						</>
					  ) : (
						<span className="trx-dash">–</span>
					  )}
					</td>

					<td className="trx-amount out">
					  {row.tipe === "OUT" ? (
						<>
						  <span className="trx-rp">Rp</span>
						  <span className="trx-value">
							{formatRupiah(row.amount)}
						  </span>
						</>
					  ) : (
						<span className="trx-dash">–</span>
					  )}
					</td>
				  </tr>
				))}
			  </tbody>
			</table>
		  )}
		</section>
      </div>
    </div>
  );
}
