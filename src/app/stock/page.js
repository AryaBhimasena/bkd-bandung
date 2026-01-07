"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/stock.css";

import {
  fetchStockFIFO,
  filterStockData,
} from "@/lib/stockHelper";

import InputStockModal from "@/components/modal/inputStockModal";

export default function StockPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  async function loadStock() {
    setLoading(true);
    const res = await fetchStockFIFO();
    if (res?.success) {
      setData(res.data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStock();
  }, []);

  useEffect(() => {
    const result = filterStockData(data, {
      search,
      status: filterStatus,
    });
    setFilteredData(result);
  }, [data, search, filterStatus]);

  return (
    <MainContainer title="Stock">
      <div className="stock-page">
        <div className="stock-header">
          <h1>Snapshot Stock (FIFO)</h1>

          <div className="stock-actions">
            <input
              type="text"
              placeholder="Cari Ref / Nama Stock"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Stock</option>
              <option value="available">Stock Tersedia</option>
              <option value="empty">Stock Habis</option>
            </select>

            <button
              className="btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Penerimaan Stock
            </button>
          </div>
        </div>

        <div className="stock-table-wrapper">
          {loading ? (
            <p>Memuat data stock...</p>
          ) : (
            <table className="stock-table">
              <thead>
                <tr>
                  <th>ID Ref</th>
                  <th>Tanggal</th>
                  <th>Nama Stock</th>
                  <th>Kategori</th>
                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Harga / Qty</th>
                  <th>Sisa Stock</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty">
                      Tidak ada data
                    </td>
                  </tr>
                )}

                {filteredData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.ID_Ref}</td>
                    <td>{row.Tanggal_Display}</td>
                    <td>{row.Stock_Nama}</td>
                    <td>{row.Stock_Kategori}</td>
                    <td>{row.Qty}</td>
                    <td>{row.Satuan_Qty}</td>
                    <td>{row.Harga}</td>
                    <td>{row.Sisa_Stock}</td>
                    <td>{row.Total_Amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <InputStockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadStock}
      />
    </MainContainer>
  );
}
