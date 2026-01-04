"use client";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "material-icons/iconfont/material-icons.css";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/util/hash";

export default function StudentProfile() {
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUserAccess(secureLocalStorage.getItem("userAccess"));
                const currentUser = secureLocalStorage.getItem("currentUser");

                if (currentUser) {
                    setStudentData(JSON.parse(currentUser));
                } else {
                    alert("Error: User not found. Redirecting to login.");
                    router.replace("/login");
                }

                Aos.init({
                    duration: 500,
                    once: true,
                    easing: "ease-in-out",
                    delay: 100,
                });
            } catch (error) {
                alert("Error: Failed to load profile data.");
                router.replace("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return (
        <>
            {isLoading || !studentData ? (
                <LoadingScreen />
            ) : (
                <main>
                    <div data-aos="fade-in">
                        <header className="absolute inset-x-0 top-0 z-50">
                            <nav
                                className="flex items-center justify-between p-4 sm:p-6 lg:px-8"
                                aria-label="Global"
                            >
                                <div className="lg:flex lg:gap-x-12">
                                    <Link href="/dashboard/student">
                                        <Image
                                            src="/logo.png"
                                            alt="Amrita logo"
                                            width={128}
                                            height={128}
                                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 ml-auto mr-auto my-2 sm:my-4"
                                        />
                                    </Link>
                                </div>
                                <div className="flex lg:flex lg:flex-1 lg:justify-end">
                                    <Link
                                        href="/dashboard/student"
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 sm:p-3 min-w-[44px] min-h-[44px] flex flex-row justify-center items-center hover:bg-opacity-80 cursor-pointer"
                                    >
                                        <span className="material-icons text-lg sm:text-xl">
                                            home
                                        </span>
                                    </Link>
                                </div>
                            </nav>
                        </header>

                        <div className="relative isolate px-4 sm:px-6 lg:px-8 flex justify-center items-center m-auto pt-20 sm:pt-8">
                            <div
                                className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                                aria-hidden="true"
                            >
                                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[64%] -translate-x-1/2 rotate-[40deg] bg-linear-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
                            </div>

                            <div className="mx-auto max-w-2xl py-8 sm:py-16 lg:py-24 px-4">
                                <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-2 border-gray-100 hover:shadow-lg transition-shadow ease-in-out duration-300">
                                    {/* Profile Image (Gravatar) */}
                                    <div className="flex justify-center items-center mb-4 sm:mb-6">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md">
                                            <Image
                                                src={`https://www.gravatar.com/avatar/${hashPassword(studentData.studentEmail ?? "placements@cb.amrita.edu")}.jpg?s=200&d=robohash`}
                                                alt="Profile Image"
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4 gap-2">
                                        <h2
                                            className={`${studentData.studentName.length > 18 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-semibold text-gray-800 truncate flex-1`}
                                        >
                                            {studentData.studentName}
                                        </h2>
                                        <Link href="/dashboard/student/editData">
                                            <button className="bg-blue-500 text-white rounded-full p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-blue-600 shadow-md">
                                                <span className="material-icons text-lg sm:text-xl">
                                                    edit
                                                </span>
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                        <div
                                            className={`inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full ${
                                                studentData.isPlaced === "1"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {studentData.isPlaced === "1"
                                                ? "Placed"
                                                : "Not Placed"}
                                        </div>
                                        {studentData.isHigherStudies ===
                                            "1" && (
                                            <div className="inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700">
                                                Higher Studies
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Details */}
                                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                        <div className="text-sm sm:text-lg text-gray-800 break-words">
                                            <p className="mb-2">
                                                <strong>Roll No:</strong>{" "}
                                                {studentData.studentRollNo}
                                            </p>
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                <span className="break-all">{studentData.studentEmail}</span>
                                            </p>
                                        </div>
                                        {/* Grouped Department, Section, and Batch */}
                                        <div className="text-sm sm:text-lg text-gray-800">
                                            <p>
                                                <strong>Program:</strong>{" "}
                                                {studentData.studentDept}{" "}
                                                {studentData.studentSection},{" "}
                                                {studentData.studentBatch} Batch
                                            </p>
                                        </div>
                                        <p className="text-sm sm:text-lg text-gray-800">
                                            <strong>CGPA:</strong>{" "}
                                            {studentData.CGPA}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
