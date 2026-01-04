"use client";

import React from "react";

export const PlacementCard = ({ placement = {} }) => {
    const {
        companyName = "-",
        studentName = "-",
        studentRollNo = "-",
        ctc = "-",
        jobRole = "-",
        jobLocation = "-",
        isIntern = "0",
        isPPO = "0",
        isOnCampus = "0",
        isGirlsDrive = "0",
        studentDept = "-",
    } = placement;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow">
            {/* Company and Role */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {companyName}
                </h3>
                {jobRole && jobRole !== "-" && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {jobRole}
                    </p>
                )}
            </div>

            {/* Student Info */}
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Student:</span> {studentName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Roll No:</span> {studentRollNo}
                </p>
                {studentDept && studentDept !== "-" && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Department:</span>{" "}
                        {studentDept}
                    </p>
                )}
            </div>

            {/* CTC and Location */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        CTC (LPA)
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {ctc}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {jobLocation}
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {isIntern === "1" && (
                    <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full">
                        Internship
                    </span>
                )}
                {isPPO === "1" && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                        PPO
                    </span>
                )}
                {isOnCampus === "1" ? (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
                        On Campus
                    </span>
                ) : (
                    <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                        Off Campus
                    </span>
                )}
                {isGirlsDrive === "1" && (
                    <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs font-semibold px-3 py-1 rounded-full">
                        Girls Drive
                    </span>
                )}
            </div>
        </div>
    );
};
