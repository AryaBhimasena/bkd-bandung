"use client";

import "@/styles/modal-transaksi.css";
import { useModalTransaksi } from "@/lib/ModalTransaksiHook";
import COAListModal from "./COAListModal";
import SelectAccountSection from "./SelectAccountModal";

export default function ModalTransaksi({ open, onClose, onSubmit }) {
  const {
    form,
    filterTipe,
    selectedCOA,
    selectedLiniUsaha,
    filteredCOA,
    filteredBank,
    liniUsahaOptions,
    jenisTransaksiList,
    loadingCOA,
    akunKas,
    akunBank,
    transferAccountOptions,

    setFilterTipe,
    setSelectedLiniUsaha,
    setForm,

    handleChange,
    handleNominalChange,
    handleSubmit,
  } = useModalTransaksi({ open, onSubmit });

  if (!open) return null;

  return (
    <>
      {/* ===== BACKDROP ===== */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* ===== MODAL ===== */}
      <div className="modal-container">
        <header className="modal-header">
          <h3>Tambah Transaksi</h3>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="modal-body">
          {/* ===== LEFT : COA LIST ===== */}
          <COAListModal
            filterTipe={filterTipe}
            setFilterTipe={setFilterTipe}
            loadingCOA={loadingCOA}
            filteredCOA={filteredCOA}
            selectedCOA={selectedCOA}
          />

          {/* ===== RIGHT : FORM ===== */}
          <section className="form-panel">
		  
		  {/* ===== TANGGAL TRANSAKSI ===== */}
		  <div className="form-group form-row">
			<div className="form-col">
			  <label>Tanggal Transaksi</label>
			  <input
				type="date"
				name="tanggal"
				value={form.tanggal}
				onChange={handleChange}
			  />
			</div>
		  
            {/* ===== LINI USAHA ===== */}
            <div className="form-col">
              <label>Lini Usaha</label>
              <select
                value={selectedLiniUsaha}
                onChange={(e) => {
                  setSelectedLiniUsaha(e.target.value);
                  setForm((prev) => ({
                    ...prev,
                    bankDariId: "",
                    bankKeId: "",
                  }));
                }}
              >
                <option value="">Pilih Lini Usaha</option>
                {liniUsahaOptions.map((lu) => (
                  <option key={lu.id} value={lu.id}>
                    {lu.nama}
                  </option>
                ))}
              </select>
            </div>
		  </div>

            {/* ===== JENIS TRANSAKSI ===== */}
            <div className="form-group">
              <label>Jenis Transaksi</label>
              <select
                value={form.idJenisTransaksi}
                onChange={(e) => {
                  const jt = jenisTransaksiList.find(
                    (j) => j.id === e.target.value
                  );

                  setForm((prev) => ({
                    ...prev,
                    idJenisTransaksi: jt?.id || "",
                    tipeTransaksi: jt?.tipe || "",
                    coaDariId: "",
                    coaKeId: "",
                    bankDariId: "",
                    bankKeId: "",
                  }));
                }}
              >
                <option value="">Pilih Jenis Transaksi</option>
                {jenisTransaksiList.map((jt) => (
                  <option key={jt.id} value={jt.id}>
                    {jt.nama}
                  </option>
                ))}
              </select>
            </div>

			{/* ===== Pilih Akun Transaksi ===== */}
            <SelectAccountSection
			  form={form}
			  filteredCOA={filteredCOA}
			  transferAccountOptions={transferAccountOptions}
			  setForm={setForm}
			/>

            {/* ===== NOMINAL ===== */}
            <div className="form-group">
              <label>Nominal</label>
              <div className="currency-input">
                <span>Rp</span>
                <input
                  value={form.nominal}
                  onChange={handleNominalChange}
                  placeholder="0"
                />
              </div>
            </div>

            {/* ===== KETERANGAN ===== */}
            <div className="form-group">
              <label>Keterangan</label>
              <textarea
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
              />
            </div>

            {/* ===== ACTION ===== */}
            <div className="form-action">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
              >
                Simpan Transaksi
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
