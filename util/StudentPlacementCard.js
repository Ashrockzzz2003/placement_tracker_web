"use client";
import "material-icons/iconfont/material-icons.css";
import Link from "next/link";

export default function StudentPlacementCard({
    placementData,
    cardType,
    studentId,
}) {
    const openEditPlacement = (placementID) => {
        window.open(
            `/dashboard/student/editPlacement/${placementID}`,
            "_parent",
        );
    };
    const openEditPlacementAdmin = (placementID) => {
        window.open(
            `/dashboard/admin/student/${studentId}/editPlacement/${placementID}`,
            "_parent",
        );
    };

    return cardType === "1" ? (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-full sm:w-auto min-w-[280px] max-w-full">
            <div>
                <div className="px-3 sm:px-4 py-1 my-2 flex m-auto align-middle gap-2">
                    <p className="font-semibold text-base sm:text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 sm:px-3 m-auto">
                        {placementData.ctc + " LPA"}
                    </p>
                    {/* <Link href={"/dashboard/student/editPlacement/"+placementID}><span className="material-icons">edit_square</span></Link> */}
                    <button
                        onClick={() =>
                            openEditPlacementAdmin(placementData.placementID)
                        }
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                        <span className="material-icons text-lg sm:text-xl">edit_square</span>
                    </button>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-3 sm:px-4 py-1 text-center">
                    <p className="font-extralight text-sm sm:text-md text-black break-words">
                        {placementData.companyName}
                    </p>
                    <p className="text-xs text-gray-500 break-words">
                        {placementData["jobRole"]}
                    </p>
                </div>

                <hr className="w-full" />

                <div className="px-3 sm:px-4 py-3 sm:py-4 text-center flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                    {placementData["isIntern"] === "1" ? (
                        <div className="bg-yellow-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#544a15]">
                            Intern
                        </div>
                    ) : null}
                    {placementData["isPPO"] === "1" ? (
                        <div className="bg-green-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#21430e]">
                            PPO
                        </div>
                    ) : null}
                    {placementData["isOnCampus"] === "1" ? (
                        <div className="bg-purple-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#1d0e3a]">
                            On Campus
                        </div>
                    ) : (
                        <div className="bg-red-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#320f0f]">
                            Off Campus
                        </div>
                    )}
                    {placementData["isGirlsDrive"] === "1" ? (
                        <div className="bg-pink-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#461348]">
                            Girls Drive
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    ) : cardType === "0" ? (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-full sm:w-auto min-w-[280px] max-w-full">
            <div>
                <div className="px-3 sm:px-4 py-1 my-2">
                    <p className="font-semibold text-base sm:text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 sm:px-3 m-auto">
                        {placementData.ctc + " LPA"}
                    </p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-3 sm:px-4 py-1 text-center">
                    <p className="font-extralight text-sm sm:text-md text-black break-words">
                        <Link
                            href={`/dashboard/manager/company/${placementData.companyId}`}
                            className="hover:underline"
                        >
                            {placementData.companyName}
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500 break-words">
                        {placementData["jobRole"]}
                    </p>
                </div>

                <hr className="w-full" />

                <div className="px-3 sm:px-4 py-3 sm:py-4 text-center flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                    {placementData["isIntern"] === "1" ? (
                        <div className="bg-yellow-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#544a15]">
                            Intern
                        </div>
                    ) : null}
                    {placementData["isPPO"] === "1" ? (
                        <div className="bg-green-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#21430e]">
                            PPO
                        </div>
                    ) : null}
                    {placementData["isOnCampus"] === "1" ? (
                        <div className="bg-purple-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#1d0e3a]">
                            On Campus
                        </div>
                    ) : (
                        <div className="bg-red-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#320f0f]">
                            Off Campus
                        </div>
                    )}
                    {placementData["isGirlsDrive"] === "1" ? (
                        <div className="bg-pink-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#461348]">
                            Girls Drive
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    ) : (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-full sm:w-auto min-w-[280px] max-w-full">
            <div>
                <div className="px-3 sm:px-4 py-1 my-2 flex m-auto align-middle gap-2">
                    <p className="font-semibold text-base sm:text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 sm:px-3 m-auto">
                        {placementData.ctc + " LPA"}
                    </p>
                    {/* <Link href={"/dashboard/student/editPlacement/"+placementID}><span className="material-icons">edit_square</span></Link> */}
                    <button
                        onClick={() =>
                            openEditPlacement(placementData.placementID)
                        }
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                        <span className="material-icons text-lg sm:text-xl">edit_square</span>
                    </button>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-3 sm:px-4 py-1 text-center">
                    <p className="font-extralight text-sm sm:text-md text-black break-words">
                        {placementData.companyName}
                    </p>
                    <p className="text-xs text-gray-500 break-words">
                        {placementData["jobRole"]}
                    </p>
                </div>

                <hr className="w-full" />

                <div className="px-3 sm:px-4 py-3 sm:py-4 text-center flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                    {placementData["isIntern"] === "1" ? (
                        <div className="bg-yellow-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#544a15]">
                            Intern
                        </div>
                    ) : null}
                    {placementData["isPPO"] === "1" ? (
                        <div className="bg-green-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#21430e]">
                            PPO
                        </div>
                    ) : null}
                    {placementData["isOnCampus"] === "1" ? (
                        <div className="bg-purple-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#1d0e3a]">
                            On Campus
                        </div>
                    ) : (
                        <div className="bg-red-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#320f0f]">
                            Off Campus
                        </div>
                    )}
                    {placementData["isGirlsDrive"] === "1" ? (
                        <div className="bg-pink-100 rounded-xl py-1 px-2 text-xs sm:text-sm w-fit text-[#461348]">
                            Girls Drive
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
