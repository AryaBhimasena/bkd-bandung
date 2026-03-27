"use client";

import { useEffect, useState } from "react";
import "@/styles/input-stock-modal.css";
import {
  toISODate,
  fetchMasterStock,
  generateFifoIdRef,
  receiveStockFIFO,
} from "@/lib/stockHelper";
import { Loader2 } from "lucide-react";

const EMPTY_FORM = {
  ID_Ref: "",
  Tanggal: "",
  ID_Stock: "",
  Qty: "",
  Satuan_Qty: "KG",
  Harga: "",
};

export default function InputStockModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [masterStock, setMasterStock] = useState([]);

  const [loadingId, setLoadingId] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ===============================
     INIT MODAL
  =============================== */
  useEffect(() => {
    if (!isOpen) return;

    setForm(EMPTY_FORM);
    setLoadingId(true);

    async function init() {
      const stockRes = await fetchMasterStock();
      if (stockRes?.success) setMasterStock(stockRes.data);

      const idRes = await generateFifoIdRef();
      if (idRes?.success) {
        setForm(prev => ({
          ...prev,
          ID_Ref: idRes.id_ref,
          Tanggal: toISODate(new Date()),
        }));
      }

      setLoadingId(false);
    }

    init();
  }, [isOpen]);

  if (!isOpen) return null;

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.ID_Ref) return;

    setSaving(true);

    const payload = {
      ...form,
      Tanggal: toISODate(new Date(form.Tanggal)),
    };

    const res = await receiveStockFIFO(payload);

    setSaving(false);

    if (!res?.success) {
      alert(res?.message || "Gagal menyimpan FIFO");
      return;
    }

    onClose?.();
	onSuccess?.();
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="fifo-modal-backdrop">
      <form className="fifo-modal-card" onSubmit={handleSubmit}>
        <h3 className="fifo-modal-title">Penerimaan Stock</h3>

        {/* ID REF + TANGGAL */}
        <div className="fifo-form-row">
          <input
            value={
              loadingId
                ? "Sedang membuat nomor..."
                : form.ID_Ref || ""
            }
            readOnly
            className="readonly"
          />
          <input
            type="date"
            name="Tanggal"
            value={form.Tanggal}
            onChange={handleChange}
          />
        </div>

        {/* STOCK */}
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

        {/* QTY + SATUAN */}
        <div className="fifo-form-row">
          <input
            name="Qty"
            type="number"
            placeholder="Qty"
            value={form.Qty}
            onChange={handleChange}
            required
          />
          <select
            name="Satuan_Qty"
            value={form.Satuan_Qty}
            onChange={handleChange}
          >
            <option value="KG">KG</option>
            <option value="PCS">PCS</option>
          </select>
        </div>

        {/* HARGA */}
        <input
          name="Harga"
          type="number"
          placeholder="Harga per Qty"
          value={form.Harga}
          onChange={handleChange}
          required
        />

        {/* ACTIONS */}
        <div className="fifo-modal-actions">
          <button type="button" onClick={onClose} disabled={saving}>
            Batal
          </button>

          <button
            type="submit"
            className="fifo-btn-primary"
            disabled={loadingId || saving || !form.ID_Ref}
          >
            {saving ? (
              <>
                <Loader2 className="spin" size={16} />
                Menyimpan data...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
