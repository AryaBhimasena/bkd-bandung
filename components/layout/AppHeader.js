"use client";

import { useEffect, useState } from "react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

import "@/styles/header.css";

export default function AppHeader() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(null);
  const [nama, setNama] = useState("");

  useEffect(() => {
    setMounted(true);
    setNow(new Date());

    // Ambil nama dari localStorage
    const authRaw = localStorage.getItem("auth_user");
    if (authRaw) {
      try {
        const auth = JSON.parse(authRaw);
        setNama(auth.nama || "");
      } catch {
        setNama("");
      }
    }

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.replace("/");
  };

  const formatter =
    mounted && now
      ? new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(now)
      : "";

  if (!mounted) return null;

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-title">Bejana Kopi Dunia</span>
        <span className="separator">–</span>
        <span className="user-name">{nama || "User"}</span>

        <button
          className="logout-btn"
          title="Logout"
          onClick={handleLogout}
        >
          <Power size={18} />
        </button>
      </div>

      <div className="app-header__right">
        {formatter}
      </div>
    </header>
  );
}
