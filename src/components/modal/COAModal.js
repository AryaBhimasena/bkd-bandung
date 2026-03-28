"use client";

import { useState, useEffect } from "react";
import "@/styles/components/coa-modal.css";

const TIPE_AKUN = ["Aset", "Kewajiban", "Ekuitas", "Pendapatan", "Beban"];
const SALDO = ["Debit", "Kredit"];
const KELOMPOK = [
  "Neraca - Aset Lancar",
  "Neraca - Aset Tidak Lancar",
  "Neraca - Kewajiban Jangka Pendek",
  "Neraca - Kewajiban Jangka Panjang",
  "Neraca - Ekuitas",
  "Laba Rugi - Pendapatan",
  "Laba Rugi - Beban",
];
const ARUS_KAS = ["Operasi", "Investasi", "Pendanaan", "Non Kas"];

function generateKode(tipe) {
  if (!tipe) return "";

  const map = {
    Aset: "1",
    Kewajiban: "2",
    Ekuitas: "3",
    Pendapatan: "4",
    Beban: "5",
  };

  return `${map[tipe] || "0"}-xxxxx`;
}

export default function CoaModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    tipeAkun: "",
    saldoNormal: "",
    kelompok: "",
    arusKas: "",
    deskripsi: "",
  });

  /* ================= INIT DATA ================= */
  useEffect(() => {
    if (initialData) {
      // EDIT MODE → pakai data asli (kode jangan diubah)
      setForm({
        kode: initialData.kode || "",
        nama: initialData.nama || "",
        tipeAkun: initialData.tipeAkun || "",
        saldoNormal: initialData.saldoNormal || "",
        kelompok: initialData.kelompok || "",
        arusKas: initialData.arusKas || "",
        deskripsi: initialData.deskripsi || "",
      });
    } else {
      // CREATE MODE
      setForm({
        kode: "",
        nama: "",
        tipeAkun: "",
        saldoNormal: "",
        kelompok: "",
        arusKas: "",
        deskripsi: "",
      });
    }
  }, [initialData, open]);

  /* ================= AUTO GENERATE KODE (HANYA CREATE) ================= */
  useEffect(() => {
    if (!initialData) {
      setForm((prev) => ({
        ...prev,
        kode: generateKode(prev.tipeAkun),
      }));
    }
  }, [form.tipeAkun, initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h3>{initialData ? "Edit Akun" : "Tambah Akun"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">

          <div className="form-group">
            <label>Kode Akun</label>
            <input value={form.kode} disabled />
          </div>

          <div className="form-group">
            <label>Nama Akun</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipe Akun</label>
            <select
              name="tipeAkun"
              value={form.tipeAkun}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {TIPE_AKUN.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Saldo Normal</label>
            <select
              name="saldoNormal"
              value={form.saldoNormal}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {SALDO.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kelompok Laporan</label>
            <select
              name="kelompok"
              value={form.kelompok}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {KELOMPOK.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Klasifikasi Arus Kas</label>
            <select
              name="arusKas"
              value={form.arusKas}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              {ARUS_KAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* ✅ FIELD BARU: DESKRIPSI */}
          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
              placeholder="Opsional..."
            />
          </div>

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