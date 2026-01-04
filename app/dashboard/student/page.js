"use client";

import { GET_STUDENT_PLACEMENTS_URL } from "@/util/constants";
import Aos from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "material-icons/iconfont/material-icons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import StudentPlacementCard from "@/util/StudentPlacementCard";
import { Toast } from "primereact/toast";

export default function StudentDashboard() {
    /*
    "studentEmail": student[0].studentEmail,
                    "studentName": student[0].studentName,
                    "studentRollNo": student[0].studentRollNo,
                    "studentId": student[0].id,
                    "studentSection": student[0].studentSection,
                    "studentGender": student[0].studentGender,
                    "studentBatch": student[0].studentBatch,
                    "studentDept": student[0].studentDept,
                    "isHigherStudies": student[0].isHigherStudies,
                    "CGPA": student[0].CGPA
    */

    const [_studentEmail, setStudentEmail] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentRollNo, setStudentRollNo] = useState("");
    const [_studentId, setStudentId] = useState("");
    const [studentSection, setStudentSection] = useState("");
    const [_studentGender, setStudentGender] = useState("");
    const [studentBatch, setStudentBatch] = useState("");
    const [studentDept, setStudentDept] = useState("");
    const [_isHigherStudies, setIsHigherStudies] = useState("");
    const [_CGPA, setCGPA] = useState("");

    const [userAccess, setUserAccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [studentPlacements, setStudentPlacements] = useState([]);

    const toast = useRef(null);

    const router = useRouter();

    const alertError = (summary, detail) => {
        toast.current.show({
            severity: "error",
            summary: summary,
            detail: detail,
        });
    };

    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));
        let student = secureLocalStorage.getItem("currentUser");

        if (student) {
            student = JSON.parse(student);

            setStudentEmail(student.studentEmail);
            setStudentName(student.studentName);
            setStudentRollNo(student.studentRollNo);
            setStudentId(student.studentId);
            setStudentSection(student.studentSection);
            setStudentGender(student.studentGender);
            setStudentBatch(student.studentBatch);
            setStudentDept(student.studentDept);
            setIsHigherStudies(student.isHigherStudies);
            setCGPA(student.CGPA);
        }

        Aos.init({
            duration: 500,
            once: true,
            easing: "ease-in-out",
            delay: 100,
        });

        fetch(GET_STUDENT_PLACEMENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("userAccess")}`,
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        secureLocalStorage.setItem(
                            "studentPlacements",
                            JSON.stringify(data["placementData"]),
                        );
                        setStudentPlacements(data["placementData"]);
                        //console.log("test",data["placementData"]);
                        //console.log("test",JSON.stringify(localStorage));
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
    }, [router]);

    return (
        <>
            {isLoading ||
            userAccess === null ||
            userAccess === undefined ||
            studentPlacements === null ||
            studentPlacements === undefined ? (
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
                                    <Link
                                        className="hover:cursor-pointer"
                                        href={"/dashboard/student"}
                                    >
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
                                        href={"/dashboard/student/profile"}
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 sm:p-3 min-w-[44px] min-h-[44px] items-center align-middle flex flex-row justify-center hover:bg-opacity-80 cursor-pointer"
                                    >
                                        <span className="material-icons text-lg sm:text-xl">
                                            person
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            secureLocalStorage.removeItem(
                                                "currentUser",
                                            );
                                            secureLocalStorage.removeItem(
                                                "userAccess",
                                            );
                                            router.replace("/login");
                                        }}
                                        className="bg-[#000000] text-[#ffffff] rounded-xl p-2 sm:p-3 min-h-[44px] items-center align-middle flex flex-row hover:bg-opacity-80 sm:ml-2 text-sm sm:text-base"
                                    >
                                        <span className="hidden sm:inline">Logout</span>
                                        <span className="material-icons sm:ml-2">logout</span>
                                    </button>
                                </div>
                            </nav>
                        </header>

                        <div className="relative isolate px-4 sm:px-6 lg:px-8 justify-center items-center m-auto pt-20 sm:pt-8">
                            <div
                                className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                                aria-hidden="true"
                            >
                                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[64%] -translate-x-1/2 rotate-[40deg] bg-linear-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
                            </div>

                            <div className="mx-auto max-w-2xl py-4 sm:py-8 lg:py-8">
                                <div className="sm:mb-2 flex justify-center text-center">
                                    <Link
                                        className="hover:cursor-pointer"
                                        href={"https://www.amrita.edu"}
                                        target="_blank"
                                    >
                                        <div className="relative rounded-full px-3 py-1 my-4 sm:my-8 text-xs sm:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                            Student
                                        </div>
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold tracking-tight text-gray-900">
                                        {"Welcome"}
                                    </h1>
                                    <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold tracking-tight text-gray-900 break-words">
                                        {studentName}
                                    </h1>
                                    <p className="mt-2 sm:mt-4 text-sm sm:text-lg leading-6 sm:leading-7 text-gray-500 px-4">
                                        {studentRollNo} | {studentDept}{" "}
                                        {studentSection} | {studentBatch} Batch
                                    </p>
                                    <div className="hover:cursor-pointer w-fit ml-auto mr-auto mt-3 sm:mt-2">
                                        <Link
                                            href={"/dashboard/student/editData"}
                                        >
                                            <div className="rounded-xl px-3 py-2 sm:px-2 sm:py-0.5 mt-2 items-center align-middle flex flex-row text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 min-h-[44px]">
                                                <span className="material-icons mr-1 sm:mr-0.5 text-sm sm:text-base">
                                                    edit
                                                </span>{" "}
                                                <span className="text-sm sm:text-base">{"Edit Profile"}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="hover:cursor-pointer w-fit ml-auto mr-auto pt-6 sm:pt-10 pb-8 sm:pb-14 px-4">
                                <Link href={"/dashboard/student/newPlacement"}>
                                    <div className="bg-black text-white rounded-xl p-3 sm:p-2 items-center align-middle flex flex-row hover:bg-opacity-80 min-h-[44px]">
                                        <span className="material-icons mr-2 text-lg sm:text-xl">
                                            add
                                        </span>{" "}
                                        <span className="text-sm sm:text-base">{"Add Placement"}</span>
                                    </div>
                                </Link>
                            </div>

                            <h1 className="text-2xl sm:text-3xl text-center mb-2 px-4">
                                My Placements
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
