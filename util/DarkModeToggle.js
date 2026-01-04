"use client";

import React from "react";
import { useDarkMode } from "./DarkModeContext";

export const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl p-2 items-center align-middle flex flex-row hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-2"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? (
                <span className="material-icons">light_mode</span>
            ) : (
                <span className="material-icons">dark_mode</span>
            )}
        </button>
    );
};
