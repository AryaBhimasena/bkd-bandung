"use client";

import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/dashboard.css";

export default function DashboardPage() {
  const bahanUtama = [
    { nama: "Greenbean Arabica", qty: 100, nilai: 1200000 },
    { nama: "Greenbean Robusta", qty: 80, nilai: 960000 },
    { nama: "Roastbean Arabica", qty: 50, nilai: 600000 },
    { nama: "Roastbean Robusta", qty: 40, nilai: 480000 },
  ];

  // Untuk section kanan
  const bahanHabis = [
    { jenis: "Label", namaProduk: "Monsoon Espresso", tanggalTerakhir: "04-01-2026" },
    { jenis: "Label", namaProduk: "Robusta 200gr", tanggalTerakhir: "03-01-2026" },
  ];

  const bahanROPs = [
    { jenis: "Label" },
    { jenis: "Kemasan" },
    { jenis: "Packaging" },
  ];

  const produksiTerakhir = [
    { id: "PRD-001", tanggal: "05-01-2026", produk: "Arabica Gayo 200gr", qty: 50, status: "Draft" },
    { id: "PRD-002", tanggal: "04-01-2026", produk: "Toraja 200gr", qty: 40, status: "Posted" },
    { id: "PRD-003", tanggal: "03-01-2026", produk: "Robusta 200gr", qty: 30, status: "Posted" },
    { id: "PRD-004", tanggal: "02-01-2026", produk: "Arabica 500gr", qty: 20, status: "Draft" },
    { id: "PRD-005", tanggal: "01-01-2026", produk: "Toraja 500gr", qty: 25, status: "Posted" },
  ];

  return (
    <MainContainer title="Dashboard">
      <div className="dashboard-page">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Ringkasan stock & produksi harian</p>
        </div>

        {/* SECTION ATAS */}
        <div className="dashboard-top-section">
          
          {/* LEFT */}
          <div className="dashboard-left">
            <div className="card bahan-utama-card">
              <h3>List Bahan Baku Kopi Utama</h3>
              <table className="bahan-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Bahan</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bahanUtama.map((b, idx) => (
                    <tr key={b.nama}>
                      <td>{idx + 1}</td>
                      <td>{b.nama}</td>
                      <td>{b.qty}</td>
                      <td>Rp {b.nilai.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-right">
            <div className="card bahan-status-card">
              
              <h4>Bahan Habis</h4>
              <ul>
                {bahanHabis.map((b, idx) => (
                  <li key={idx}>
                    {idx + 1}. {b.jenis} - {b.namaProduk} ({b.tanggalTerakhir})
                  </li>
                ))}
              </ul>

              <h4>Mendekati Re-Order Point</h4>
              <ul>
                {bahanROPs.map((b, idx) => (
                  <li key={idx}>{idx + 1}. {b.jenis}</li>
                ))}
              </ul>

            </div>
          </div>
        </div>

        {/* SECTION BAWAH */}
        <div className="dashboard-bottom-section">
          <h2>Produksi Terakhir</h2>
          <table>
            <thead>
              <tr>
                <th>ID Produksi</th>
                <th>Tanggal</th>
                <th>Produk</th>
                <th>Qty Produksi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produksiTerakhir.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.tanggal}</td>
                  <td>{p.produk}</td>
                  <td>{p.qty}</td>
                  <td>
                    <span className={`status ${p.status === "Posted" ? "posted" : "draft"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </MainContainer>
  );
}
