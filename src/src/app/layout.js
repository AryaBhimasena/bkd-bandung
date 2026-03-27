"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { clientBootstrap } from "@/lib/clientBootstrap";

function BootstrapProvider({ children }) {
  useEffect(() => {
    clientBootstrap();
  }, []);

  return children;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <html lang="id">
      <body>
        <BootstrapProvider>
          {isLoginPage ? (
            children
          ) : (
            <>
              <AppHeader />
              <div
                style={{
                  display: "flex",
                  height: "calc(100vh - 56px)",
                }}
              >
                <AppSidebar
                  collapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed(v => !v)}
                />

                {/* PAGE CONTENT */}
                {children}
              </div>
            </>
          )}
        </BootstrapProvider>
      </body>
    </html>
  );
}
