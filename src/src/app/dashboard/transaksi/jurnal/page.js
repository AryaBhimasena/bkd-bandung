"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet } from "@/lib/api";
import { useBootstrapStore } from "@/stores/bootstrapStore";
import "@/styles/tabs/jurnal.css";

export default function JurnalUmumPage({ embedded = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTrx, setSearchTrx] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  // ================================
  // ZUSTAND STORE (COA)
  // ================================
  const coaList = useBootstrapStore((state) => state.coaList);

  // Buat dictionary untuk resolve nama akun (optimasi performa)
  const coaMap = useMemo(() => {
    const map = {};
    coaList?.forEach((coa) => {
      map[String(coa.id_akun)] = coa.nama_akun;
    });
    return map;
  }, [coaList]);

  // ================================
  // FETCH JURNAL
  // ================================
  async function loadJurnal() {
    setLoading(true);
    try {
      const res = await apiGet("jurnal.list");

      if (!res.success) throw new Error(res.message);

      setData(
        res.data.map((item) => ({
          id_jurnal: item.id_jurnal,
          id_transaksi: item.id_transaksi,
          tanggal: item.tanggal,
          akun: String(item.akun),
          debit: Number(item.debit) || 0,
          kredit: Number(item.kredit) || 0,
          keterangan: item.keterangan,
          urut: Number(item.urut) || 0,
        }))
      );
    } catch (err) {
      console.error(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJurnal();
  }, []);

  // ================================
  // FORMATTER
  // ================================
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

  // ================================
  // FILTERING
  // ================================
  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchSearch = row.id_transaksi
        .toLowerCase()
        .includes(searchTrx.toLowerCase());

      const matchTanggal = filterTanggal
        ? formatToInputDate(row.tanggal) === filterTanggal
        : true;

      return matchSearch && matchTanggal;
    });
  }, [data, searchTrx, filterTanggal]);

  // ================================
  // GROUP BY TRANSAKSI
  // ================================
  const grouped = useMemo(() => {
    const map = {};

    filtered.forEach((row) => {
      if (!map[row.id_transaksi]) {
        map[row.id_transaksi] = [];
      }
      map[row.id_transaksi].push(row);
    });

    Object.keys(map).forEach((trx) => {
      map[trx].sort((a, b) => a.urut - b.urut);
    });

    return map;
  }, [filtered]);

  return (
    <div className="jurnal-page">

      {/* ================= FILTER BAR ================= */}
      <div className="jurnal-topbar">
        <input
          type="text"
          placeholder="Cari berdasarkan ID Transaksi..."
          value={searchTrx}
          onChange={(e) => setSearchTrx(e.target.value)}
        />

        <div className="filter-group">
          <label>Tanggal</label>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="loading-state">Memuat jurnal...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="empty-state">Belum ada data jurnal.</div>
      ) : (
        <div className="jurnal-table-wrapper">
          <table className="jurnal-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>ID Transaksi</th>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Keterangan</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([trxId, rows]) =>
                rows.map((row) => (
                  <tr key={row.id_jurnal}>
                    <td>{formatTanggal(row.tanggal)}</td>
                    <td>{row.id_transaksi}</td>
                    <td>{row.akun}</td>
                    <td>
                      {coaMap[row.akun] || (
                        <span className="akun-placeholder">
                          Akun tidak ditemukan
                        </span>
                      )}
                    </td>
                    <td>{row.keterangan}</td>
                    <td className="text-right">
                      {row.debit !== 0
                        ? "Rp " + formatRupiah(row.debit)
                        : "-"}
                    </td>
                    <td className="text-right">
                      {row.kredit !== 0
                        ? "Rp " + formatRupiah(row.kredit)
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
