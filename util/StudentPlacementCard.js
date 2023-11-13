"use client";
import "material-icons/iconfont/material-icons.css";
import Link from "next/link";

export default function StudentPlacementCard({ placementData, cardType }) {
    return cardType === "1" ? (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30">
            <div>
                <div className="px-4 py-1 my-2">
                    <p className="font-semibold text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 m-auto">{placementData.ctc + " LPA"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1 text-center">
                    <p className="font-extralight text-md text-black">
                        <Link href={`/dashboard/admin/company/${placementData.companyId}`}>
                            {placementData.companyName}
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500">{placementData["jobRole"]}</p>
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
            </div>

        </div>
    ) : cardType === "0" ? (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30">
            <div>
                <div className="px-4 py-1 my-2">
                    <p className="font-semibold text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 m-auto">{placementData.ctc + " LPA"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1 text-center">
                    <p className="font-extralight text-md text-black">
                        <Link href={`/dashboard/manager/company/${placementData.companyId}`}>
                            {placementData.companyName}
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500">{placementData["jobRole"]}</p>
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
            </div>

        </div>
    ) : (
        <div className="border rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30">
            <div>
                <div className="px-4 py-1 my-2">
                    <p className="font-semibold text-lg text-center bg-green-100 text-[#501515] rounded-xl w-fit px-2 m-auto">{placementData.ctc + " LPA"}</p>
                </div>
                <hr className="border-gray-900 w-full" />
                <div className="px-4 py-1 text-center">
                    <p className="font-extralight text-md text-black">{placementData.companyName}</p>
                    <p className="text-xs text-gray-500">{placementData["jobRole"]}</p>
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
            </div>

        </div>
    );
}