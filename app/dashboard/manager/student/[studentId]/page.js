"use client";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
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
            severity: 'error',
            summary: summary,
            detail: detail,
        });
    };

    const alertSuccess = (summary, detail) => {
        toast.current.show({
            severity: 'success',
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
                "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
            },
            body: JSON.stringify({
                "studentId": studentId
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setStudentData(data["student"]);
                    setStudentPlacements(data["placementData"]);
                });
            } else if (res.status === 401) {
                secureLocalStorage.clear();
                alertError("Session Expired", "Please login again to continue.");
                setTimeout(() => {
                    router.replace("/login");
                }, 3000);
            } else {
                alertError("Error", "Something went wrong. Please try again later.");
            }
        }).catch((err) => {
            alertError("Error", "Something went wrong. Please try again later.");
        }).finally(() => {
            setIsLoading(false);
        });

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });
    });

    return <>
        {isLoading || studentPlacements === null || studentPlacements === undefined || studentData === null || studentData === undefined ? (
            <LoadingScreen />
        ) : (
            <main>
                <div data-aos="fade-in">
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/dashboard/manager"}>
                                    <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="flex lg:flex lg:flex-1 lg:justify-end">
                                <Link href={"/dashboard/manager/student"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b]">
                                    <span className="material-icons mr-2">badge</span> {"All Students"}
                                </Link>
                                <Link href={"/dashboard/manager"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ml-2">
                                    <span className="material-icons">home</span>
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                        <div
                            className="absolute inset-x-0 px-40 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
                            />
                        </div>

                        <div className="mx-auto max-w-2xl pt-16 lg:pt-24 pb-8 mt-16">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {studentData["studentName"]}
                                </h1>
                                <p className="mt-4 text-lg leading-7 text-gray-500">
                                    {studentData["studentRollNo"]} | {studentData["studentDept"]} {studentData["studentSection"]} | {studentData["studentBatch"]} Batch | {studentData["studentGender"]}
                                </p>
                            </div>
                        </div>

                        <h1 className="text-3xl text-center mb-2 my-32"> Placements</h1>
                        <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                            {studentPlacements.length === 0 ? (
                                <div className='border border-red-50 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-red-200'>
                                    <p className="p-8 text-center text-red-900">No placements yet</p>
                                </div>
                            ) : (
                                studentPlacements.map((placement, index) => {
                                    return (
                                        <StudentPlacementCard cardType={"0"} placementData={placement} key={index} />
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        )}

        <Toast ref={toast} position="bottom-center" />
    </>

}