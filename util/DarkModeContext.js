"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for saved preference
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
            setIsDarkMode(JSON.parse(savedMode));
        } else {
            // Check system preference
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDarkMode(prefersDark);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Update localStorage and DOM
        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isLoading }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within DarkModeProvider");
    }
    return context;
};
