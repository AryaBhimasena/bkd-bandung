"use client";

import { useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import "@/styles/pages/neraca.css";

export default function NeracaView({ periode, formatRupiah }) {

  /* ======================================================
     TEMPLATE AKUN
  ====================================================== */
	const template = {
	  asetLancar: [
		{ id_akun: "1110", nama_akun: "Kas", nilai: null },
		{ id_akun: "1120", nama_akun: "Bank", nilai: null },
		{ id_akun: "1140", nama_akun: "Persediaan", nilai: null },
		{ id_akun: "1130", nama_akun: "Piutang Usaha", nilai: null },

		{ id_akun: "1156", nama_akun: "PPh 22 Dibayar Dimuka", nilai: null },
		{ id_akun: "1151", nama_akun: "PPh 23 Dibayar Dimuka", nilai: null },
		{ id_akun: "1152", nama_akun: "PPh 25 Dibayar Dimuka", nilai: null },

		{ id_akun: "1153", nama_akun: "PPN Masukan", nilai: null },
		{ id_akun: "1154", nama_akun: "PPN Dibayar Dimuka", nilai: null },
		{ id_akun: "1155", nama_akun: "Instansi", nilai: null },
	  ],

	  asetTidakLancar: [
		{ id_akun: "1160", nama_akun: "Aset Tetap", nilai: null },
		{ id_akun: "1161", nama_akun: "Akumulasi Penyusutan", nilai: null },
	  ],

	  liabilitasJangkaPendek: [
		{ id_akun: "2110", nama_akun: "Hutang Usaha", nilai: null },
		{ id_akun: "2121", nama_akun: "PPN Keluaran", nilai: null },
		{ id_akun: "2120", nama_akun: "Hutang Pajak", nilai: null },
	  ],

	  ekuitas: [
		{ id_akun: "3110", nama_akun: "Modal Disetor", nilai: null },
		{ id_akun: "3130", nama_akun: "Prive / Dividen", nilai: null },
		{ id_akun: "3150", nama_akun: "Pajak Penghasilan", nilai: null },
		{ id_akun: "3160", nama_akun: "Laba (Rugi) Ditahan Sebelumnya", nilai: null },
		{ id_akun: "3170", nama_akun: "Laba (Rugi) Ditahan Berjalan", nilai: null },
	  ],
	};

  const [ledgerSummary, setLedgerSummary] = useState(template);

  /* ======================================================
     LOAD & MERGE DATA NERACA
  ====================================================== */
  useEffect(() => {
    console.log("[Neraca] useEffect triggered");

    if (!periode?.startDate || !periode?.endDate) {
      console.warn("[Neraca] Periode belum lengkap", periode);
      return;
    }

    const payload = {
      periode_awal: periode.startDate,
      periode_akhir: periode.endDate,
    };

    console.log("[Neraca] Request payload", payload);

    apiPost("laporan.neraca", payload)
      .then((res) => {
        console.log("[Neraca] Response API", res);

        if (!res) {
          console.warn("[Neraca] Response kosong / null");
          return;
        }

        const merge = (base, data = []) =>
          base.map((row) => {
            const found = data.find((d) => d.id_akun === row.id_akun);
            return {
              ...row,
              nilai: found ? found.nilai : null,
            };
          });

        const mergedData = {
          asetLancar: merge(template.asetLancar, res.asetLancar),
          asetTidakLancar: merge(
            template.asetTidakLancar,
            res.asetTidakLancar
          ),
          liabilitasJangkaPendek: merge(
            template.liabilitasJangkaPendek,
            res.liabilitasJangkaPendek
          ),
          ekuitas: merge(template.ekuitas, res.ekuitas),
        };

        console.log("[Neraca] Merged result", mergedData);

        setLedgerSummary(mergedData);
      })
      .catch((err) => {
        console.error("[Neraca] API error", err);
      });
  }, [periode.startDate, periode.endDate]);

  /* ======================================================
     HITUNG TOTAL
  ====================================================== */
  const total = useMemo(() => {
    const sum = (arr) =>
      arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);

    const totalAsetLancar = sum(ledgerSummary.asetLancar);
    const totalAsetTidakLancar = sum(ledgerSummary.asetTidakLancar);
    const totalAset = totalAsetLancar + totalAsetTidakLancar;

    const totalLiabilitas = sum(ledgerSummary.liabilitasJangkaPendek);
    const totalEkuitas = sum(ledgerSummary.ekuitas);

    return {
      totalAsetLancar,
      totalAsetTidakLancar,
      totalAset,
      totalLiabilitas,
      totalEkuitas,
      totalLiabilitasEkuitas: totalLiabilitas + totalEkuitas,
    };
  }, [ledgerSummary]);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="laporan-block">
      <div className="laporan-header">
        <h3>Laporan Posisi Keuangan</h3>
        <p className="muted">
          Per {periode.startDate} s.d {periode.endDate}
        </p>
      </div>

      <div className="laporan-grid">
        {/* ================= ASET ================= */}
        <div>
          <div className="group-title">Aset Lancar</div>
          {ledgerSummary.asetLancar.map((row) => (
            <div key={row.id_akun} className="row indent">
              <span>{row.nama_akun}</span>
              <span>{row.nilai == null ? "-" : `Rp ${formatRupiah(row.nilai)}`}</span>
            </div>
          ))}
          <div className="row total">
            <span>Total Aset Lancar</span>
            <span>Rp {formatRupiah(total.totalAsetLancar)}</span>
          </div>

          <div className="group-title">Aset Tetap</div>
          {ledgerSummary.asetTidakLancar.map((row) => (
            <div
              key={row.id_akun}
              className={`row indent ${row.nilai < 0 ? "muted" : ""}`}
            >
              <span>{row.nama_akun}</span>
              <span>
                {row.nilai == null
                  ? "-"
                  : row.nilai < 0
                  ? `(${formatRupiah(Math.abs(row.nilai))})`
                  : `Rp ${formatRupiah(row.nilai)}`}
              </span>
            </div>
          ))}
          <div className="row final">
            <span>Total Aset</span>
            <span>Rp {formatRupiah(total.totalAset)}</span>
          </div>
        </div>

        {/* ================= LIABILITAS & EKUITAS ================= */}
        <div>
          <div className="group-title">Liabilitas</div>
          {ledgerSummary.liabilitasJangkaPendek.map((row) => (
            <div key={row.id_akun} className="row indent">
              <span>{row.nama_akun}</span>
              <span>{row.nilai == null ? "-" : `Rp ${formatRupiah(row.nilai)}`}</span>
            </div>
          ))}
          <div className="row total">
            <span>Total Liabilitas</span>
            <span>Rp {formatRupiah(total.totalLiabilitas)}</span>
          </div>

          <div className="group-title">Ekuitas</div>
          {ledgerSummary.ekuitas.map((row) => (
            <div
              key={row.id_akun}
              className={`row indent ${row.nilai < 0 ? "muted" : ""}`}
            >
              <span>{row.nama_akun}</span>
              <span>
                {row.nilai == null
                  ? "-"
                  : row.nilai < 0
                  ? `(${formatRupiah(Math.abs(row.nilai))})`
                  : `Rp ${formatRupiah(row.nilai)}`}
              </span>
            </div>
          ))}

          <div className="row final">
            <span>Total Liabilitas & Ekuitas</span>
            <span>Rp {formatRupiah(total.totalLiabilitasEkuitas)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
