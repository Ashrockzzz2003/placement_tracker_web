"use client";

import { useEffect, useState, useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import Link from "next/link";
import Image from "next/image";
import { Toast } from "primereact/toast";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { hashPassword } from "@/util/hash";

export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        const storedProfile = secureLocalStorage.getItem("currentUser");
        if (storedProfile) {
            const userProfile = JSON.parse(storedProfile);
            setProfileData({
                name: userProfile.managerName,
                email: userProfile.managerEmail,
                role: userProfile.managerRole,
                id: userProfile.managerId,
                accountStatus: userProfile.accountStatus,
            });
        } else {
            showToast("Profile Data not found!", "error");
        }
    }, []);

    const showToast = (message, severity) => {
        if (toast.current) {
            toast.current.show({
                severity,
                summary: severity.toUpperCase(),
                detail: message,
                life: 3000,
            });
        }
    };

    if (!profileData) {
        return <LoadingScreen />;
    }

    return (
        <>
            <main className="mb-16" data-aos="fade-in">
                <header className="relative inset-x-0 top-0 z-50">
                    <nav
                        className="flex items-center justify-between p-6 lg:px-8"
                        aria-label="Global"
                    >
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/dashboard/manager"}>
                                <Image
                                    src="/logo.png"
                                    alt="Amrita logo"
                                    width={128}
                                    height={128}
                                    className="ml-auto mr-auto my-4"
                                />
                            </Link>
                        </div>
                        <div className="flex lg:flex lg:flex-1 lg:justify-end">
                            <Link
                                href={"/dashboard/manager"}
                                className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] "
                            >
                                <span className="material-icons">home</span>
                            </Link>
                        </div>
                    </nav>
                </header>

                <div className="relative mt-6 mx-auto max-w-lg px-4">
                    <div
                        className="absolute inset-x-0 px-16 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                        aria-hidden="true"
                    >
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
                    </div>
                    <div className="bg-white p-4 rounded-3xl shadow-xl max-w-md mx-auto border-2 border-gray-100 hover:shadow-lg transition-shadow ease-in-out duration-300">
                        <div className="flex justify-center items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-6">
                                <Image
                                    src={
                                        "https://www.gravatar.com/avatar/" +
                                        hashPassword(
                                            profileData.managerEmail ??
                                                "placements@cb.amrita.edu",
                                        ) +
                                        ".jpg?s=200&d=robohash"
                                    }
                                    alt="Profile Image"
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl font-semibold text-center text-gray-800">
                            {profileData.name}
                        </h1>
                        <p className="text-center text-gray-500 mt-2">
                            {profileData.email}
                        </p>
                        <p className="text-center text-gray-500 mt-1">
                            {"Professor"}
                        </p>

                        <div className="mt-4 text-center">
                            <span
                                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                                    profileData.accountStatus === "1"
                                        ? "bg-green-100 text-green-700"
                                        : profileData.accountStatus === "0"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {profileData.accountStatus === "1"
                                    ? "Active"
                                    : profileData.accountStatus === "0"
                                      ? "Blocked"
                                      : "Waitlisted"}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
            <Toast ref={toast} position="bottom-center" />
        </>
    );
}
