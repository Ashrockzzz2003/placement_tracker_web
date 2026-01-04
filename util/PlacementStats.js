"use client";

import React, { useMemo } from "react";

export const PlacementStats = ({ data = [] }) => {
    const stats = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                totalPlacements: 0,
                averageCTC: 0,
                maxCTC: 0,
                minCTC: 0,
                placementRate: 0,
                placedStudents: 0,
            };
        }

        const totalPlacements = data.length;

        // Filter for actual placements (not internships only)
        const placedPlacements = data.filter((p) => p.isIntern !== "1" || p.isPPO === "1");
        const placedStudents = new Set(placedPlacements.map((p) => p.studentRollNo)).size;

        // Calculate CTC stats
        const ctcValues = data
            .map((p) => parseFloat(p.ctc))
            .filter((val) => !isNaN(val));

        const averageCTC = ctcValues.length > 0
            ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(2)
            : 0;

        const maxCTC = ctcValues.length > 0 ? Math.max(...ctcValues).toFixed(2) : 0;
        const minCTC = ctcValues.length > 0 ? Math.min(...ctcValues).toFixed(2) : 0;

        const placementRate = totalPlacements > 0
            ? ((placedStudents / totalPlacements) * 100).toFixed(1)
            : 0;

        return {
            totalPlacements,
            averageCTC,
            maxCTC,
            minCTC,
            placementRate,
            placedStudents,
        };
    }, [data]);

    const StatCard = ({ label, value, unit = "", color = "blue" }) => {
        const colorClasses = {
            blue: "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700",
            green:
                "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-200 dark:border-green-700",
            purple:
                "bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700",
            orange:
                "bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700",
        };

        return (
            <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold mt-2">
                    {value}
                    {unit && <span className="text-lg">{unit}</span>}
                </p>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total Placements"
                value={stats.totalPlacements}
                color="blue"
            />
            <StatCard
                label="Average CTC"
                value={stats.averageCTC}
                unit=" LPA"
                color="green"
            />
            <StatCard
                label="Highest CTC"
                value={stats.maxCTC}
                unit=" LPA"
                color="purple"
            />
            <StatCard
                label="Placement Rate"
                value={stats.placementRate}
                unit="%"
                color="orange"
            />
        </div>
    );
};
