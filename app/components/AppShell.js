"use client";

import Navbar from "./Navbar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
}

