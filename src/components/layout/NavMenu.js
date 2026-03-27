"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Wrench } from "lucide-react";
import "@/styles/navmenu.css";

export default function AppNavMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const [showPopup, setShowPopup] = useState(false);

  const menus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Transaksi", path: "/dashboard/transaksi" },
    { label: "Laporan", path: "/dashboard/laporan" },
    { label: "COA", path: "/dashboard/coa" },
    { label: "Pengaturan", path: "/dashboard/pengaturan" },
  ];

  function handleClick(menu) {
    if (menu.path === "/dashboard") {
      router.push(menu.path);
    } else {
      setShowPopup(true);
    }
  }

  function isActive(path) {
    return pathname === path || pathname.startsWith(path + "/");
  }

  return (
    <>
      <nav className="navmenu">
        <div className="navmenu__inner">
          {menus.map((menu, i) => (
            <button
              key={i}
              className={`navmenu__item ${
                isActive(menu.path) ? "active" : ""
              }`}
              onClick={() => handleClick(menu)}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="navmenu-popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="navmenu-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="navmenu-popup-icon">
              <Wrench size={20} />
            </div>

            <h4>Dalam Pengembangan</h4>
            <p>Halaman ini sedang dalam proses pengembangan.</p>

            <button
              className="navmenu-popup-btn"
              onClick={() => setShowPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}