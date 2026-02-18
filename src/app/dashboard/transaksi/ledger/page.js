"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet } from "@/lib/api";
import { useBootstrapStore } from "@/stores/bootstrapStore";
import "@/styles/tabs/ledger.css";

export default function LedgerPage({ embedded = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterAkun, setFilterAkun] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  const coaList = useBootstrapStore((state) => state.coaList);

  const coaMap = useMemo(() => {
    const map = {};
    coaList?.forEach((coa) => {
      map[String(coa.id_akun)] = coa.nama_akun;
    });
    return map;
  }, [coaList]);

  async function loadLedger() {
    setLoading(true);
    try {
      const res = await apiGet("ledger.list");

      if (!res.success) throw new Error(res.message);

      setData(
        res.data.map((item) => ({
          id_ledger: item.id_ledger,
          tanggal: item.tanggal,
          akun: String(item.akun),
          id_jurnal: item.id_jurnal,
          id_transaksi: item.id_transaksi,
          debit: Number(item.debit) || 0,
          kredit: Number(item.kredit) || 0,
          saldo: Number(item.saldo) || 0,
          keterangan: item.keterangan,
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
    loadLedger();
  }, []);

  function formatTanggal(tanggal) {
    const d = new Date(tanggal);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  function formatToInputDate(tanggal) {
    return new Date(tanggal).toISOString().split("T")[0];
  }

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchAkun = filterAkun ? row.akun === filterAkun : true;

      const matchTanggal = filterTanggal
        ? formatToInputDate(row.tanggal) === filterTanggal
        : true;

      return matchAkun && matchTanggal;
    });
  }, [data, filterAkun, filterTanggal]);

  return (
    <div className="ledger-page">

      {/* ================= FILTER ================= */}
      <div className="ledger-topbar">

        <div className="filter-group">
          <label>Akun</label>
          <select
            value={filterAkun}
            onChange={(e) => setFilterAkun(e.target.value)}
          >
            <option value="">Semua Akun</option>
            {coaList?.map((coa) => (
              <option key={coa.id_akun} value={coa.id_akun}>
                {coa.kode_akun} - {coa.nama_akun}
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

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="loading-state">Memuat ledger...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">Belum ada data ledger.</div>
      ) : (
        <div className="ledger-table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>ID Transaksi</th>
                <th>Keterangan</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Kredit</th>
                <th className="text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id_ledger}>
                  <td>{formatTanggal(row.tanggal)}</td>
                  <td>{row.akun}</td>
                  <td>
                    {coaMap[row.akun] || (
                      <span className="akun-placeholder">
                        Akun tidak ditemukan
                      </span>
                    )}
                  </td>
                  <td>{row.id_transaksi}</td>
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
                  <td className="text-right saldo-cell">
                    Rp {formatRupiah(row.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
