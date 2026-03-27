"use client";

import { useEffect, useState } from "react";
import "@/styles/master-stock-modal.css";

export default function MasterStockModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    ID_Stock: "",
    Item: "",
    Jenis: "",
    Kategori_Stock: "",
    Volume: "",
    Satuan_Volume: "",
    Warna: "",
    Satuan_Qty: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card compact">
        <div className="modal-header">
          <h3>
            {initialData ? "Edit Master Stock" : "Tambah Master Stock"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* ROW 1 */}
          <div className="form-row">
            <div className="form-group">
              <label>ID Stock</label>
              <input
                type="text"
                name="ID_Stock"
                value={form.ID_Stock}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Item</label>
              <input
                name="Item"
                value={form.Item}
                onChange={handleChange}
                placeholder="GB Arabica, Stiker GCS, Karton"
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="form-row">
            <div className="form-group">
              <label>Jenis Item</label>
              <input
                name="Jenis"
                value={form.Jenis}
                onChange={handleChange}
                placeholder="West Java, Valve, Kurai Blend"
              />
            </div>

            <div className="form-group">
              <label>Kategori Stock</label>
              <select
                name="Kategori_Stock"
                value={form.Kategori_Stock}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                <option value="Greenbean">Greenbean</option>
                <option value="Roastbean">Roastbean</option>
                <option value="Kemasan">Kemasan</option>
                <option value="Label">Label</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="form-row">
            <div className="form-group compact">
              <label>Volume</label>
              <input
                name="Volume"
                value={form.Volume}
                onChange={handleChange}
                placeholder="1, 2, 3"
              />
            </div>

            <div className="form-group compact">
              <label>Satuan Volume</label>
              <input
                name="Satuan_Volume"
                value={form.Satuan_Volume}
                onChange={handleChange}
                placeholder="Kg"
              />
            </div>
          </div>

          {/* ROW 4 */}
          <div className="form-row">
            <div className="form-group compact">
              <label>Varian</label>
              <input
                name="Warna"
                value={form.Warna}
                onChange={handleChange}
                placeholder="Hitam, Polos, Premium"
              />
            </div>

            <div className="form-group compact">
              <label>Satuan Qty</label>
              <input
                name="Satuan_Qty"
                value={form.Satuan_Qty}
                onChange={handleChange}
                placeholder="Pcs, Kg"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer center">
          <button className="btn-primary full" onClick={handleSubmit}>
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
}
