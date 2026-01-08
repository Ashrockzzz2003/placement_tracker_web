"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Amrita logo"
            width={128}
            height={128}
          />
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2
                       bg-gray-200 dark:bg-gray-800
                       text-black dark:text-white
                       shadow hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            <span className="material-icons">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <Link
            href="/login"
            className="bg-black dark:bg-gray-800
                       text-white rounded-xl p-2"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

