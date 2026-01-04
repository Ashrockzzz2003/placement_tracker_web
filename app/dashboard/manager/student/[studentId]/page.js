"use client";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "material-icons/iconfont/material-icons.css";
import "aos/dist/aos.css";
import { useParams, useRouter } from "next/navigation";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { Toast } from "primereact/toast";
import { GET_STUDENT_PLACEMENTS_URL } from "@/util/constants";
import Aos from "aos";
import StudentPlacementCard from "@/util/StudentPlacementCard";

export default function StudentPage() {
    const [studentData, setStudentData] = useState(null);
    const [studentPlacements, setStudentPlacements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const toast = useRef(null);

    const alertError = (summary, detail) => {
        toast.current.show({
            severity: "error",
            summary: summary,
            detail: detail,
        });
    };

    const { studentId } = useParams();

    useEffect(() => {
        if (isNaN(studentId)) {
            alertError("Error", "Invalid Student ID");
            setTimeout(() => {
                router.replace("/dashboard/manager/students");
            }, 3000);
        }

        fetch(GET_STUDENT_PLACEMENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("userAccess")}`,
            },
            body: JSON.stringify({
                studentId: studentId,
            }),
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setStudentData(data["student"]);
                        setStudentPlacements(data["placementData"]);
                    });
                } else if (res.status === 401) {
                    secureLocalStorage.clear();
                    alertError(
                        "Session Expired",
                        "Please login again to continue.",
                    );
                    setTimeout(() => {
                        router.replace("/login");
                    }, 3000);
                } else {
                    alertError(
                        "Error",
                        "Something went wrong. Please try again later.",
                    );
                }
            })
            .catch((err) => {
                alertError(
                    "Error",
                    "Something went wrong. Please try again later.",
                );
            })
            .finally(() => {
                setIsLoading(false);
            });

        Aos.init({
            duration: 500,
            once: true,
            easing: "ease-in-out",
            delay: 100,
        });
    });

    return (
        <>
            {isLoading ||
            studentPlacements === null ||
            studentPlacements === undefined ||
            studentData === null ||
            studentData === undefined ? (
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
                                    <Link href={"/dashboard/manager"}>
                                        <Image
                                            src="/logo.png"
                                            alt="Amrita logo"
                                            width={128}
                                            height={128}
                                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 ml-auto mr-auto my-2 sm:my-4"
                                        />
                                    </Link>
                                </div>
                                <div className="flex flex-wrap gap-2 lg:flex lg:flex-1 lg:justify-end">
                                    <Link
                                        href={"/dashboard/manager/student"}
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 sm:p-3 min-h-[44px] items-center align-middle flex flex-row hover:bg-[#3b3b3b] text-sm sm:text-base"
                                    >
                                        <span className="material-icons mr-2 text-lg sm:text-xl">
                                            badge
                                        </span>{" "}
                                        <span className="hidden sm:inline">All Students</span>
                                    </Link>
                                    <Link
                                        href={"/dashboard/manager"}
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 sm:p-3 min-w-[44px] min-h-[44px] items-center align-middle flex flex-row justify-center hover:bg-[#3b3b3b] sm:ml-2"
                                    >
                                        <span className="material-icons text-lg sm:text-xl">
                                            home
                                        </span>
                                    </Link>
                                </div>
                            </nav>
                        </header>

                        <div className="relative isolate px-4 sm:px-6 lg:px-8 justify-center items-center m-auto pt-20 sm:pt-8">
                            <div
                                className="absolute inset-x-0 px-40 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                                aria-hidden="true"
                            >
                                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[64%] -translate-x-1/2 rotate-[40deg] bg-linear-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
                            </div>

                            <div className="mx-auto max-w-2xl pt-8 sm:pt-16 lg:pt-24 pb-4 sm:pb-8 mt-8 sm:mt-16 px-4">
                                <div className="text-center">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 break-words">
                                        {studentData["studentName"]}
                                    </h1>
                                    <p className="mt-2 sm:mt-4 text-sm sm:text-lg leading-6 sm:leading-7 text-gray-500 px-4">
                                        {studentData["studentRollNo"]} |{" "}
                                        {studentData["studentDept"]}{" "}
                                        {studentData["studentSection"]} |{" "}
                                        {studentData["studentBatch"]} Batch |{" "}
                                        {studentData["studentGender"]}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl text-center mb-2 my-16 sm:my-32 px-4">
                                Placements
                            </h1>
                            <div className="relative mx-4 sm:mx-6 my-4 sm:my-8 py-2 flex flex-wrap justify-center gap-3 sm:gap-4 items-center md:mx-16">
                                {studentPlacements.length === 0 ? (
                                    <div className="border border-red-50 rounded-2xl mx-auto w-full sm:w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-red-200">
                                        <p className="p-6 sm:p-8 text-center text-sm sm:text-base text-red-900">
                                            No placements yet
                                        </p>
                                    </div>
                                ) : (
                                    studentPlacements.map(
                                        (placement, index) => {
                                            return (
                                                <StudentPlacementCard
                                                    cardType={"0"}
                                                    placementData={placement}
                                                    key={index}
                                                />
                                            );
                                        },
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            )}

            <Toast ref={toast} position="bottom-center" />
        </>
    );
}
