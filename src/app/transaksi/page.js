"use client";

import { useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/transaksi.css";

export default function TransaksiPage() {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    tanggal: "2026-03-28",
    jenis: "Pengeluaran",
    debit: "",
    kredit: "",
    nominal: "",
    catatan: "",
  });

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);

  /* ================= DUMMY COA ================= */
  const akunList = [
    "Kas (1-10001)",
    "Bank Mandiri (1-10002)",
    "Beban Pokok Pendapatan (5-50000)",
    "Utang Usaha (2-20001)",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newData = {
      ...form,
      id: Date.now(),
      action: "CREATE",
    };

    setHistory((prev) => [newData, ...prev]);
    setForm({
      tanggal: "",
      jenis: "Pengeluaran",
      debit: "",
      kredit: "",
      nominal: "",
      catatan: "",
    });
  }

  /* ================= PAGINATION ================= */
  const pageSize = 10;
  const totalPage = Math.ceil(history.length / pageSize);

  const paginated = history.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ================= RENDER ================= */
  return (
    <MainContainer title="Transaksi">
      <div className="trx-page">

        {/* ================= LEFT ================= */}
        <div className="trx-left card">
          <h3>Tambah Transaksi</h3>

          <form onSubmit={handleSubmit} className="trx-form">

            {/* TANGGAL + JENIS */}
            <div className="trx-row">
              <div className="form-group small">
                <label>Tanggal *</label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Jenis Transaksi *</label>
                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                >
                  <option>Pengeluaran</option>
                  <option>Pemasukan</option>
                  <option>Transfer</option>
                </select>
              </div>
            </div>

            {/* DEBIT + KREDIT */}
            <div className="trx-row">
              <div className="form-group">
                <label>Untuk (Debit) *</label>
                <select
                  name="debit"
                  value={form.debit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih akun</option>
                  {akunList.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dari (Kredit) *</label>
                <select
                  name="kredit"
                  value={form.kredit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih akun</option>
                  {akunList.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* NOMINAL */}
            <div className="form-group">
              <label>Nominal *</label>
              <input
                type="number"
                name="nominal"
                value={form.nominal}
                onChange={handleChange}
                placeholder="Rp 0"
                required
              />
            </div>

            {/* CATATAN */}
            <div className="form-group">
              <label>Catatan</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
              />
            </div>

            <button className="btn-primary">Simpan Transaksi</button>
          </form>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="trx-right">

          {/* ================= JURNAL PREVIEW ================= */}
          <div className="card">
            <h4>Preview Jurnal</h4>

            <div className="jurnal-box">
              <div className="jurnal-row header">
                <span>Akun</span>
                <span>Debit</span>
                <span>Kredit</span>
              </div>

              <div className="jurnal-row">
                <span>{form.debit || "-"}</span>
                <span>{form.nominal || "-"}</span>
                <span>-</span>
              </div>

              <div className="jurnal-row">
                <span>{form.kredit || "-"}</span>
                <span>-</span>
                <span>{form.nominal || "-"}</span>
              </div>
            </div>
          </div>

          {/* ================= HISTORY ================= */}
          <div className="card">
            <h4>History Transaksi</h4>

            <div className="history-table">

              <div className="history-row header">
                <span>Tanggal</span>
                <span>Jenis</span>
                <span>Nominal</span>
              </div>

              {paginated.map((item) => (
                <div key={item.id} className="history-row">
                  <span>{item.tanggal}</span>
                  <span>{item.jenis}</span>
                  <span>Rp {item.nominal}</span>
                </div>
              ))}

              {paginated.length === 0 && (
                <div className="empty">Belum ada transaksi</div>
              )}
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ←
              </button>

              <span>
                {page} / {totalPage || 1}
              </span>

              <button
                disabled={page === totalPage || totalPage === 0}
                onClick={() => setPage(page + 1)}
              >
                →
              </button>
            </div>

          </div>

        </div>

      </div>
    </MainContainer>
  );
}