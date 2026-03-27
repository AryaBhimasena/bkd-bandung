"use client";

import { useState, useEffect } from "react";

/* ======================================================
   CONSTANTS
   ====================================================== */

export const JENIS_TRANSAKSI = [
  "Jurnal Manual",
  "Pemasukan",
  "Pengeluaran",
  "Hutang",
  "Piutang",
  "Tambah Modal",
  "Tarik Modal",
  "Transfer Uang",
  "Pemasukan Sebagai Piutang",
  "Pengeluaran Sebagai Hutang",
];

/* ======================================================
   HOOK : useTambahTransaksi
   ====================================================== */

export function useTambahTransaksi() {
  /* ================= BASE STATE ================= */

  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("");
  const [keterangan, setKeterangan] = useState("");

  /* ================= JURNAL MANUAL ================= */

  const [rows, setRows] = useState([
    { akun: null, debit: "", kredit: "" },
    { akun: null, debit: "", kredit: "" },
  ]);

  /* ================= TRANSAKSI BERPASANGAN ================= */

  const [pair, setPair] = useState({
    from: null,
    to: null,
    amount: "",
  });

  const setPairFrom = (value) => {
    setPair((prev) => ({ ...prev, from: value }));
  };

  const setPairTo = (value) => {
    setPair((prev) => ({ ...prev, to: value }));
  };

  const setPairAmount = (value) => {
    setPair((prev) => ({ ...prev, amount: value }));
  };

  /* ================= UNIFIED OUTPUT ================= */

  const [jurnal, setJurnal] = useState([]);

  /* ======================================================
     BUILD JURNAL (NORMALIZED OUTPUT)
     ====================================================== */

const buildJurnal = () => {
  // --- Jurnal Manual ---
  if (jenis === "Jurnal Manual") {
    return rows
      .filter((r) => r.akun)
      .map((r) => ({
        akun: r.akun.id, // SIMPAN ID
        debit: Number(r.debit || 0),
        kredit: Number(r.kredit || 0),
      }));
  }

  // --- Transaksi Berpasangan ---
  if (pair.from || pair.to) {
    const nominal = Number(pair.amount || 0);

    return [
      pair.to && {
        akun: pair.to.id,   // SIMPAN ID
        debit: nominal,
        kredit: 0,
      },
      pair.from && {
        akun: pair.from.id, // SIMPAN ID
        debit: 0,
        kredit: nominal,
      },
    ].filter(Boolean);
  }

  return [];
};

  /* ======================================================
     AUTO SYNC JURNAL
     ====================================================== */

  useEffect(() => {
    setJurnal(buildJurnal());
  }, [jenis, rows, pair]);

  /* ======================================================
     JURNAL MANUAL HANDLERS
     ====================================================== */

  const updateRow = (index, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { akun: "", debit: "", kredit: "" },
    ]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* ======================================================
     RESET
     ====================================================== */

  const resetForm = () => {
    setTanggal("");
    setJenis("");
    setKeterangan("");

    setRows([
      { akun: null, debit: "", kredit: "" },
      { akun: null, debit: "", kredit: "" },
    ]);

    setPair({
      from: null,
      to: null,
      amount: "",
    });

    setJurnal([]);
  };

  /* ======================================================
     RETURN API
     ====================================================== */

  return {
    // base
    tanggal,
    jenis,
    keterangan,

    // output
    jurnal,

    // jurnal manual
    rows,

    // transaksi berpasangan
    pair,

    // setters
    setTanggal,
    setJenis,
    setKeterangan,

    // jurnal manual handlers
    updateRow,
    addRow,
    removeRow,

    // pair handlers
    setPairFrom,
    setPairTo,
    setPairAmount,

    // utils
    resetForm,
  };
}
