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

export default function StudentProfile() {
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");
    const toast = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUserAccess(secureLocalStorage.getItem("userAccess"));
                const currentUser = secureLocalStorage.getItem("currentUser");

                if (currentUser) {
                    setStudentData(JSON.parse(currentUser));
                } else {
                    alertError("Error", "User not found. Redirecting to login.");
                    router.replace("/login");
                }

                Aos.init({
                    duration: 500,
                    once: true,
                    easing: "ease-in-out",
                    delay: 100,
                });
            } catch (error) {
                alertError("Error", "Failed to load profile data.");
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
                            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                                <div className="lg:flex lg:gap-x-12">
                                    <Link href="/dashboard/student">
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
                                        href="/dashboard/student"
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 flex flex-row hover:bg-opacity-80 cursor-pointer"
                                    >
                                        <span className="material-icons">home</span>
                                    </Link>
                                </div>
                            </nav>
                        </header>

                        <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                            <div
                                className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                                aria-hidden="true"
                            >
                                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
                            </div>

                            <div className="mx-auto max-w-2xl py-16 lg:py-24">
                                <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-100 hover:shadow-lg transition-shadow ease-in-out duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className={`${ studentData.studentName.length > 18 ? 'text-2xl' : 'text-3xl' } font-semibold text-gray-800 truncate`}>
                                            {studentData.studentName}
                                        </h2>
                                        <Link href="/dashboard/student/editData">
                                            <button className="bg-blue-500 text-white rounded-full p-2 flex items-center hover:bg-blue-600 shadow-md">
                                                <span className="material-icons">edit</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                                                studentData.isPlaced === "1"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                            {studentData.isPlaced === "1" ? "Placed" : "Not Placed"}
                                        </div>
                                        {studentData.isHigherStudies === "1" && (
                                            <div className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700">
                                                Higher Studies
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="text-lg text-gray-800">
                                            <p><strong>Roll No:</strong> {studentData.studentRollNo}</p>
                                            <p><strong>Email:</strong> {studentData.studentEmail}</p>
                                        </div>
                                        <div className="text-lg text-gray-800">
                                            <p><strong>Department:</strong> {studentData.studentDept}</p>
                                            <p><strong>Batch:</strong> {studentData.studentBatch}</p>
                                            <p><strong>Section:</strong> {studentData.studentSection}</p>
                                        </div>
                                        <p className="text-lg text-gray-800"><strong>CGPA:</strong> {studentData.CGPA}</p>
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
