"use client";

import Navbar from "./Navbar";

export default function AppShell({ children }) {
  return (
    <div className="h-screen bg-white dark:bg-black text-black dark:text-white transition-colors overflow-hidden">
      <Navbar />
      <main className="pt-24 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

