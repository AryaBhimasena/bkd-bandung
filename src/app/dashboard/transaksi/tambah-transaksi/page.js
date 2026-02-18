"use client";

import MainContainer from "@/components/layout/MainContainer";
import "@/styles/tabs/tambah-transaksi.css";
import { useBootstrapStore } from "@/stores/bootstrapStore";
import { useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { flushSync } from "react-dom";

import {
  useTambahTransaksi,
  JENIS_TRANSAKSI,
} from "./useTambahTransaksi";

import {
  FormHeader,
  JurnalManualTable,
  TransaksiBerpasangan,
  PreviewJurnal,
  PreviewLedger,
} from "./TambahTransaksiComponents";

import { apiPost } from "@/lib/api";

/* ================= PAGE ================= */
export default function TambahTransaksiPage({ embedded = false }) {
  const { coaList } = useBootstrapStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const {
    tanggal,
    jenis,
    keterangan,

    /* jurnal manual */
    rows,
    updateRow,
    addRow,
    removeRow,

    /* transaksi berpasangan */
    pair,
    setPairFrom,
    setPairTo,
    setPairAmount,

    /* unified output */
    jurnal,

    /* setters */
    setTanggal,
    setJenis,
    setKeterangan,
	
	resetForm,
  } = useTambahTransaksi();

async function handleSubmit() {
  try {
    setModalOpen(true);
    setSaveStatus("loading");
    setErrorMessage("");

    const payload = {
      tanggal,
      jenis,
      keterangan,
      created_by: "system",
      jurnal: jurnal.map((r) => ({
        akun: r.akun?.value ?? r.akun ?? null,
        debit: Number(r.debit || 0),
        kredit: Number(r.kredit || 0),
      })),
    };

    const result = await apiPost("saveTransaksi", {
      payload: JSON.stringify(payload),
    });

    if (!result.success) {
      throw new Error(result.message || "Gagal menyimpan");
    }

    setSaveStatus("success");

    // auto close setelah 1.2 detik
    setTimeout(() => {
      setModalOpen(false);
      setSaveStatus("idle");
      resetForm();
    }, 1200);

  } catch (err) {
    setSaveStatus("error");
    setErrorMessage(err.message || "Terjadi kesalahan");
  }
}

  const content = (
    <div className="transaksi-layout">
      {/* ================= FORM ================= */}
      <div className="transaksi-form card">
        <FormHeader
          tanggal={tanggal}
          jenis={jenis}
          keterangan={keterangan}
          jenisList={JENIS_TRANSAKSI}
          onTanggalChange={setTanggal}
          onJenisChange={setJenis}
          onKeteranganChange={setKeterangan}
        />

        {/* ===== JURNAL MANUAL ===== */}
        {jenis === "Jurnal Manual" && (
          <JurnalManualTable
            rows={rows}
            coaList={coaList}
            onChange={updateRow}
            onAdd={addRow}
            onRemove={removeRow}
          />
        )}

        {/* ===== TRANSAKSI BERPASANGAN ===== */}
        {jenis && jenis !== "Jurnal Manual" && (
          <TransaksiBerpasangan
            coaList={coaList}
            pair={pair}
            setFrom={setPairFrom}
            setTo={setPairTo}
            setAmount={setPairAmount}
          />
        )}

		<button
		  className="btn-primary full"
		  onClick={handleSubmit}
		>
		  Simpan Transaksi
		</button>

      </div>

      {/* ================= PREVIEW ================= */}
      <div className="transaksi-preview">
        <PreviewJurnal jurnal={jurnal} coaList={coaList} />

        <PreviewLedger jurnal={jurnal} coaList={coaList} />

      </div>
{modalOpen && (
  <div className="modal-overlay">
    <div className={`modal-card ${saveStatus}`}>

      {/* ICON */}
      <div className="modal-icon">
        {saveStatus === "loading" && (
          <Loader2 size={28} className="spin" />
        )}

        {saveStatus === "success" && (
          <FileText size={28} />
        )}

        {saveStatus === "error" && (
          <X size={28} />
        )}
      </div>

      {/* TITLE */}
      <h3 className="modal-title">
        {saveStatus === "loading" && "Menyimpan Transaksi"}
        {saveStatus === "success" && "Berhasil"}
        {saveStatus === "error" && "Terjadi Kesalahan"}
      </h3>

      {/* MESSAGE */}
      <p className="modal-message">
        {saveStatus === "loading" && "Mohon tunggu sebentar..."}
        {saveStatus === "success" && "Transaksi berhasil disimpan ke sistem."}
        {saveStatus === "error" && errorMessage}
      </p>

      {/* ACTION */}
      {saveStatus === "error" && (
        <button
          className="modal-button"
          onClick={() => {
            setModalOpen(false);
            setSaveStatus("idle");
          }}
        >
          Tutup
        </button>
      )}
    </div>
  </div>
)}

    </div>
  );

  if (embedded) return content;

	return (
	  <MainContainer title="Tambah Transaksi">
		{content}
	  </MainContainer>
	);

}
