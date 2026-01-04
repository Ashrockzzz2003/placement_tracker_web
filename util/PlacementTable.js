"use client";

import React from "react";

export const PlacementTable = ({
    data = [],
    showStudentDetails = false,
    className = "",
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No placements found</p>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full rounded-2xl backdrop-blur-2xl bg-red-50 dark:bg-gray-800 bg-opacity-30 dark:bg-opacity-50 text-center text-sm border-black dark:border-gray-700 border-separate border-spacing-0 border-solid">
                <thead className="border-0 text-lg font-medium">
                    <tr className="bg-black dark:bg-gray-900 text-white bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl">
                        {showStudentDetails && (
                            <>
                                <th className="px-2 py-1 border-black dark:border-gray-700 rounded-tl-2xl">
                                    Roll Number
                                </th>
                                <th className="px-2 py-1 border-black dark:border-gray-700">
                                    Student Name
                                </th>
                                <th className="px-2 py-1 border-black dark:border-gray-700">
                                    Department
                                </th>
                            </>
                        )}
                        <th className="px-2 py-1 border-black dark:border-gray-700">
                            Company
                        </th>
                        <th className="px-2 py-1 border-black dark:border-gray-700">
                            CTC (LPA)
                        </th>
                        <th className="px-2 py-1 border-black dark:border-gray-700">
                            Location
                        </th>
                        <th className="px-2 py-1 border-black dark:border-gray-700">
                            Job Role
                        </th>
                        <th className="px-2 py-1 border-black dark:border-gray-700 rounded-tr-2xl">
                            Details
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((placement, index) => (
                        <tr
                            key={`${placement.placementId}-${index}`}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {showStudentDetails && (
                                <>
                                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                        {placement.studentRollNo || "-"}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                        {placement.studentName || "-"}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                        {placement.studentDept || "-"}
                                    </td>
                                </>
                            )}
                            <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                <div>
                                    {placement.companyName || "-"}
                                    {placement.jobRole && placement.jobRole !== "-" && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {placement.jobRole}
                                        </p>
                                    )}
                                </div>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-600 px-2 py-1 font-semibold">
                                {placement.ctc || "-"}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                {placement.jobLocation || "-"}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-600 px-2 py-1">
                                {placement.jobRole || "-"}
                            </td>
                            <td
                                className={`border border-gray-200 dark:border-gray-600 px-2 py-1 ${
                                    index === data.length - 1
                                        ? "rounded-br-2xl"
                                        : ""
                                }`}
                            >
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {placement.isIntern === "1" && (
                                        <span className="bg-yellow-100 dark:bg-yellow-900 rounded px-2 py-1 text-xs text-yellow-800 dark:text-yellow-200">
                                            Intern
                                        </span>
                                    )}
                                    {placement.isPPO === "1" && (
                                        <span className="bg-green-100 dark:bg-green-900 rounded px-2 py-1 text-xs text-green-800 dark:text-green-200">
                                            PPO
                                        </span>
                                    )}
                                    {placement.isOnCampus === "1" ? (
                                        <span className="bg-purple-100 dark:bg-purple-900 rounded px-2 py-1 text-xs text-purple-800 dark:text-purple-200">
                                            On Campus
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 dark:bg-red-900 rounded px-2 py-1 text-xs text-red-800 dark:text-red-200">
                                            Off Campus
                                        </span>
                                    )}
                                    {placement.isGirlsDrive === "1" && (
                                        <span className="bg-pink-100 dark:bg-pink-900 rounded px-2 py-1 text-xs text-pink-800 dark:text-pink-200">
                                            Girls Drive
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
