"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet } from "@/lib/api";
import { Trash2 } from "lucide-react";
import "@/styles/tabs/data-transaksi.css";

export default function DataTransaksiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 20;

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiGet("transaksi.list");
      if (!res.success) throw new Error(res.message);

      setData(
        res.data.map((item) => ({
          id_transaksi: item.id_transaksi,
          tanggal: item.tanggal,
          jenis: item.jenis,
          keterangan: item.keterangan || "-",
          total:
            Number(item.total_debit) !== 0
              ? Number(item.total_debit)
              : Number(item.total_kredit) || 0,
          created_by: item.created_by,
        }))
      );
    } catch (err) {
      alert(err.message || "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  function formatTanggal(tanggal) {
    const d = new Date(tanggal);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatToInputDate(tanggal) {
    const d = new Date(tanggal);
    return d.toISOString().split("T")[0];
  }

  // 🔹 Ambil jenis unik dari datastore
  const uniqueJenis = useMemo(() => {
    const jenisSet = new Set(data.map((d) => d.jenis));
    return Array.from(jenisSet);
  }, [data]);

  // 🔹 Filtering
  const filteredData = useMemo(() => {
    return data.filter((trx) => {
      const matchSearch =
        trx.id_transaksi.toLowerCase().includes(search.toLowerCase()) ||
        trx.keterangan.toLowerCase().includes(search.toLowerCase());

      const matchJenis = filterJenis ? trx.jenis === filterJenis : true;

      const matchTanggal = filterTanggal
        ? formatToInputDate(trx.tanggal) === filterTanggal
        : true;

      return matchSearch && matchJenis && matchTanggal;
    });
  }, [data, search, filterJenis, filterTanggal]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleDelete(id) {
    if (!confirm("Hapus transaksi ini?")) return;
    alert("Implementasi delete API: " + id);
  }

  return (
    <div className="data-transaksi-page">

      {/* HEADER FILTER SECTION */}
      <div className="top-bar">
        <div className="left-search">
          <input
            type="text"
            placeholder="Cari ID atau keterangan transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right-filters">
          <div className="filter-group">
            <label>Jenis Transaksi</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
            >
              <option value="">Semua</option>
              {uniqueJenis.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tanggal</label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : paginatedData.length === 0 ? (
        <div className="empty-state">Tidak ada data transaksi.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table-transaksi">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Keterangan</th>
                  <th className="text-right">Total Transaksi</th>
                  <th>Diposting Oleh</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((trx, index) => (
                  <tr key={index}>
                    <td>{trx.id_transaksi}</td>
                    <td>{formatTanggal(trx.tanggal)}</td>
                    <td>{trx.jenis}</td>
                    <td>{trx.keterangan}</td>
                    <td className="text-right">
                      Rp {formatRupiah(trx.total)}
                    </td>
                    <td>{trx.created_by}</td>
                    <td className="text-center">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(trx.id_transaksi)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
