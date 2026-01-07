"use client";

import { useEffect, useState } from "react";
import MainContainer from "@/components/layout/MainContainer";
import "@/styles/pages/master-data.css";

import MasterStockTab from "@/components/masterStockTab";
import MasterProdukTab from "@/components/masterProdukTab";

import {
  fetchMasterStock,
  deleteMasterStock,
} from "@/lib/masterStockHelper";

import {
  fetchMasterProduk,
} from "@/lib/masterProdukHelper";

export default function MasterDataPage() {
  /* ================================
     TAB STATE
  ================================= */
  const [activeTab, setActiveTab] = useState("master-stock");

  /* ================================
     MASTER STOCK STATE
  ================================= */
  const [masterStockData, setMasterStockData] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  /* ================================
     MASTER PRODUK STATE
  ================================= */
  const [masterProdukData, setMasterProdukData] = useState([]);
  const [loadingProduk, setLoadingProduk] = useState(false);

  /* ================================
     TABS CONFIG
  ================================= */
  const tabs = [
    { key: "master-stock", label: "Master Stock" },
    { key: "master-produk", label: "Master Produk" },
  ];

  /* ================================
     FETCHERS
  ================================= */
  async function loadMasterStock() {
    setLoadingStock(true);
    const res = await fetchMasterStock();
    if (res?.success) {
      setMasterStockData(res.data || []);
    }
    setLoadingStock(false);
  }

  async function loadMasterProduk() {
    setLoadingProduk(true);
    const res = await fetchMasterProduk();
    if (res?.success) {
      setMasterProdukData(res.data || []);
    }
    setLoadingProduk(false);
  }

  /* ================================
     TAB EFFECT (LAZY LOAD)
  ================================= */
  useEffect(() => {
    if (activeTab === "master-stock") {
      loadMasterStock();
    }

    if (activeTab === "master-produk") {
      loadMasterProduk();
    }
  }, [activeTab]);

  /* ================================
     CRUD HANDLER (MASTER STOCK)
  ================================= */
  async function handleDeleteMasterStock(row) {
    if (!confirm(`Hapus stock ${row.Item}?`)) return;
    await deleteMasterStock(row.ID_Stock);
    loadMasterStock();
  }

  /* ================================
     RENDER
  ================================= */
  return (
    <MainContainer title="Master Data">
      <div className="master-data">
        {/* HEADER */}
        <div className="master-header">
          <div>
            <h1>Master Data</h1>
            <p>Pusat pengelolaan data inti produksi & stock</p>
          </div>
        </div>

        {/* TABS */}
        <div className="master-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="master-content">
          {activeTab === "master-stock" && (
            <>
              {loadingStock ? (
                <p>Memuat master stock...</p>
              ) : (
                <MasterStockTab
                  data={masterStockData}
                  onDelete={handleDeleteMasterStock}
                  onSaveSuccess={loadMasterStock}
                />
              )}
            </>
          )}

          {activeTab === "master-produk" && (
            <>
              {loadingProduk ? (
                <p>Memuat master produk...</p>
              ) : (
                <MasterProdukTab data={masterProdukData} />
              )}
            </>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
