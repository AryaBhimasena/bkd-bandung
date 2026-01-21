"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Database, Boxes, Factory, PanelLeft, BookOpen } from "lucide-react";

import "@/styles/sidebar.css";

export default function AppSidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* TOGGLE */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle Sidebar"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <Link
          href="/dashboard"
          className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/master-data"
          className={`menu-item ${isActive("/master-data") ? "active" : ""}`}
        >
          <Database size={18} />
          <span>Master Data</span>
        </Link>

        <Link
          href="/stock"
          className={`menu-item ${isActive("/stock") ? "active" : ""}`}
        >
          <Boxes size={18} />
          <span>Stock</span>
        </Link>

        <Link
          href="/produksi"
          className={`menu-item ${isActive("/produksi") ? "active" : ""}`}
        >
          <Factory size={18} />
          <span>Produksi</span>
        </Link>
		
		<Link
		  href="/keuangan"
		  className={`menu-item ${isActive("/keuangan") ? "active" : ""}`}
		>
		  <BookOpen size={18} />
		  <span>Keuangan</span>
		</Link>

      </nav>
    </aside>
  );
}
