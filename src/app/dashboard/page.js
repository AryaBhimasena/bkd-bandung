"use client";

import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/dashboard.css";
import { useEffect, useState } from "react";
import {
  fetchMasterStock,
  fetchStockFIFO,
  fetchProduksi,
} from "@/lib/masterProdukHelper";


export default function DashboardPage() {
	const [bahanRoast, setBahanRoast] = useState([]);
	const [bahanGreen, setBahanGreen] = useState([]);
	const [produksiTerakhir, setProduksiTerakhir] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const [stockMenipis, setStockMenipis] = useState([]);
	const [pageStock, setPageStock] = useState(0);
	const PAGE_SIZE = 5;
	
	const [topProduksiBulanan, setTopProduksiBulanan] = useState([]);
	
	function formatTanggalID(value) {
	  if (!value) return "";
	  const d = new Date(value);
	  if (isNaN(d)) return "";
	  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
	}
	
	function isSameMonth(dateValue) {
	  const d = new Date(dateValue);
	  const now = new Date();

	  return (
		d.getMonth() === now.getMonth() &&
		d.getFullYear() === now.getFullYear()
	  );
	}

	async function loadDashboard() {
	  setLoading(true);

	  const [stockRes, fifoRes, produksiRes] = await Promise.all([
		fetchMasterStock(),
		fetchStockFIFO(),
		fetchProduksi(),
	  ]);

	  if (!stockRes?.success || !fifoRes?.success) {
		setLoading(false);
		return;
	  }

	  const masterStock = stockRes.data || [];
	  const fifo = fifoRes.data || [];

	  const sisaStockMap = hitungSisaStock(fifo);

	  const roast = [];
	  const green = [];

	  masterStock.forEach(stock => {
		const id = stock.ID_Stock;
		if (!id) return;

		const item = {
		  id,
		  nama: stock.Item,
		  qty: sisaStockMap[id] || 0,
		  satuan: stock.Satuan_Qty,
		};

		if (id.startsWith("BBR")) roast.push(item);
		if (id.startsWith("BBG")) green.push(item);
	  });

	  setBahanRoast(roast);
	  setBahanGreen(green);
	  
			const stockLainnya = [];

			masterStock.forEach(stock => {
			  const id = stock.ID_Stock;
			  if (!id) return;

			  // EXCLUDE bahan baku utama
			  if (id.startsWith("BBR") || id.startsWith("BBG")) return;

			  const qty = sisaStockMap[id] || 0;

			  stockLainnya.push({
				id,
				nama: stock.Item,
				qty,
				satuan: stock.Satuan_Qty,
			  });
			});

		const menipis = stockLainnya
		  .filter(s => s.qty <= 20)
		  .map(s => ({
			...s,
			status: s.qty === 0 ? "Habis" : "Hampir Habis",
		  }))
		  .sort((a, b) => a.qty - b.qty); // dari paling habis

		setStockMenipis(menipis);
		
		function hitungSisaStock(fifoData) {
		  const map = {};

		  fifoData.forEach(row => {
			const id = row.ID_Stock;
			const sisa = Number(row.Sisa_Stock) || 0;
			map[id] = (map[id] || 0) + sisa;
		  });

		  return map;
		}

		if (produksiRes?.success) {
		  const produksi = produksiRes.data || [];

		  // filter bulan ini (dan optional hanya Posted)
		  const bulanIni = produksi.filter(p =>
			isSameMonth(p.Tanggal)
			// && p.Status_Produksi === "Posted"
		  );

		  const map = {};

		  bulanIni.forEach(p => {
			const key = `${p.Merek} - ${p.Produk}`;
			const qty = Number(p.Qty_Produksi) || 0;

			map[key] = (map[key] || 0) + qty;
		  });

		  const top5 = Object.entries(map)
			.map(([produk, qty]) => ({ produk, qty }))
			.sort((a, b) => b.qty - a.qty)
			.slice(0, 5);

		  setTopProduksiBulanan(top5);

		  // tetap simpan produksi terakhir
		  setProduksiTerakhir(
			produksi.slice(-5).reverse()
		  );
		}

	  setLoading(false);
	}

	useEffect(() => {
	  loadDashboard();
	}, []);

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
			<div className="card bahan-utama-card stock-insight-card">

			  <div className="stock-insight-grid">

				{/* INSIGHT 1 — 40% */}
				<div className="stock-availability">
				  <h4>Ketersediaan Bahan Baku</h4>

				  <table className="bahan-table">
					<thead>
					  <tr>
						<th>Item</th>
						<th>Qty</th>
					  </tr>
					</thead>
					<tbody>
					  {bahanRoast.map(b => (
						<tr key={b.id}>
						  <td>{b.nama}</td>
						  <td
							  className={b.qty === 0 ? "qty-zero" : "qty-available"}
							>
							  {b.qty} {b.satuan}
							</td>
						</tr>
					  ))}
					  {bahanGreen.map(b => (
						<tr key={b.id}>
						  <td>{b.nama}</td>
							<td
							  className={b.qty === 0 ? "qty-zero" : "qty-available"}
							>
							  {b.qty} {b.satuan}
							</td>
						</tr>
					  ))}
					</tbody>
				  </table>
				</div>

				{/* INSIGHT 2 — 60% */}
				<div className="stock-critical">
				  <h4>Stock Menipis / Habis</h4>

				  <table className="bahan-table">
					<thead>
					  <tr>
						<th>No</th>
						<th>Item Stock</th>
						<th>Qty</th>
						<th>Status</th>
					  </tr>
					</thead>
					<tbody>
					  {stockMenipis
						.slice(pageStock * PAGE_SIZE, (pageStock + 1) * PAGE_SIZE)
						.map((s, i) => (
						  <tr key={s.id}>
							<td>{pageStock * PAGE_SIZE + i + 1}</td>
							<td>{s.nama}</td>
							<td
							  className={s.qty === 0 ? "qty-zero" : "qty-available"}
							>
							  {s.qty} {s.satuan}
							</td>
							<td>
							  <span
								className={`stock-status ${
								  s.status === "Habis" ? "habis" : "menipis"
								}`}
							  >
								{s.status}
							  </span>
							</td>
						  </tr>
						))}
					</tbody>
				  </table>

				  {/* PAGINATION */}
				  {stockMenipis.length > PAGE_SIZE && (
					<div className="pagination">
					  <button
						disabled={pageStock === 0}
						onClick={() => setPageStock(p => p - 1)}
					  >
						Prev
					  </button>
					  <button
						disabled={(pageStock + 1) * PAGE_SIZE >= stockMenipis.length}
						onClick={() => setPageStock(p => p + 1)}
					  >
						Next
					  </button>
					</div>
				  )}
				</div>

			  </div>
			</div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-right">
			<div className="card bahan-status-card">
			  <h4>Top Produksi Bulan Ini</h4>

			  {topProduksiBulanan.length === 0 ? (
				<p style={{ fontSize: 13, textAlign: "center", color: "#6b7280" }}>
				  Belum ada produksi bulan ini
				</p>
			  ) : (
				<table className="bahan-table">
				  <thead>
					<tr>
					  <th>No</th>
					  <th>Produk</th>
					  <th>Qty</th>
					</tr>
				  </thead>
				  <tbody>
					{topProduksiBulanan.map((p, i) => (
					  <tr key={p.produk}>
						<td>{i + 1}</td>
						<td style={{ textAlign: "left" }}>{p.produk}</td>
						<td>{p.qty}</td>
					  </tr>
					))}
				  </tbody>
				</table>
			  )}
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
					<tr key={p.ID_Produksi}>
					  <td>{p.ID_Produksi}</td>
					  <td>{formatTanggalID(p.Tanggal)}</td>
					  <td>{p.Merek} - {p.Produk}</td>
					  <td>{p.Qty_Produksi}</td>
					  <td>
						<span className={`status ${p.Status === "Posted" ? "posted" : "draft"}`}>
						  {p.Status_Produksi}
						</span>
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
