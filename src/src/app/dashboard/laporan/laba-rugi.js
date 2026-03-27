"use client";

import "@/styles/pages/laba-rugi.css";
import { useLabaRugi } from "./laba-rugi.helper";

function LabaRugiTable({ ledgerSummary, total, renderNilai }) {
  const {
    pendapatan = [],
    hpp = [],
    bebanOperasional = [],
    bebanPajak = [],
  } = ledgerSummary || {};

  return (
    <div className="table">
      <div className="thead">
        <span>Uraian</span>
        <span>Nominal</span>
        <span>Total</span>
      </div>

      {/* ================= Pendapatan ================= */}
      {pendapatan.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total Pendapatan</span>
        <span />
        <span>{renderNilai(total.totalPendapatan)}</span>
      </div>

      {/* ================= HPP ================= */}
      <div className="group">Harga Pokok Penjualan</div>

      {hpp.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total HPP</span>
        <span />
        <span>{renderNilai(total.totalHpp)}</span>
      </div>

      <div className="trow subtotal">
        <span>Laba Kotor</span>
        <span />
        <span>{renderNilai(total.labaKotor)}</span>
      </div>

      {/* ================= Beban Operasional ================= */}
      <div className="group">Beban Operasional</div>

      {bebanOperasional.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow total">
        <span>Total Beban Operasional</span>
        <span />
        <span>{renderNilai(total.totalBebanOperasional)}</span>
      </div>

      <div className="trow subtotal">
        <span>Laba Usaha</span>
        <span />
        <span>{renderNilai(total.labaUsaha)}</span>
      </div>

      {/* ================= Pajak ================= */}
      <div className="group">Beban Pajak</div>

      {bebanPajak.map((row) => (
        <div key={row.id_akun} className="trow">
          <span>{row.nama_akun}</span>
          <span>{renderNilai(row.nilai)}</span>
          <span />
        </div>
      ))}

      <div className="trow subtotal final">
        <span>Laba Bersih</span>
        <span />
        <span>{renderNilai(total.labaBersih)}</span>
      </div>
    </div>
  );
}

export default function LabaRugiView({ activeMonth, formatRupiah }) {
  const {
    ledgerSummary,
    total,
    renderNilai,
    previewRef,
    periodeLabel,
    handleExportPdf,
  } = useLabaRugi(activeMonth, formatRupiah);

  return (
    <div className="laba-rugi-page">
      <section className="editor-section">
        <h3>Laporan Laba Rugi</h3>
        <p className="company-name">PT. Bejana Kopi Dunia</p>
        <p className="periode">{periodeLabel}</p>

        <LabaRugiTable
          ledgerSummary={ledgerSummary}
          total={total}
          renderNilai={renderNilai}
        />
      </section>

      <section className="preview-section">
        <div className="preview-header">
          <button onClick={handleExportPdf}>Export PDF</button>
        </div>

        <div ref={previewRef} className="preview-paper">
          <h3>Laporan Laba Rugi</h3>
          <p className="company-name">PT. Bejana Kopi Dunia</p>
          <p className="periode">{periodeLabel}</p>
          <br />

          <LabaRugiTable
            ledgerSummary={ledgerSummary}
            total={total}
            renderNilai={renderNilai}
          />
        </div>
      </section>
    </div>
  );
}
