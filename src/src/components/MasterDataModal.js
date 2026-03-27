"use client";

import { useState, useEffect } from "react";
import "@/styles/master-data-modal.css";

export default function MasterDataModal({
  isOpen,
  onClose,
  type,        // "bahan" | "produk" | "bom"
  onSave,
  initialData, // object untuk edit
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {initialData ? "Edit" : "Tambah"}{" "}
            {type === "bahan" ? "Bahan Baku" : type === "produk" ? "Produk" : "BOM"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>

          {type === "bahan" && (
            <>
              <label>
                Nama Bahan
                <input
                  type="text"
                  name="Nama_Bahan"
                  value={form.Nama_Bahan || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Kategori
                <select
                  name="Kategori"
                  value={form.Kategori || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih --</option>
                  <option value="Greenbean">Greenbean</option>
                  <option value="Roastbean">Roastbean</option>
                  <option value="Kemasan">Kemasan</option>
                  <option value="Label">Label</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </label>

              <label>
                Satuan
                <input
                  type="text"
                  name="Satuan"
                  value={form.Satuan || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Reorder Point (ROP)
                <input
                  type="number"
                  name="Reorder_Point"
                  value={form.Reorder_Point || ""}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="Status_Aktif"
                  value={form.Status_Aktif || "Aktif"}
                  onChange={handleChange}
                  required
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </label>
            </>
          )}

          {type === "produk" && (
            <>
              <label>
                Nama Produk
                <input
                  type="text"
                  name="Nama_Produk"
                  value={form.Nama_Produk || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Berat Jadi
                <input
                  type="text"
                  name="Berat_Jadi"
                  value={form.Berat_Jadi || ""}
                  onChange={handleChange}
                  placeholder="contoh: 200 gr"
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="Status_Aktif"
                  value={form.Status_Aktif || "Aktif"}
                  onChange={handleChange}
                  required
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </label>
            </>
          )}

          {type === "bom" && (
            <>
              <label>
                Produk
                <input
                  type="text"
                  name="ID_Produk"
                  value={form.ID_Produk || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Bahan
                <input
                  type="text"
                  name="ID_Bahan"
                  value={form.ID_Bahan || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Qty / Produk
                <input
                  type="number"
                  name="Qty_Per_Produk"
                  value={form.Qty_Per_Produk || ""}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
              </label>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
