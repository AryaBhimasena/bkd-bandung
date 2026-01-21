"use client";

import { useState } from "react";
import LabaRugiView from "./laba-rugi";
import NeracaView from "./neraca";
import ArusKasView from "./arus-kas";
import "@/styles/pages/laporan-keuangan.css";

/* ================= HELPER ================= */
const getToday = () => new Date().toISOString().slice(0, 10);

const initPeriode = () => {
  const now = new Date();
  const bulan = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  return {
    bulan,
    startDate: `${bulan}-01`,
    endDate: getToday(),
  };
};

const getLastDayOfMonth = (year, month) =>
  new Date(year, month, 0).toISOString().slice(0, 10);

const isCurrentMonth = (year, month) => {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() + 1 === month;
};

/* ================= COMPONENT ================= */
export default function LaporanKeuanganView({
  activeTab,
  setActiveTab,
  formatRupiah,
  embedded = false,
}) {
  const [periode, setPeriode] = useState(initPeriode);

  const { bulan, startDate, endDate } = periode;
  const [year, month] = bulan.split("-").map(Number);

  const handleChangeBulan = (value) => {
    const [y, m] = value.split("-").map(Number);

    setPeriode({
      bulan: value,
      startDate: `${value}-01`,
      endDate: isCurrentMonth(y, m)
        ? getToday()
        : getLastDayOfMonth(y, m),
    });
  };

  return (
    <div className={`laporan-page ${embedded ? "embedded" : ""}`}>
      {/* ===== HEADER ===== */}
      <section className="laporan-header">
        <div>
          <h2>Laporan Keuangan</h2>
          <p className="subtitle">
            Disusun berdasarkan SAK ETAP (Basis Akrual)
          </p>
        </div>

        <div className="periode-control">
          <label>Periode Bulan</label>
          <input
            type="month"
            value={bulan}
            onChange={(e) => handleChangeBulan(e.target.value)}
          />

          <div className="periode-range">
            <div>
              <label>Tanggal Awal</label>
              <input type="date" value={startDate} disabled />
            </div>

            <div>
              <label>Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                min={`${bulan}-01`}
                max={getLastDayOfMonth(year, month)}
                onChange={(e) =>
                  setPeriode((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAB ===== */}
      <nav className="laporan-tabs">
        {[
          ["laba-rugi", "Laba Rugi"],
          ["neraca", "Neraca"],
          ["arus-kas", "Arus Kas"],
          ["catatan", "Catatan"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={activeTab === key ? "active" : ""}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ===== CONTENT ===== */}
      <section className="laporan-content">
        {activeTab === "laba-rugi" && (
          <LabaRugiView periode={periode} formatRupiah={formatRupiah} />
        )}

        {activeTab === "neraca" && (
          <NeracaView periode={periode} formatRupiah={formatRupiah} />
        )}

        {activeTab === "arus-kas" && (
          <ArusKasView periode={periode} formatRupiah={formatRupiah} />
        )}
      </section>
    </div>
  );
}
