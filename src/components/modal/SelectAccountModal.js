"use client";

export default function SelectAccountSection({
  form,
  filteredCOA,
  transferAccountOptions,
  setForm,
}) {
  return (
    <>
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
    </>
  );
}
