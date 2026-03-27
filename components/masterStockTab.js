"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

import MasterStockModal from "@/components/modal/masterStockModal";
import "@/styles/master-stock-tab.css";

export default function MasterStockTab({
  data = [],
  onSave,
  onDelete,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  /* ================================
     HANDLER
  ================================= */
  const handleAdd = () => {
    setEditingData(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpenModal(true);
  };

  const handleSubmit = (formData) => {
    onSave(formData);
    setOpenModal(false);
    setEditingData(null);
  };

  /* ================================
     FILTER & SEARCH
  ================================= */
  const kategoriOptions = useMemo(() => {
    const set = new Set(data.map(d => d.Kategori_Stock).filter(Boolean));
    return Array.from(set);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const keyword = search.toLowerCase();

      const matchSearch =
        row.ID_Stock?.toLowerCase().includes(keyword) ||
        row.Item?.toLowerCase().includes(keyword) ||
        row.Jenis?.toLowerCase().includes(keyword);

      const matchKategori =
        !filterKategori || row.Kategori_Stock === filterKategori;

      return matchSearch && matchKategori;
    });
  }, [data, search, filterKategori]);

  /* ================================
     RENDER
  ================================= */
  return (
    <section className="data-section">
      {/* HEADER */}
      <div className="section-header between">
        <div className="section-title">
          <h2>Master Stock</h2>
          <span className="badge">Stock Reference</span>
        </div>

        <div className="header-actions">
          {/* SEARCH */}
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari ID / Item / Jenis"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER KATEGORI */}
          <select
            className="select-filter"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          {/* ADD BUTTON */}
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={16} />
            Tambah Master Stock
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID Stock</th>
            <th>Item</th>
            <th>Jenis</th>
            <th>Kategori</th>
            <th>Volume</th>
            <th>Satuan Volume</th>
            <th>Warna</th>
            <th>Satuan Qty</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="9" className="empty">
                Data tidak ditemukan
              </td>
            </tr>
          )}

          {filteredData.map(row => (
            <tr key={row.ID_Stock}>
              <td>{row.ID_Stock}</td>
              <td>{row.Item}</td>
              <td>{row.Jenis}</td>
              <td>{row.Kategori_Stock}</td>
              <td>{row.Volume || "-"}</td>
              <td>{row.Satuan_Volume || "-"}</td>
              <td>{row.Warna || "-"}</td>
              <td>{row.Satuan_Qty}</td>
              <td className="action-cell">
                <button
                  className="icon-btn"
                  title="Edit"
                  onClick={() => handleEdit(row)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="icon-btn danger"
                  title="Hapus"
                  onClick={() => onDelete(row)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <MasterStockModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={editingData}
      />
    </section>
  );
}
