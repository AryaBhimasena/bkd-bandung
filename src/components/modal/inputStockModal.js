"use client";

import { useEffect, useState } from "react";
import "@/styles/input-stock-modal.css";
import {
  toISODate,
  fetchMasterStock,
} from "@/lib/stockHelper";

export default function InputStockModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    ID_Ref: "",
    Tanggal: "",
    ID_Stock: "",
    Qty: "",
    Satuan_Qty: "KG",
    Harga: "",
    Penggunaan_Stock: "PENERIMAAN",
  });

  const [masterStock, setMasterStock] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    fetchMasterStock().then(res => {
      if (res?.success) setMasterStock(res.data);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      ...form,
      Tanggal: toISODate(new Date(form.Tanggal)),
    };

    console.log("SUBMIT FIFO STOCK", payload);

    onClose();
    onSuccess?.();
  };

  return (
    <div className="fifo-modal-backdrop">
      <form className="fifo-modal-card" onSubmit={handleSubmit}>
        <h3 className="fifo-modal-title">Penerimaan Stock</h3>

        {/* ID Ref + Tanggal */}
        <div className="fifo-form-row">
          <input
            name="ID_Ref"
            placeholder="ID Ref"
            onChange={handleChange}
          />
          <input
            type="date"
            name="Tanggal"
            onChange={handleChange}
          />
        </div>

        {/* Stock selector */}
        <select
          name="ID_Stock"
          value={form.ID_Stock}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Item Stock</option>
          {masterStock.map(item => (
            <option key={item.ID_Stock} value={item.ID_Stock}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Qty + Satuan */}
        <div className="fifo-form-row">
          <input
            name="Qty"
            type="number"
            placeholder="Qty"
            onChange={handleChange}
          />
          <select
            name="Satuan_Qty"
            value={form.Satuan_Qty}
            onChange={handleChange}
          >
            <option value="KG">KG</option>
            <option value="Gram">Gram</option>
          </select>
        </div>

        {/* Harga */}
        <input
          name="Harga"
          type="number"
          placeholder="Harga per Qty"
          onChange={handleChange}
        />

        <div className="fifo-modal-actions">
          <button type="button" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="fifo-btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
