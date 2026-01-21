"use client";

import "@/styles/modal-transaksi.css";
import { useModalTransaksi } from "@/lib/ModalTransaksiHook";

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

  const renderCOARows = () => {
    if (loadingCOA) {
      return (
        <tr>
          <td colSpan={3} style={{ textAlign: "center" }}>
            Memuat data COA...
          </td>
        </tr>
      );
    }

    if (!filteredCOA.length) {
      return (
        <tr>
          <td colSpan={3} style={{ textAlign: "center" }}>
            Data COA tidak tersedia
          </td>
        </tr>
      );
    }

    return filteredCOA.map((coa) => (
      <tr
        key={coa.id}
        className={selectedCOA === coa.kode ? "active" : ""}
      >
        <td>{coa.kode}</td>
        <td>{coa.nama}</td>
        <td>{coa.saldo}</td>
      </tr>
    ));
  };

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
          <aside className="coa-panel">
            <div className="coa-filter">
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
              >
                <option value="ALL">Semua Akun</option>
                <option value="Aset">Aset</option>
                <option value="Kewajiban">Kewajiban</option>
                <option value="Ekuitas">Ekuitas</option>
                <option value="Pendapatan">Pendapatan</option>
                <option value="Beban">Beban</option>
              </select>
            </div>

            <table className="coa-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Akun</th>
                  <th>Saldo Normal</th>
                </tr>
              </thead>
              <tbody>{renderCOARows()}</tbody>
            </table>
          </aside>

          {/* ===== RIGHT : FORM ===== */}
          <section className="form-panel">
            {/* ===== LINI USAHA ===== */}
            <div className="form-group">
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

            {/* ===== TRANSAKSI DARI - KE ===== */}
            <div className="form-group form-row">
              <div className="form-col">
                <label>Transaksi Dari</label>
                <select
                  value={form.coaDariId}
                  disabled={form.tipeTransaksi === "TRANSFER"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coaDariId: e.target.value }))
                  }
                >
                  <option value="">Pilih Akun</option>
                  {filteredCOA.map((coa) => (
                    <option key={coa.id} value={coa.id}>
                      {coa.kode} — {coa.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-col">
                <label>Transaksi Ke</label>
                <select
                  value={form.coaKeId}
                  disabled={form.tipeTransaksi === "TRANSFER"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coaKeId: e.target.value }))
                  }
                >
                  <option value="">Pilih Akun</option>
                  {filteredCOA.map((coa) => (
                    <option key={coa.id} value={coa.id}>
                      {coa.kode} — {coa.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ===== KAS DARI - KE ===== */}
            <div className="form-group form-row">
              <div className="form-col">
                <label>Kas Dari</label>
					<select
					  value={form.transferDariIndex ?? ""}
					  onChange={(e) => {
						const idx = e.target.value;

						if (idx === "") {
						  setForm((p) => ({
							...p,
							transferDariIndex: "",
							coaDariId: "",
							bankDariId: "",
						  }));
						  return;
						}

						const opt = transferAccountOptions[idx];

						setForm((p) => ({
						  ...p,
						  transferDariIndex: idx,
						  coaDariId: opt.coaId,
						  bankDariId: opt.bankId,
						}));
					  }}
					>
					  <option value="">Pilih Akun Asal</option>
					  {transferAccountOptions.map((opt, i) => (
						<option key={i} value={i}>
						  {opt.label}
						</option>
					  ))}
					</select>
              </div>

              <div className="form-col">
                <label>Kas Ke</label>
					<select
					  value={form.transferKeIndex ?? ""}
					  onChange={(e) => {
						const idx = e.target.value;

						if (idx === "") {
						  setForm((p) => ({
							...p,
							transferKeIndex: "",
							coaKeId: "",
							bankKeId: "",
						  }));
						  return;
						}

						const opt = transferAccountOptions[idx];

						setForm((p) => ({
						  ...p,
						  transferKeIndex: idx,
						  coaKeId: opt.coaId,
						  bankKeId: opt.bankId,
						}));
					  }}
					>
					  <option value="">Pilih Akun Tujuan</option>
					  {transferAccountOptions.map((opt, i) => (
						<option key={i} value={i}>
						  {opt.label}
						</option>
					  ))}
					</select>
              </div>
            </div>

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
