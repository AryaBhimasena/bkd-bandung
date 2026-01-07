"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { useState } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  return (
    <html lang="id">
      <body>
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
				  onToggle={() => setSidebarCollapsed((v) => !v)}
				/>
              {/* PAGE CONTENT ONLY */}
              {children}
            </div>
          </>
        )}
      </body>
    </html>
  );
}
