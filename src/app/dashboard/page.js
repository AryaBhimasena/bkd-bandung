"use client";

import { useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/dashboard.css";

export default function DashboardPage() {
  /* ================= FILTER ================= */
  const [dateRange, setDateRange] = useState({
    start: "2026-03-01",
    end: "2026-03-31",
  });

  const [showBankDetail, setShowBankDetail] = useState(true);

  /* ================= DUMMY DATA ================= */

  const kasBank = {
    total: 42000000,
    trend: [
      { date: "01 Mar", value: 10000000 },
      { date: "10 Mar", value: 15000000 },
      { date: "20 Mar", value: 20000000 },
      { date: "27 Mar", value: 42000000 },
    ],
    accounts: [
      { name: "Bank Mandiri - 10003", saldo: 25000000 },
      { name: "BCA - 110004", saldo: 15000000 },
      { name: "BRI - 110005", saldo: 2000000 },
    ],
  };

  const labaRugi = {
    total: 0,
    trend: [
      { date: "01 Mar", pemasukan: 0, biaya: 0, laba: 0 },
      { date: "15 Mar", pemasukan: 0, biaya: 0, laba: 0 },
      { date: "31 Mar", pemasukan: 0, biaya: 0, laba: 0 },
    ],
  };

  function formatRupiah(val) {
    return new Intl.NumberFormat("id-ID").format(val || 0);
  }

  /* ================= CHART HOVER ================= */
  const [hoverPoint, setHoverPoint] = useState(null);

  function handleHover(point) {
    setHoverPoint(point);
  }

  function clearHover() {
    setHoverPoint(null);
  }

/* ================= CHART UTILS ================= */
function buildPath(data, width, height) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));

  const stepX = width / (data.length - 1);

  return data.map((d, i) => {
    const x = i * stepX;
    const y =
      height -
      ((d.value - min) / (max - min || 1)) * height;

    return `${i === 0 ? "M" : "L"} ${x},${y}`;
  }).join(" ");
}

function buildAreaPath(data, width, height) {
  const line = buildPath(data, width, height);
  return `${line} L ${width},${height} L 0,${height} Z`;
}

  /* ================= RENDER ================= */
  return (
    <MainContainer title="Dashboard">
      <div className="dashboard-page">

        {/* HEADER */}
        <div className="dashboard-header">
          <div className="dashboard-filter">
            <button className="dashboard-date">
              1 Mar 2026 - 31 Mar 2026
            </button>

            <button className="dashboard-reset">✕</button>
          </div>
        </div>

        {/* GRID */}
        <div className="dashboard-grid">

          {/* ================= KAS & BANK ================= */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Kas & Bank</h3>
              <span>Rp {formatRupiah(kasBank.total)}</span>
            </div>

            {/* CHART */}
			<div className="dashboard-chart">
			  <svg viewBox="0 0 300 120" className="dashboard-svg">

				{/* AREA */}
				<path
				  d={buildAreaPath(kasBank.trend, 300, 120)}
				  className="dashboard-area"
				/>

				{/* LINE */}
				<path
				  d={buildPath(kasBank.trend, 300, 120)}
				  className="dashboard-line"
				/>

				{/* DOT */}
				{kasBank.trend.map((p, i) => {
				  const max = Math.max(...kasBank.trend.map(d => d.value));
				  const min = Math.min(...kasBank.trend.map(d => d.value));

				  const x = (i / (kasBank.trend.length - 1)) * 300;
				  const y =
					120 -
					((p.value - min) / (max - min || 1)) * 120;

				  return (
					<circle
					  key={i}
					  cx={x}
					  cy={y}
					  r={hoverPoint === p ? 5 : 3}
					  className="dashboard-dot"
					  onMouseEnter={() => handleHover(p)}
					  onMouseLeave={clearHover}
					/>
				  );
				})}
			  </svg>

			  {/* TOOLTIP */}
			  {hoverPoint && (
				<div className="dashboard-tooltip">
				  <div>{hoverPoint.date}</div>
				  <strong>Rp {formatRupiah(hoverPoint.value)}</strong>
				</div>
			  )}
			</div>

            {/* DETAIL */}
            <div className="dashboard-card-footer">
              <button
                onClick={() => setShowBankDetail(!showBankDetail)}
              >
                {showBankDetail ? "Sembunyikan detail ↑" : "Tampilkan detail ↓"}
              </button>

              {showBankDetail && (
                <div className="dashboard-list">
                  {kasBank.accounts.map((acc, i) => (
                    <div key={i} className="dashboard-list-item">
                      <span>{acc.name}</span>
                      <span>Rp {formatRupiah(acc.saldo)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= PIUTANG ================= */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Piutang</h3>
              <span>Rp 0</span>
            </div>

            <div className="dashboard-empty">
              Tidak ada data
            </div>
          </div>

          {/* ================= HUTANG ================= */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Hutang</h3>
              <span>Rp 0</span>
            </div>

            <div className="dashboard-empty">
              Tidak ada data
            </div>
          </div>

          {/* ================= LABA RUGI ================= */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Laba Rugi</h3>
              <span>Rp {formatRupiah(labaRugi.total)}</span>
            </div>

            <div className="dashboard-chart small">
              Grafik laba rugi
            </div>
          </div>

        </div>
      </div>
    </MainContainer>
  );
}