"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { DarkModeToggle } from "@/util/DarkModeToggle";
import { PlacementTable } from "@/util/PlacementTable";
import { PlacementCard } from "@/util/PlacementCard";
import { PlacementStats } from "@/util/PlacementStats";

const StudentPlacements = () => {
    const [placements, setPlacements] = useState([]);
    const [filteredPlacements, setFilteredPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [viewMode, setViewMode] = useState("table"); // table or card
    const [companies, setCompanies] = useState([]);
    const [batches, setBatches] = useState([]);
    const toastRef = useRef(null);

    // Fetch all placements
    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/placements/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch placements");
                }

                const data = await response.json();
                const placementList = Array.isArray(data) ? data : data.placements || [];

                setPlacements(placementList);
                setFilteredPlacements(placementList);

                // Extract unique companies and batches
                const uniqueCompanies = [
                    ...new Set(
                        placementList
                            .map((p) => p.companyName)
                            .filter((c) => c)
                    ),
                ].map((name) => ({ label: name, value: name }));

                const uniqueBatches = [
                    ...new Set(
                        placementList
                            .map((p) => p.batch)
                            .filter((b) => b)
                    ),
                ].sort()
                    .reverse()
                    .map((batch) => ({ label: `Batch ${batch}`, value: batch }));

                setCompanies(uniqueCompanies);
                setBatches(uniqueBatches);
            } catch (error) {
                console.error("Error fetching placements:", error);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load placements",
                    life: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = placements;

        // Search by company name or student name
        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.studentRollNo?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by company
        if (selectedCompany) {
            filtered = filtered.filter((p) => p.companyName === selectedCompany);
        }

        // Filter by batch
        if (selectedBatch) {
            filtered = filtered.filter((p) => p.batch === selectedBatch);
        }

        setFilteredPlacements(filtered);
    }, [searchQuery, selectedCompany, selectedBatch, placements]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Peer Placements
                    </h1>
                    <DarkModeToggle />
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Toast ref={toastRef} />

                {/* Statistics Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Overview
                    </h2>
                    <PlacementStats data={filteredPlacements} />
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search
                            </label>
                            <InputText
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Company or student name"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Company Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company
                            </label>
                            <Dropdown
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.value)}
                                options={companies}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select company"
                                clearIcon={<i className="pi pi-times" />}
                                showClear={true}
                                className="w-full"
                            />
                        </div>

                        {/* Batch Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Batch
                            </label>
                            <Dropdown
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.value)}
                                options={batches}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select batch"
                                clearIcon={<i className="pi pi-times" />}
                                showClear={true}
                                className="w-full"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                View
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${viewMode === "table"
                                        ? "bg-blue-600 dark:bg-blue-700 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${viewMode === "card"
                                        ? "bg-blue-600 dark:bg-blue-700 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }`}
                                >
                                    Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(searchQuery || selectedCompany || selectedBatch) && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCompany(null);
                                setSelectedBatch(null);
                            }}
                            className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Results Section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Placements ({filteredPlacements.length})
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Loading placements...
                                </p>
                            </div>
                        </div>
                    ) : filteredPlacements.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No placements found matching your filters.
                            </p>
                        </div>
                    ) : viewMode === "table" ? (
                        <PlacementTable
                            data={filteredPlacements}
                            showStudentDetails={true}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlacements.map((placement, index) => (
                                <PlacementCard
                                    key={index}
                                    placement={placement}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentPlacements;
