"use client";

import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export const ComparisonCharts = ({ allPlacementData, batches }) => {
    const [selectedBatch1, setSelectedBatch1] = useState(null);
    const [selectedBatch2, setSelectedBatch2] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "#495057",
                    font: {
                        size: 12,
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
            y: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
        },
    };

    const generateComparison = () => {
        if (!selectedBatch1 || !selectedBatch2) {
            alert("Please select two batches to compare");
            return;
        }

        const batch1Data = allPlacementData.filter(
            (p) => p.batch === selectedBatch1
        );
        const batch2Data = allPlacementData.filter(
            (p) => p.batch === selectedBatch2
        );

        // Company-wise comparison
        const companyWiseComparison = getCompanyWiseComparison(
            batch1Data,
            batch2Data
        );

        // CTC comparison
        const ctcComparison = getCTCComparison(batch1Data, batch2Data);

        // Overall statistics
        const overallStats = {
            batch1: {
                totalPlacements: batch1Data.length,
                avgCTC:
                    batch1Data.reduce((sum, p) => sum + (p.ctc || 0), 0) /
                    (batch1Data.length || 1),
                maxCTC: Math.max(...batch1Data.map((p) => p.ctc || 0), 0),
            },
            batch2: {
                totalPlacements: batch2Data.length,
                avgCTC:
                    batch2Data.reduce((sum, p) => sum + (p.ctc || 0), 0) /
                    (batch2Data.length || 1),
                maxCTC: Math.max(...batch2Data.map((p) => p.ctc || 0), 0),
            },
        };

        setComparisonData({
            companyWiseComparison,
            ctcComparison,
            overallStats,
            batch1: selectedBatch1,
            batch2: selectedBatch2,
        });
        setShowComparison(true);
    };

    const getCompanyWiseComparison = (batch1, batch2) => {
        const companies1 = {};
        const companies2 = {};

        batch1.forEach((p) => {
            companies1[p.companyName] =
                (companies1[p.companyName] || 0) + 1;
        });

        batch2.forEach((p) => {
            companies2[p.companyName] =
                (companies2[p.companyName] || 0) + 1;
        });

        const allCompanies = [
            ...new Set([
                ...Object.keys(companies1),
                ...Object.keys(companies2),
            ]),
        ];

        return {
            labels: allCompanies,
            datasets: [
                {
                    label: `Batch ${selectedBatch1}`,
                    data: allCompanies.map((c) => companies1[c] || 0),
                    backgroundColor: "rgba(99, 102, 241, 0.8)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    borderWidth: 1,
                },
                {
                    label: `Batch ${selectedBatch2}`,
                    data: allCompanies.map((c) => companies2[c] || 0),
                    backgroundColor: "rgba(168, 85, 247, 0.8)",
                    borderColor: "rgba(168, 85, 247, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    const getCTCComparison = (batch1, batch2) => {
        const ctcRanges = [
            "0-5",
            "5-10",
            "10-15",
            "15-20",
            "20-25",
            "25+",
        ];

        const countInRange = (data, min, max) => {
            return data.filter(
                (p) => p.ctc >= min && (max === Infinity ? true : p.ctc < max)
            ).length;
        };

        const batch1Counts = [
            countInRange(batch1, 0, 5),
            countInRange(batch1, 5, 10),
            countInRange(batch1, 10, 15),
            countInRange(batch1, 15, 20),
            countInRange(batch1, 20, 25),
            countInRange(batch1, 25, Infinity),
        ];

        const batch2Counts = [
            countInRange(batch2, 0, 5),
            countInRange(batch2, 5, 10),
            countInRange(batch2, 10, 15),
            countInRange(batch2, 15, 20),
            countInRange(batch2, 20, 25),
            countInRange(batch2, 25, Infinity),
        ];

        return {
            labels: ctcRanges.map((r) => `₹${r}L`),
            datasets: [
                {
                    label: `Batch ${selectedBatch1}`,
                    data: batch1Counts,
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderColor: "rgba(59, 130, 246, 1)",
                    borderWidth: 1,
                },
                {
                    label: `Batch ${selectedBatch2}`,
                    data: batch2Counts,
                    backgroundColor: "rgba(34, 197, 94, 0.8)",
                    borderColor: "rgba(34, 197, 94, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Compare Placements Between Batches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Batch
                    </label>
                    <Dropdown
                        value={selectedBatch1}
                        onChange={(e) => setSelectedBatch1(e.value)}
                        options={batches}
                        placeholder="Select batch"
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Second Batch
                    </label>
                    <Dropdown
                        value={selectedBatch2}
                        onChange={(e) => setSelectedBatch2(e.value)}
                        options={batches}
                        placeholder="Select batch"
                        className="w-full"
                    />
                </div>

                <div className="flex items-end">
                    <Button
                        label="Compare"
                        onClick={generateComparison}
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    />
                </div>
            </div>

            {showComparison && comparisonData && (
                <div className="space-y-6">
                    {/* Overall Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                                Batch {comparisonData.batch1}
                            </h3>
                            <p className="text-2xl font-bold text-indigo-600">
                                {comparisonData.overallStats.batch1.totalPlacements}
                            </p>
                            <p className="text-xs text-indigo-700">
                                Total Placements
                            </p>
                            <p className="text-lg font-semibold text-indigo-600 mt-2">
                                ₹{comparisonData.overallStats.batch1.avgCTC.toFixed(
                                    2
                                )}L
                            </p>
                            <p className="text-xs text-indigo-700">Avg CTC</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-purple-900 mb-2">
                                Batch {comparisonData.batch2}
                            </h3>
                            <p className="text-2xl font-bold text-purple-600">
                                {comparisonData.overallStats.batch2.totalPlacements}
                            </p>
                            <p className="text-xs text-purple-700">
                                Total Placements
                            </p>
                            <p className="text-lg font-semibold text-purple-600 mt-2">
                                ₹{comparisonData.overallStats.batch2.avgCTC.toFixed(
                                    2
                                )}L
                            </p>
                            <p className="text-xs text-purple-700">Avg CTC</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-green-900 mb-2">
                                Difference
                            </h3>
                            <p className="text-2xl font-bold text-green-600">
                                {comparisonData.overallStats.batch1
                                    .totalPlacements -
                                    comparisonData.overallStats.batch2
                                        .totalPlacements}
                            </p>
                            <p className="text-xs text-green-700">
                                Placement Difference
                            </p>
                            <p className="text-lg font-semibold text-green-600 mt-2">
                                ₹
                                {(
                                    comparisonData.overallStats.batch1.avgCTC -
                                    comparisonData.overallStats.batch2.avgCTC
                                ).toFixed(2)}
                                L
                            </p>
                            <p className="text-xs text-green-700">
                                Avg CTC Difference
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Company-wise Comparison
                            </h3>
                            <Chart
                                type="bar"
                                data={comparisonData.companyWiseComparison}
                                options={chartOptions}
                                style={{ height: "300px" }}
                            />
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                CTC Range Distribution
                            </h3>
                            <Chart
                                type="bar"
                                data={comparisonData.ctcComparison}
                                options={chartOptions}
                                style={{ height: "300px" }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
