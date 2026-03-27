"use client";

/**
 * UI-only components Tambah Transaksi
 * Semua logic ada di hook useTambahTransaksi
 * Components = dumb / presentational only
 */

/* ================= SHARED ================= */

export const CoaSelect = ({ value, onChange, coaList }) => (
  <select
    value={value?.id || ""}
    onChange={(e) => {
      const selected = coaList.find(
        (c) => String(c.id_akun) === e.target.value
      );

      onChange(
        selected
          ? {
              id: String(selected.id_akun),
              label: `${selected.kode_akun} - ${selected.nama_akun}`,
            }
          : null
      );
    }}
  >
    <option value="">-- Pilih Akun --</option>
    {coaList.map((coa) => (
      <option key={coa.id_akun} value={String(coa.id_akun)}>
        {coa.kode_akun} - {coa.nama_akun}
      </option>
    ))}
  </select>
);

export const getCoaLabel = (akunId, coaList) => {
  const coa = coaList.find(
    (c) => String(c.id_akun) === String(akunId)
  );
  return coa ? `${coa.kode_akun} - ${coa.nama_akun}` : akunId;
};

export const getSaldoByNormal = (akunId, debit, kredit, coaList) => {
  const coa = coaList.find(
    (c) => String(c.id_akun) === String(akunId)
  );

  if (!coa) {
    console.warn("COA tidak ditemukan untuk akun:", akunId);
    return debit - kredit;
  }

  const normal = coa.saldo_normal.toUpperCase();

  if (normal === "DEBIT") return debit - kredit;
  if (normal === "KREDIT") return kredit - debit;

  return debit - kredit;
};

/* ================= FORM HEADER ================= */

export const FormHeader = ({
  tanggal,
  jenis,
  keterangan,
  jenisList,
  onTanggalChange,
  onJenisChange,
  onKeteranganChange,
}) => (
  <>
    <h3>Tambah Transaksi</h3>

    <div className="form-row">
      <div className="form-group form-date">
        <label>Tanggal</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => onTanggalChange(e.target.value)}
        />
      </div>

      <div className="form-group form-jenis">
        <label>Jenis Transaksi</label>
        <select
          value={jenis}
          onChange={(e) => onJenisChange(e.target.value)}
        >
          <option value="">-- Pilih Jenis --</option>
          {jenisList.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>Keterangan</label>
      <input
        type="text"
        placeholder="Opsional"
        value={keterangan}
        onChange={(e) => onKeteranganChange(e.target.value)}
      />
    </div>
  </>
);

/* ================= JURNAL MANUAL ================= */

export const JurnalManualTable = ({
  rows,
  coaList,
  onChange,
  onAdd,
  onRemove,
}) => (
  <>
    <h4>Detail Jurnal</h4>

    <table className="tambah-jurnal-table">
      <thead>
        <tr>
          <th className="tambah-col-akun">Akun</th>
          <th className="tambah-col-debit">Debit</th>
          <th className="tambah-col-kredit">Kredit</th>
          <th className="tambah-col-action" />
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>
              <CoaSelect
                value={row.akun}
                coaList={coaList}
                onChange={(akun) =>
                  onChange(i, "akun", akun)
                }
              />
            </td>

            <td>
              <input
                type="number"
                value={row.debit}
                onChange={(e) =>
                  onChange(i, "debit", e.target.value)
                }
              />
            </td>

            <td>
              <input
                type="number"
                value={row.kredit}
                onChange={(e) =>
                  onChange(i, "kredit", e.target.value)
                }
              />
            </td>

            <td className="tambah-cell-action">
              {rows.length > 2 && (
                <button
                  type="button"
                  className="tambah-btn-icon"
                  onClick={() => onRemove(i)}
                >
                  ✕
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      type="button"
      className="btn-secondary"
      onClick={onAdd}
    >
      + Tambah Akun
    </button>
  </>
);

/* ================= TRANSAKSI BERPASANGAN ================= */

export const TransaksiBerpasangan = ({
  coaList,
  pair,
  setFrom,
  setTo,
  setAmount,
}) => (
  <>
    <h4>Detail Transaksi</h4>

    <div className="pair-grid">
      <div className="form-group">
        <label>Transaksi Dari (Kredit)</label>
        <CoaSelect
          value={pair.from}
          coaList={coaList}
          onChange={setFrom}
        />
      </div>

      <div className="form-group">
        <label>Transaksi Ke (Debit)</label>
        <CoaSelect
          value={pair.to}
          coaList={coaList}
          onChange={setTo}
        />
      </div>

      <div className="form-group full">
        <label>Nominal</label>
        <input
          type="number"
          value={pair.amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    </div>
  </>
);

/* ================= PREVIEW JURNAL ================= */

export const PreviewJurnal = ({ jurnal, coaList }) => (
  <div className="card preview-card">
    <h4>Preview Jurnal</h4>

    <table className="preview-table">
      <thead>
        <tr>
          <th>Akun</th>
          <th>Debit</th>
          <th>Kredit</th>
        </tr>
      </thead>

      <tbody>
        {jurnal.length === 0 ? (
          <tr className="placeholder">
            <td colSpan={3}>Belum ada data jurnal</td>
          </tr>
        ) : (
          jurnal.map((j, i) => (
            <tr key={i}>
              <td>{getCoaLabel(j.akun, coaList)}</td>
              <td className="text-right">
                {j.debit > 0 ? j.debit.toLocaleString("id-ID") : "-"}
              </td>
              <td className="text-right">
                {j.kredit > 0 ? j.kredit.toLocaleString("id-ID") : "-"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* ================= PREVIEW LEDGER ================= */

export const PreviewLedger = ({ jurnal, coaList }) => {
  const ledger = jurnal.reduce((acc, j) => {
    if (!acc[j.akun]) {
      acc[j.akun] = { debit: 0, kredit: 0 };
    }

    acc[j.akun].debit += j.debit;
    acc[j.akun].kredit += j.kredit;

    return acc;
  }, {});

  return (
    <div className="card preview-card">
      <h4>Preview Ledger</h4>

      <table className="preview-table">
        <thead>
          <tr>
            <th>Akun</th>
            <th>Debit</th>
            <th>Kredit</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(ledger).length === 0 ? (
            <tr className="placeholder">
              <td colSpan={4}>Belum ada dampak ledger</td>
            </tr>
          ) : (
            Object.entries(ledger).map(([akunId, v]) => {
              const saldo = getSaldoByNormal(
                akunId,
                v.debit,
                v.kredit,
                coaList
              );

              return (
                <tr key={akunId}>
                  <td>{getCoaLabel(akunId, coaList)}</td>
                  <td className="text-right">
                    {v.debit.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right">
                    {v.kredit.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right">
                    {saldo.toLocaleString("id-ID")}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
