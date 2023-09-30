"use client";
import "material-icons/iconfont/material-icons.css";

export default function Top5PlacementCard({ placementData }) {
    return (
        <div className="border rounded-xl backdrop-blur-xl bg-gray-50">
            <div>
                <div className="px-4 py-1">
                    <p className="font-bold text-xl text-center">{placementData.ctc + " LPA"}</p>

                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1">
                    <p className="font-extralight text-sm text-center">{placementData.companyName + " | " + placementData.jobRole}</p>
                </div>

                <hr className="w-full" />

                <div className="text-center py-1">
                    {placementData.isPPO === "1" ? (
                        <p className="text-gray-700 font-extralight text-sm">{"PPO"}</p>
                    ) : (
                        <p className="text-gray-700 font-extralight text-sm">{"Placement"}</p>
                    )}
                    {placementData.isOnCampus === "1" ? (
                        <p className="text-gray-700 font-extralight text-sm">On-Campus</p>
                    ) : (
                        <p className="text-gray-700 font-extralight text-sm">Off-Campus</p>
                    )}
                </div>

                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-4 text-center">
                    <p className="text-gray-900 font-bold text-xl">{placementData.studentName}</p>
                    <p className="text-gray-700 font-light text-sm">{placementData.studentRollNo}</p>
                </div>
            </div>

        </div>
    )
}