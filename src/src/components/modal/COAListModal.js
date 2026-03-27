"use client";

export default function COAListModal({
  filterTipe,
  setFilterTipe,
  loadingCOA,
  filteredCOA,
  selectedCOA,
}) {
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
  );
}
