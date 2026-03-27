"use client";

import "@/styles/main-container.css";

export default function MainContainer({ children, title }) {
  return (
    <main className="main-wrapper">
      <section className="main-card">
        {children}
      </section>
    </main>
  );
}
