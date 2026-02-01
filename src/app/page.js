"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import "@/styles/pages/login.css";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Overlay */}
      <div className="login-overlay" />

      {/* Brand Info */}
      <div className="login-branding">
        <h1>PT. Bejana Kopi Dunia</h1>
        <h2>Bejana Accounting & Operations System</h2>
        <p>
          Sistem terintegrasi untuk operasional, persediaan, dan laporan keuangan
          berbasis standar akuntansi.
        </p>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <h3>Masuk ke Sistem</h3>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </div>
    </div>
  );
}
