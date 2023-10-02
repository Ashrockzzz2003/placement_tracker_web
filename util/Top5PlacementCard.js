"use client";
import "material-icons/iconfont/material-icons.css";

export default function Top5PlacementCard({ placementData }) {
    return (
        <div className="border rounded-xl backdrop-blur-xl bg-[#f4f4f4]">
            <div>
                <div className="px-4 py-1">
                    <p className="font-bold text-xl text-center bg-black text-white rounded-xl w-fit px-2 m-auto">{placementData.ctc + " LPA"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1">
                    <p className="font-extralight text-sm text-center text-gray-300"><span>{placementData.companyName}</span> {" | "}  <span>{placementData.jobRole}</span></p>
                </div>

                <hr className="w-full" />

                <div className="text-center py-1 px-4">
                    <p className="font-extralight text-sm text-gray-300 italic"><span>{placementData.isPPO === "1" ? "PPO" : "Placement"}</span> | {placementData.isOnCampus === "1" ? "On-Campus" : "Off-Campus"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-4 text-center">
                    <p className="text-gray-900 font-bold text-xl">{placementData.studentName}</p>
                    <p className="text-gray-700 font-light text-sm">{placementData.studentRollNo} {" | "} {placementData.studentDept + " " + placementData.studentSection}</p>
                </div>
            </div>

        </div>
    )
}