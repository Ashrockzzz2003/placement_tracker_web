"use client";

import { GET_STUDENT_PLACEMENTS_URL } from "@/util/constants";
import Aos from "aos";
import "aos/dist/aos.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import secureLocalStorage from "react-secure-storage";
import 'material-icons/iconfont/material-icons.css';
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

    const { studentId } = useParams();

    const [studentEmail, setStudentEmail] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentRollNo, setStudentRollNo] = useState('');
    //const [studentId, setStudentId] = useState('');
    const [studentSection, setStudentSection] = useState('');
    const [studentGender, setStudentGender] = useState('');
    const [studentBatch, setStudentBatch] = useState('');
    const [studentDept, setStudentDept] = useState('');
    const [isHigherStudies, setIsHigherStudies] = useState('');
    const [CGPA, setCGPA] = useState('');

    const [userAccess, setUserAccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [studentPlacements, setStudentPlacements] = useState([]);

    const toast = useRef(null);

    const router = useRouter();

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

    
    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));
        //let student = secureLocalStorage.getItem("currentUser");

        // if (student) {
        //     student = JSON.parse(student);

        //     setStudentEmail(student.studentEmail);
        //     setStudentName(student.studentName);
        //     setStudentRollNo(student.studentRollNo);
        //     setStudentId(student.studentId);
        //     setStudentSection(student.studentSection);
        //     setStudentGender(student.studentGender);
        //     setStudentBatch(student.studentBatch);
        //     setStudentDept(student.studentDept);
        //     setIsHigherStudies(student.isHigherStudies);
        //     setCGPA(student.CGPA);
        // }

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });

        fetch(GET_STUDENT_PLACEMENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
            },
            body: JSON.stringify({
                "studentId": parseInt(studentId),
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    secureLocalStorage.setItem("studentPlacements", JSON.stringify(data["placementData"]));
                    secureLocalStorage.setItem("currentStudent", JSON.stringify(data["student"]));
                    let student = data["student"];
                    //console.log("test",student);
                    setStudentEmail(student.studentEmail);
                    setStudentName(student.studentName);
                    setStudentRollNo(student.studentRollNo);
                    //setStudentId(student.studentId);
                    setStudentSection(student.studentSection);
                    setStudentGender(student.studentGender);
                    setStudentBatch(student.studentBatch);
                    setStudentDept(student.studentDept);
                    setIsHigherStudies(student.isHigherStudies);
                    setCGPA(student.CGPA);
                    setStudentPlacements(data["placementData"]);
                    //console.log("test",data["placementData"]);
                    //console.log("test",JSON.stringify(localStorage));
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
    }, [router]);


    return <>
        {isLoading || userAccess === null || userAccess === undefined || studentPlacements === null || studentPlacements === undefined ? (
            <LoadingScreen />
        ) : (
            <main>
                <div data-aos="fade-in">
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link className="hover:cursor-pointer" href={"/dashboard/admin"}>
                                    <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="flex lg:flex lg:flex-1 lg:justify-end">
                                <Link href={"/dashboard/admin/student"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 cursor-pointer">
                                <span className="material-icons">supervisor_account</span>
                                </Link>
                                <button onClick={
                                    () => {
                                        secureLocalStorage.removeItem("currentUser");
                                        secureLocalStorage.removeItem("userAccess");
                                        router.replace("/login");
                                    }
                                } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 ml-2">
                                    {"Logout"}
                                    <span className="material-icons ml-2">logout</span>
                                </button>
                            </div>
                        </nav>
                    </header>

                    <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                        <div
                            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
                            />
                        </div>

                        <div className="mx-auto max-w-2xl mt-12 py-8 lg:py-8">
                            {/* <div className="sm:mb-2 flex justify-center text-center">
                                <Link className="hover:cursor-pointer" href={"https://www.amrita.edu"} target='_blank'><div className="relative rounded-full px-3 py-1 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                    Student
                                </div></Link>
                            </div> */}
                            <div className="text-center">
                                <h1 className="text-lg tracking-tight text-gray-500 sm:text-6xl">
                                    {"Viewing As"}
                                </h1>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    {studentName}
                                </h1>
                                <p className="mt-4 text-lg leading-7 text-gray-500">
                                    {studentRollNo} | {studentDept} {studentSection} | {studentBatch} Batch 
                                </p>
                                <div className="hover:cursor-pointer w-fit ml-auto mr-auto">
                                    <Link href={`/dashboard/admin/student/${studentId}/editData`}>
                                        <div className="rounded-xl px-2 py-0.5 mt-2 items-center align-middle flex flex-row text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                            <span className="material-icons mr-0.5">edit</span> {"Edit Profile"}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="hover:cursor-pointer w-fit ml-auto mr-auto pt-10 pb-14">
                            <Link href={`/dashboard/admin/student/${studentId}/newPlacement`}>
                                <div className="bg-black text-white rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                    <span className="material-icons mr-2">add</span> {"Add Placement"}
                                </div>
                            </Link>
                        </div>

                        <h1 className="text-3xl text-center mb-2">Student Placements</h1>
                        <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                            {studentPlacements.length === 0 ? (
                                <div className='border border-red-50 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-red-200'>
                                    <p className="p-8 text-center text-red-900">No placements yet</p>
                                </div>
                            ) : (
                                studentPlacements.map((placement, index) => {
                                    return (
                                        <StudentPlacementCard placementData={placement} key={index} studentId={studentId} cardType={"1"}/>
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