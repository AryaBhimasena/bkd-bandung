"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import LabaRugiView from "./laba-rugi";
import NeracaView from "./neraca";
import ArusKasView from "./arus-kas";

import "@/styles/pages/laporan-keuangan.css";

/* ================= PAGE ================= */
export default function LaporanKeuanganPage({ embedded = false }) {
  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("laba-rugi");

  const now = new Date();
  const [activeMonth, setActiveMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  /* ================= MONTH NAV ================= */
  function shiftMonth(delta) {
    const [y, m] = activeMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);

    setActiveMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  /* ================= UI DERIVED ================= */
  const monthNames = [
    "Januari","Februari","Maret","April",
    "Mei","Juni","Juli","Agustus",
    "September","Oktober","November","Desember"
  ];

  const [year, month] = useMemo(
    () => activeMonth.split("-").map(Number),
    [activeMonth]
  );

  const visibleMonths = [
    monthNames[(month + 10) % 12],
    monthNames[month - 1],
    monthNames[month % 12],
  ];

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  /* ================= RENDER ================= */
  return (
    <div className={`laporan-page ${embedded ? "embedded" : ""}`}>

      {/* ===== HEADER ===== */}
      <section className="laporan-header">
        <div className="laporan-title">
          <h2>Laporan Keuangan</h2>
          <p className="subtitle">
            Disusun berdasarkan SAK ETAP (Basis Akrual)
          </p>
        </div>

        <div className="periode-bulanan">
          <button className="periode-nav" onClick={() => shiftMonth(-1)}>
            <ChevronLeft size={18} />
          </button>

          <div className="month-viewport">
            <div className="month-track">
              {visibleMonths.map((m, idx) => (
                <div
                  key={`${m}-${idx}`}
                  className={`month-item ${idx === 1 ? "active" : ""}`}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          <button className="periode-nav" onClick={() => shiftMonth(1)}>
            <ChevronRight size={18} />
          </button>

          <div className="year-display">{year}</div>
        </div>
      </section>

      {/* ===== TAB ===== */}
      <nav className="laporan-tabs">
        {[
          ["laba-rugi", "Laba Rugi"],
          ["neraca", "Neraca"],
          ["arus-kas", "Arus Kas"],
          ["perubahan-modal", "Perubahan Modal"],
          ["tahunan", "Laporan Tahunan"],
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
          <LabaRugiView
            activeMonth={activeMonth}
            formatRupiah={formatRupiah}
          />
        )}

        {activeTab === "neraca" && (
          <NeracaView
            activeMonth={activeMonth}
            formatRupiah={formatRupiah}
          />
        )}

        {activeTab === "arus-kas" && (
          <ArusKasView
            activeMonth={activeMonth}
            formatRupiah={formatRupiah}
          />
        )}
      </section>
    </div>
  );
}
