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

      </nav>
    </aside>
  );
}
