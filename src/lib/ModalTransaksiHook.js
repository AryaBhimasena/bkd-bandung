// lib/ModalTransaksiHook.js
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchCOAList,
  fetchBankList,
  filterBankByLiniUsaha,
  getLiniUsahaOptions,
  formatNominal,
  fetchJenisTransaksi,
} from "@/lib/ModalTransaksiHelper";

export function useModalTransaksi({ open, onSubmit }) {
  /* ================= FILTER & SELECTION ================= */
  const [filterTipe, setFilterTipe] = useState("ALL");
  const [selectedCOA, setSelectedCOA] = useState(null);
  const [selectedLiniUsaha, setSelectedLiniUsaha] = useState("");
  const [coaKeyword, setCoaKeyword] = useState("");

  /* ================= COA ================= */
  const [coaList, setCoaList] = useState([]);
  const [loadingCOA, setLoadingCOA] = useState(false);

  /* ================= BANK ================= */
  const [bankList, setBankList] = useState([]);
  const [loadingBank, setLoadingBank] = useState(false);

  /* ================= JENIS TRANSAKSI ================= */
  const [jenisTransaksiList, setJenisTransaksiList] = useState([]);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    idJenisTransaksi: "",
    tipeTransaksi: "",
    coaId: "",
    coaKode: "",
    coaNama: "",
	coaDariId: "",
	coaKeId: "",
	bankDariId: "",
	bankKeId: "",
    nominal: "",
    keterangan: "",
  });

  /* ================= FETCH JENIS TRANSAKSI ================= */
  useEffect(() => {
    if (!open) return;
    fetchJenisTransaksi()
      .then(setJenisTransaksiList)
      .catch(() => setJenisTransaksiList([]));
  }, [open]);

  /* ================= FETCH COA ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoadingCOA(true);
      try {
        setCoaList(await fetchCOAList());
      } catch {
        setCoaList([]);
      } finally {
        setLoadingCOA(false);
      }
    })();
  }, [open]);

  /* ================= FETCH BANK ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoadingBank(true);
      try {
        setBankList(await fetchBankList());
      } catch {
        setBankList([]);
      } finally {
        setLoadingBank(false);
      }
    })();
  }, [open]);

  /* ================= RESET SAAT TUTUP ================= */
  useEffect(() => {
    if (open) return;

    setSelectedLiniUsaha("");
    setSelectedCOA(null);
    setFilterTipe("ALL");
    setBankList([]);
    setForm({
      idJenisTransaksi: "",
      tipeTransaksi: "",
      coaId: "",
      coaKode: "",
      coaNama: "",
	  coaDariId: "",
	  coaKeId: "",
      bankDariId: "",
      bankKeId: "",
      nominal: "",
      keterangan: "",
    });
  }, [open]);

  /* ================= MEMO ================= */
  const filteredCOA = useMemo(() => {
    if (filterTipe === "ALL") return coaList;
    return coaList.filter((c) => c.tipe === filterTipe);
  }, [coaList, filterTipe]);

  const filteredBank = useMemo(
    () => filterBankByLiniUsaha(bankList, selectedLiniUsaha),
    [bankList, selectedLiniUsaha]
  );

  const liniUsahaOptions = useMemo(
    () => getLiniUsahaOptions(bankList),
    [bankList]
  );

  const bankPlaceholder = useMemo(() => {
    if (loadingBank) return "Memuat data bank...";
    if (!selectedLiniUsaha) return "Pilih Lini Usaha terlebih dahulu";
    return "Pilih Bank";
  }, [loadingBank, selectedLiniUsaha]);
  
	const akunKas = useMemo(
	  () => coaList.find((c) => Number(c.id) === 1110),
	  [coaList]
	);

	const akunBank = useMemo(
	  () => coaList.find((c) => Number(c.id) === 1120),
	  [coaList]
	);
	
	const transferAccountOptions = useMemo(() => {
	  if (!akunKas && !akunBank) return [];

	  const options = [];

	  if (akunKas) {
		options.push({
		  label: "Kas",
		  coaId: akunKas.id,
		  bankId: "",
		});
	  }

	  if (akunBank) {
		filteredBank.forEach((bank) => {
		  options.push({
			label: `Bank — ${bank.nama} (${bank.rekening})`,
			coaId: akunBank.id,
			bankId: bank.id,
		  });
		});
	  }

	  return options;
	}, [akunKas, akunBank, filteredBank]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleNominalChange = (e) => {
    setForm((p) => ({
      ...p,
      nominal: formatNominal(e.target.value),
    }));
  };
  
const handleTransferDari = (option) => {
  setForm((p) => ({
    ...p,
    coaDariId: option.coaId,
    bankDariId: option.bankId,
  }));
};

const handleTransferKe = (option) => {
  setForm((p) => ({
    ...p,
    coaKeId: option.coaId,
    bankKeId: option.bankId,
  }));
};


	const handleSubmit = () => {
	  if (!selectedLiniUsaha) return alert("Lini usaha belum dipilih");
	  if (!form.nominal) return alert("Nominal belum diisi");

	  if (form.tipeTransaksi === "TRANSFER") {
		if (!form.coaDariId || !form.coaKeId) {
		  return alert("Akun asal dan tujuan wajib diisi");
		}
		if (
		  form.transferDariIndex !== "" &&
		  form.transferDariIndex === form.transferKeIndex
		) {
		  alert("Akun asal dan tujuan tidak boleh sama");
		  return;
		}
	  }

		onSubmit?.({
		  tanggal: new Date().toISOString().slice(0, 10),

		  // === IDENTITAS TRANSAKSI ===
		  id_jenis_transaksi: form.idJenisTransaksi,

		  // === AKUN TERLIBAT ===
		  coa_dari_id: form.coaDariId,
		  coa_ke_id: form.coaKeId,
		  bank_dari_id: form.bankDariId,
		  bank_ke_id: form.bankKeId,

		  // === KONTEKS BISNIS ===
		  id_lini_usaha: selectedLiniUsaha,

		  // === NILAI ===
		  nominal: Number(form.nominal.replace(/\./g, "")),

		  // === KETERANGAN ===
		  keterangan: form.keterangan || "",

		  // === AUDIT (DEFAULT) ===
		  created_by: "system",
		});

	};

  return {
    /* state */
    form,
    filterTipe,
    selectedCOA,
    selectedLiniUsaha,
    coaList,
    filteredCOA,
    filteredBank,
    liniUsahaOptions,
    jenisTransaksiList,
    loadingCOA,
    loadingBank,
    bankPlaceholder,
	akunKas,
	akunBank,
	transferAccountOptions,

    /* setters */
    setForm,
    setFilterTipe,
    setSelectedLiniUsaha,

    /* handlers */
    handleChange,
    handleNominalChange,
    handleSubmit,
  };
}
