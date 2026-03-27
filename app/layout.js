"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import AppHeader from "@/components/layout/AppHeader";
import AppNavMenu from "@/components/layout/NavMenu";
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

  return (
    <html lang="id">
      <body>
        <BootstrapProvider>
          {isLoginPage ? (
            children
          ) : (
            <>
              <AppHeader />
              <AppNavMenu />
              <div
                style={{
                  display: "flex",
                  height: "calc(100vh - 56px)",
                }}
              >
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
