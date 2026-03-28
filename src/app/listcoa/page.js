"use client";

import { apiGet } from "@/lib/api";
import { useState, useEffect } from "react";
import MainContainer from "@/components/layout/MainContainer";
import COAModal from "@/components/modal/COAModal";
import "@/styles/pages/list-coa.css";

export default function CoaPage() {
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCOA() {
      try {
        const res = await apiGet("getCOA");

        if (!res.success) {
          alert(res.message);
          return;
        }

        setAccounts(res.data || []);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCOA();
  }, []);

  const filtered = accounts.filter((acc) =>
    (acc.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    setEditData(null);
    setOpenModal(true);
  }

  function handleEdit(data) {
    if (data.isLocked) {
      alert("Akun ini tidak dapat diedit");
      return;
    }

    setEditData(data);
    setOpenModal(true);
  }

  function handleDelete(kode) {
    const acc = accounts.find((a) => a.kode === kode);

    if (acc?.isLocked) {
      alert("Akun ini tidak dapat dihapus");
      return;
    }

    const confirmDelete = confirm("Hapus akun ini?");
    if (!confirmDelete) return;

    setAccounts((prev) => prev.filter((acc) => acc.kode !== kode));
  }

  function handleSave(data) {
    if (editData) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.kode === editData.kode ? { ...data } : acc
        )
      );
    } else {
      setAccounts((prev) => [...prev, data]);
    }

    setOpenModal(false);
    setEditData(null);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setEditData(null);
  }

  return (
    <MainContainer title="Chart of Accounts">
      <div className="coa-page">

        {/* HEADER */}
        <div className="coa-header">
          <div className="coa-actions">
            <button className="btn-primary" onClick={handleAdd}>
              + Tambah Akun
            </button>
          </div>

          <div className="coa-right">
            <button className="btn-outline">Atur Saldo Awal</button>

            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="coa-search"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="coa-card">
          <div className="coa-table">

            {/* HEADER */}
            <div className="coa-row header">
              <div>Kode</div>
              <div>Nama Akun</div>
              <div>Tipe</div>
              <div>Saldo</div>
              <div>Kelompok</div>
              <div>Arus Kas</div>
              <div>Deskripsi</div>
              <div className="center">Action</div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="coa-empty">Loading...</div>
            )}

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
              <div className="coa-empty">Tidak ada data</div>
            )}

            {/* BODY */}
            {!loading && filtered.map((acc, i) => (
              <div key={i} className="coa-row">
                <div className="kode">{acc.kode}</div>

                <div className="nama">
                  {acc.nama}
                  {acc.isLocked && (
                    <span className="badge lock">🔒</span>
                  )}
                </div>

                <div>
                  <span className={`badge tipe ${acc.tipeAkun?.toLowerCase()}`}>
                    {acc.tipeAkun}
                  </span>
                </div>

                <div>
                  <span className={`badge saldo ${acc.saldoNormal?.toLowerCase()}`}>
                    {acc.saldoNormal}
                  </span>
                </div>

                <div>{acc.kelompok}</div>

                <div>
                  <span className="badge arus">
                    {acc.arusKas}
                  </span>
                </div>

                <div className="deskripsi">
                  {acc.deskripsi || "-"}
                </div>

                <div className="action center">
                  <button
                    className="icon-btn"
                    onClick={() => handleEdit(acc)}
                    disabled={acc.isLocked}
                  >
                    ✏️
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() => handleDelete(acc.kode)}
                    disabled={acc.isLocked}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* MODAL */}
        <COAModal
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editData}
        />

      </div>
    </MainContainer>
  );
}