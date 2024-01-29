"use client";

import Image from "next/image";
import Link from "next/link";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

import { useEffect, useRef, useState } from "react";
import { STUDENT_EDIT_PROFILE_URL } from "@/util/constants";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";

export default function HandleEditData() {

    const [studentRollNo, setStudentRollNo] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentName, setStudentName] = useState("");

    // generate A -> Z store in sections array as {name: "A"}
    const sectionOptions = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" },
        { name: "F" },
        { name: "G" },
        { name: "H" },
    ];
    const [studentSection, setStudentSection] = useState("");

    const genderOptions = ["Male", "Female", "Other"]
    const [studentGender, setStudentGender] = useState("");
    const [studentBatch, setStudentBatch] = useState("");

    const [studentId, setStudentId] = useState("");
    const [accountStatus, setAccountStatus] = useState("");

    const [studentDept, setStudentDept] = useState("CSE");

    const higherStudiesOptions = ["Yes", "No"];
    const [isHigherStudies, setIsHigherStudies] = useState("");

    const [isPlaced, setIsPlaced] = useState("");
    const [CGPA, setCGPA] = useState("");   

    const [loading, setLoading] = useState(false);

    const toast = useRef(null);

    const batchRegex = new RegExp("^[0-9]{4}$");
    const nameRegex = new RegExp("^[a-zA-Z ]+$");
    const cgpaRegex = new RegExp("^[0-9]{1}.[0-9]{2}$");

    const isValidBatch = batchRegex.test(studentBatch);
    const isValidName = nameRegex.test(studentName);
    const isValidCGPA = cgpaRegex.test(CGPA);
    const isValidSection = studentSection !== "";
    const isValidGender = studentGender === "Male" || studentGender === "Female" || studentGender === "Other";
    const isValidHigherStudies = isHigherStudies === "Yes" || isHigherStudies === "No";
    const isValidPlaced = isPlaced !== "";

    const router = useRouter();

    useEffect(() => {
        let student = secureLocalStorage.getItem("currentStudent");

        //console.log("test",student);
        //console.log("test", student ? "true" : "false")

        if (student) {
            student = JSON.parse(student);
            setStudentId(student.studentId)
            setStudentEmail(student.studentEmail);
            setStudentName(student.studentName);
            setStudentRollNo(student.studentRollNo);
            setStudentSection(student.studentSection);
            setStudentGender(student.studentGender === "Male" ? "Male" : student.studentGender ==="Female" ? "Female" : student.studentGender === "Other" ? "Other" : student.studentGender === "M" ? "Male" : student.studentGender === "F" ? "Female" : "Other");
            setStudentBatch(student.studentBatch);
            setStudentDept(student.studentDept);
            setIsHigherStudies(student.isHigherStudies === "Yes" ? "Yes" : student.isHigherStudies ==="No" ? "No" :  student.isHigherStudies === "1" ? "Yes" : "No");
            setIsPlaced(student.isPlaced);
            setCGPA(student.CGPA);
            setAccountStatus(student.accountStatus);
            //console.log("test2",studentId,studentRollNo,studentEmail);
        }

    }, [router]);

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

    const handleEditData = async (e) => {
        e.preventDefault();
        // console.log({
        //     "studentRollNo": studentRollNo,
        //     "studentEmail": studentEmail,
        //     "studentName": studentName,
        //     "studentPassword": hashPassword(studentPassword),
        //     "studentSection": studentSection,
        //     "studentGender": studentGender === "Male" ? "M" : studentGender === "Female" ? "F" : "O",
        //     "studentBatch": studentBatch,
        //     "studentDept": studentDept,
        //     "isHigherStudies": isHigherStudies === "Yes" ? "1" : "0",
        //     "isPlaced": isPlaced,
        //     "CGPA": CGPA
        // });

        if (!isValid) {
            alertError("Invalid Details", "Please check all the fields and try again.");
            return;
        }

        setLoading(true);

        try {

            const req_data = {
                "studentRollNo": studentRollNo,
                "studentEmail": studentEmail,
                "studentName": studentName,
                "studentSection": studentSection,
                "studentDept": studentDept,
                "studentGender": studentGender === "Male" ? "M" : studentGender === "Female" ? "F" : "O",
                "studentBatch": studentBatch,
                "isHigherStudies": isHigherStudies === "Yes" ? "1" : "0",
                "CGPA": CGPA
            }
            const response = await fetch(STUDENT_EDIT_PROFILE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
                },
                body: JSON.stringify(req_data)
            });

            const data = await response.json();
            //console.log(data);

            if (response.status === 200) {

                alertSuccess('Profile Updated Successfully...');

                secureLocalStorage.removeItem("currentStudent");

                secureLocalStorage.setItem("currentStudent", JSON.stringify({
                    studentId: studentId,
                    studentName: studentName,
                    studentEmail: studentEmail,
                    studentRollNo: studentRollNo,
                    studentSection: studentSection,
                    studentGender: req_data.studentGender,
                    studentBatch: studentBatch,
                    studentDept: studentDept,
                    isHigherStudies: req_data.isHigherStudies,
                    isPlaced: isPlaced,
                    CGPA: CGPA,
                    accountStatus: accountStatus,
                }));

                setTimeout(() => {
                    router.push(`/dashboard/admin/student/${studentId}`);
                }, 1000);

            } else if (response.status === 500) {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            } else if (data.message !== undefined || data.message !== null) {
                alertError('Profile Update Failed', data.message);
            } else {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            }


        } catch (e) {
            console.log(e);
            setLoading(false);
            alertError("Oops!", "Something went wrong. Please try again.");
            return;
        }

        setLoading(false);
    };

    /*
    "studentRollNo": "CB.EN.U4CSE21001",
    "studentEmail": "cb.en.u4cse21001@cb.students.amrita.edu",
    "studentName": "Abhinav R",
    "studentPassword": "boomerkahukum",
    "studentSection": "A",
    "studentGender": "M",
    "studentBatch": "2025",
    "studentDept": "CSE",
    "isHigherStudies": "0",
    "isPlaced": "1",
    "CGPA": "9.12"
    */

    const isValid = isValidBatch && isValidName && isValidCGPA && isValidSection && isValidGender && isValidHigherStudies && isValidPlaced && studentDept === "CSE";

    return (
            <main className='flex h-full flex-1 flex-col justify-center'>
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/dashboard/admin"}>
                                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <Link href={`/dashboard/admin/student/${studentId}`} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 cursor-pointer">
                            <span className="material-icons">person</span>
                        </Link>
                    </nav>
                </header>

                <div
                    className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-2xl"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-10"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%, 45.2% 34.5%)',
                        }}
                    />
                </div>

                <div className="mt-32 border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50 mb-8">
                    <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                        <div className='flex align-middle flex-row justify-center text-xl p-4'>
                            <span className="material-icons mr-2 scale-100">edit</span>{"Edit Profile"}
                        </div>
                        <hr className='border-gray-300 w-full' />
                    </div>

                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8">
                        <form className="space-y-6" onSubmit={handleEditData}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Roll No
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="name"
                                        autoComplete="rollno"
                                        value={studentRollNo}
                                        disabled={true}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none uppercase ring-bGray"}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Email ID
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={studentEmail}
                                        disabled={true}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="name"
                                        autoComplete="rollno"
                                        placeholder='Enter your Full Name'
                                        value={studentName}
                                        onChange={(e) => {
                                            setStudentName(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidName && studentName ? ' ring-red-500' : isValidName && studentName ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Batch
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        placeholder='eg. 2025 (Year of Completion)'
                                        value={studentBatch}
                                        onChange={(e) => {
                                            setStudentBatch(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none normal-nums" +
                                            (!isValidBatch && studentBatch ? ' ring-red-500' : isValidBatch && studentBatch ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Gender</label>
                                <div className="mt-2">
                                    <SelectButton value={studentGender} onChange={(e) => {
                                        setStudentGender(e.value || '')
                                    }} options={genderOptions} required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Section</label>
                                <div className="mt-2">
                                    <Dropdown value={studentSection} onChange={(e) => setStudentSection(e.value || '')} options={sectionOptions} optionLabel="name" optionValue='name'
                                        placeholder="Select a section" className="w-full md:w-14rem" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Higher Studies ?</label>
                                <div className="mt-2">
                                    <SelectButton value={isHigherStudies} onChange={(e) => {
                                        setIsHigherStudies(e.value || '')
                                    }} options={higherStudiesOptions} required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    CGPA
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        step={0.01}
                                        value={parseFloat(CGPA)}
                                        placeholder='9.00'
                                        onChange={(e) => {
                                            setCGPA(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none normal-nums" +
                                            (!isValidCGPA && CGPA ? ' ring-red-500' : isValidCGPA && CGPA ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex">
                                <Link href={`/dashboard/admin/student/${studentId}`} className="bg-[#ffffff] border-gray-300 border text-gray-600 rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 cursor-pointer w-1/2">
                                    <p className="mx-auto">Cancel</p>
                                </Link>
                                <input
                                    value="Update Profile"
                                    type="submit"
                                    disabled={!isValid || loading}
                                    className={" ml-2 w-1/2 text-lg rounded-xl bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                            </div>
                        </form>
                    </div>
                </div>

                <Toast position="bottom-center" ref={toast} />
            </main>
    );
}