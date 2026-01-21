"use client";

import { useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
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

/* ================= PAGE ================= */
export default function LaporanKeuanganPage() {
  const [activeTab, setActiveTab] = useState("laba-rugi");
  const [periode, setPeriode] = useState(initPeriode);

  const { bulan, startDate, endDate } = periode;
  const [year, month] = bulan.split("-").map(Number);

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

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
    <MainContainer title="Laporan Keuangan">
      <div className="laporan-page">

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

          {activeTab === "catatan" && (
            <div className="laporan-block narrative">
              <h3>Catatan atas Laporan Keuangan</h3>
              <p>
                Laporan disusun berdasarkan prinsip akuntansi yang berlaku umum
                untuk entitas tanpa akuntabilitas publik.
              </p>
            </div>
          )}
        </section>
      </div>
    </MainContainer>
  );
}
