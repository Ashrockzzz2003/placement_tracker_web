"use client";
import "material-icons/iconfont/material-icons.css";

export default function Top5PlacementCard({ placementData }) {
    return (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30">
            <div>
                <div className="px-4 py-1 my-2">
                    <p className="font-semibold text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 m-auto">{placementData.ctc + " LPA"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1">
                    <p className="font-extralight text-md text-center text-gray-300"><span>{placementData.companyName}</span> {" | "}  <span>{placementData.jobRole}</span></p>
                </div>

                <hr className="w-full" />

                <div className="px-4 py-4 text-center flex flex-wrap items-center justify-center space-x-1">
                    {placementData["isIntern"] === "1" ? (
                        <div className="bg-yellow-100 rounded-xl py-1 px-2 w-fit text-[#544a15]">Intern</div>
                    ) : null}
                    {placementData["isPPO"] === "1" ? (
                        <div className="bg-green-100 rounded-xl py-1 px-2 w-fit text-[#21430e]">PPO</div>
                    ) : null}
                    {placementData["isOnCampus"] === '1' ? (
                        <div className="bg-purple-100 rounded-xl py-1 px-2 w-fit text-[#1d0e3a]">On Campus</div>
                    ) : (
                        <div className="bg-red-100 rounded-xl py-1 px-2 w-fit text-[#320f0f]">Off Campus</div>
                    )}
                    {placementData["isGirlsDrive"] === '1' ? (
                        <div className="bg-pink-100 rounded-xl py-1 px-2 w-fit text-[#461348]">Girls Drive</div>
                    ) : (
                        null
                    )}
                </div>

                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-4 text-center">
                    <p className="text-gray-900 font-semibold text-lg">{placementData.studentName}</p>
                    <p className="text-gray-700 font-light text-sm">{placementData.studentRollNo} {" | "} {placementData.studentDept + " " + placementData.studentSection}</p>
                </div>
            </div>

        </div>
    )
}