"use client";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
import "aos/dist/aos.css";
import { useParams, useRouter } from "next/navigation";
import { GET_COMPANY_HIRE_DATA_URL } from "@/util/constants";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { Toast } from "primereact/toast";
import { Dialog, Transition } from "@headlessui/react";
import { Chart } from 'primereact/chart';


export default function CompanyPage() {
    const [allHiredStudents, setAllHiredStudents] = useState([]);
    const [deptSectionWiseHiredStudents, setDeptSectionWiseHiredStudents] = useState([]);
    const [sortedDeptSectionWiseHiredStudents, setSortedDeptSectionWiseHiredStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState({});

    const [companyName, setCompanyName] = useState("");
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

    const { companyId } = useParams();

    const basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };


    

    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));

        if (secureLocalStorage.getItem("userAccess") === null || secureLocalStorage.getItem("userAccess") === undefined) {
            secureLocalStorage.clear();
            alertError("Session Expired", "Please login again to continue.");
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        } else {
            fetch(GET_COMPANY_HIRE_DATA_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
                },
                method: "POST",
                body: JSON.stringify({
                    companyId: companyId.toString(),
                    studentBatch: "",
                })
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setCompanyName(data.companyName);
                        setAllHiredStudents(data.allHiredStudents);
                        setDeptSectionWiseHiredStudents(data.deptSectionWiseHires);
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
                console.log(err);
                alertError("Error", "Something went wrong. Please try again later.");
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [companyId, router]);


    const [studentBatch, setStudentBatch] = useState("");
    const [currentBatch, setCurrentBatch] = useState(studentBatch);
    const batchRegex = new RegExp("^[0-9]{4}$");
    const isValidBatch =  (batchRegex.test(studentBatch) && parseInt(studentBatch) >= 2018 && parseInt(studentBatch) <= new Date().getFullYear() + 2 && studentBatch !== currentBatch);

    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true);
    }

    useEffect(() => {
        const tempArray = [...deptSectionWiseHiredStudents];
        tempArray.sort((a, b) => a.studentSection.localeCompare(b.studentSection));
        setSortedDeptSectionWiseHiredStudents(tempArray);
      }, [deptSectionWiseHiredStudents]);

    const getBatchData = (e, mode) => {
        setIsLoading(true);
        e.preventDefault();

        if (!isValidBatch && mode === "0") {
            alertError("Invalid Batch", "Please enter a valid batch.");
            setIsLoading(false);
            return;
        }

        if (mode === "1") {
            setStudentBatch("");
            setCurrentBatch("");
        }

        fetch(GET_COMPANY_HIRE_DATA_URL, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
            },
            method: "POST",
            body: JSON.stringify({
                companyId: companyId.toString(),
                studentBatch: mode === "0" ? studentBatch : "",
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setCompanyName(data.companyName);
                    setAllHiredStudents(data.allHiredStudents);
                    setDeptSectionWiseHiredStudents(data.deptSectionWiseHires);
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
            console.log(err);
            alertError("Error", "Something went wrong. Please try again later.");
        }).finally(() => {
            setIsLoading(false);
        });
    }


    return <>
        {isLoading ? <LoadingScreen /> : (
            <main className="mb-16" data-aos="fade-in">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/dashboard/admin"}>
                                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <div className="flex lg:flex lg:flex-1 lg:justify-end">
                            <Link href={"/dashboard/admin/company"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b]">
                                <span className="material-icons">apartment</span>
                            </Link>
                            <Link href={"/dashboard/admin"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ml-2">
                                <span className="material-icons">home</span>
                            </Link>
                            <button onClick={
                                () => {
                                    secureLocalStorage.removeItem("currentUser");
                                    secureLocalStorage.removeItem("userAccess");
                                    router.replace("/login");
                                }
                            } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ml-2">
                                {"Logout"}
                                <span className="material-icons ml-2">logout</span>
                            </button>
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

                    <div className="mx-auto max-w-2xl pt-16 lg:pt-24 pb-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {companyName + (studentBatch !== "" ? " - " + studentBatch : "")}
                            </h1>

                            <br />
                            
                            <div className="flex flex-wrap space-x-2 justify-center items-center">
                            <input
                                value={"Search For a Batch"}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={openModal}
                            />
                            
                            <input
                                value={"All Time"}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={(e) => {
                                    getBatchData(e, "1");
                                }}
                            />
                            </div>
                        </div>
                    </div>

                    {/*
                    {
                        "message": "Placement Data Fetched for CISCO !",
                        "companyName": "CISCO ",
                        "deptSectionWiseHires": [
                            {
                                "studentDept": "CSE",
                                "studentSection": "B",
                                "totalHires": 1
                            }
                        ],
                        "allHiredStudents": [
                            {
                                "studentRollNo": "CB.EN.U4CSE18107",
                                "studentEmail": "cb.en.u4cse18107@cb.students.amrita.edu",
                                "studentName": "ANKITHA",
                                "studentGender": "F",
                                "studentBatch": "2022",
                                "studentDept": "CSE",
                                "isHigherStudies": "0",
                                "isPlaced": "1",
                                "CGPA": null,
                                "ctc": 14.95,
                                "jobRole": "SE",
                                "jobLocation": null,
                                "placementDate": "2021-05-15T18:30:00.000Z",
                                "isIntern": "0",
                                "isPPO": "0",
                                "isOnCampus": "1",
                                "isGirlsDrive": "0",
                                "extraData": null
                            }
                        ]
                    }
                    */}

                    {allHiredStudents.length === 0 ? (
                        <div className='border border-red-50 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-red-200'>
                            <p className="p-8 text-center text-red-900">No hires yet</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl text-center mb-2">Section Wise Hires</h1>
                            <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                                    {sortedDeptSectionWiseHiredStudents.map((deptSectionWiseHire, index) => {
                                        return <div key={index} className="flex flex-col rounded-xl backdrop-blur-xl bg-green-100 text-[#21430e] shadow-lg">
                                            <span className="text-center p-2">{deptSectionWiseHire.studentDept} {deptSectionWiseHire.studentSection}</span>
                                            <hr className="border-[#21430e] w-full" />
                                            <span className="text-center p-2">{deptSectionWiseHire.totalHires}</span>
                                        </div>
                                    })}
                            </div>

                            <div className="flex flex-wrap justify-center items-center mx-auto mb-8"> 
                                <Chart type="bar" 
                                data={{
                                    labels: sortedDeptSectionWiseHiredStudents.map(student => student.studentDept + " " + student.studentSection),
                                    datasets: [
                                        {
                                            label: 'No. of Hires',
                                            backgroundColor: '#42A5F5',
                                            data: sortedDeptSectionWiseHiredStudents.map(student => student.totalHires)
                                        }
                                    ]
                                }} 
                                options={basicOptions} 
                                style={{width: '50%' }}/>
                            </div>

                            <h1 className="text-3xl text-center mb-2">All Hires</h1>
                            <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                                <thead className="border-0 text-lg font-medium">
                                    <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                        <th className="px-2 py-1 rounded-tl-2xl border-black">Roll Number</th>
                                        <th className="px-2 py-1 border-black">Student Name</th>
                                        <th className="px-2 py-1 border-black">Gender</th>
                                        <th className="px-2 py-1 border-black">Department</th>
                                        <th className="px-2 py-1 border-black">Section</th>
                                        <th className="px-2 py-1 border-black">CGPA</th>
                                        <th className="px-2 py-1 border-black">Batch</th>
                                        <th className="px-2 py-1 border-black">Future</th>
                                        <th className="px-2 py-1 border-black">Role</th>
                                        <th className="px-2 py-1 border-black">CTC</th>
                                        <th className="px-2 py-1 border-black">Location</th>
                                        <th className="px-2 py-1 border-black rounded-tr-2xl">Quick Facts</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {allHiredStudents.map((student, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className={"border border-gray-200 px-2 py-1" + (index === allHiredStudents.length - 1 ? "border-separate rounded-bl-2xl" : "")}>{student["studentRollNo"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["studentName"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["studentGender"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["studentDept"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["studentSection"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["cgpa"] ?? "-"}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["studentBatch"]}</td>
                                                <td className="border border-gray-200 py-4">
                                                    {student["isHigherStudies"] === '1' ? (
                                                        <span className="bg-blue-100 rounded-xl p-2 w-fit text-[#0e1d3a]">Higher Studies</span>
                                                    ) : (
                                                        <span className="bg-red-100 rounded-xl p-2 text-[#320f0f] w-fit">Placement</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-2 py-1">{student["jobRole"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["ctc"]}</td>
                                                <td className="border border-gray-200 px-2 py-1">{student["jobLocation"] ?? "-"}</td>
                                                <td className={"border border-gray-200 px-2 py-1" + (index === allHiredStudents.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                    <div className="flex flex-wrap">
                                                        {student["isIntern"] === "1" ? (
                                                            <div className="bg-yellow-100 rounded-xl p-2 m-1 text-[#544a15]">Intern</div>
                                                        ) : null}
                                                        {student["isPPO"] === "1" ? (
                                                            <div className="bg-green-100 rounded-xl p-2 m-1 text-[#21430e]">PPO</div>
                                                        ) : null}
                                                        {student["isOnCampus"] === '1' ? (
                                                            <div className="bg-purple-100 rounded-xl p-2 m-1 text-[#1d0e3a]">On Campus</div>
                                                        ) : (
                                                            <div className="bg-red-100 rounded-xl p-2 m-1 text-[#320f0f]">Off Campus</div>
                                                        )}
                                                        {student["isGirlsDrive"] === '1' ? (
                                                            <div className="bg-pink-100 rounded-xl p-2 m-1 text-[#461348]">Girls Drive</div>
                                                        ) : (
                                                            null
                                                        )}
                                                        {student["isHigherStudies"] === '1' ? (
                                                            <div className="bg-blue-100 rounded-xl p-2 m-1 text-[#0e1d3a]">Higher Studies</div>
                                                        ) : (
                                                            null
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Student Batch
                                        </Dialog.Title>
                                        <form onSubmit={(e) => {
                                            getBatchData(e, "0");
                                        }}>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Please enter the new batch (year of completion).
                                                </p>
                                                <div className="space-y-6">
                                                    <div>
                                                        <div className="mt-2">
                                                            <input
                                                                type="number"
                                                                value={studentBatch}
                                                                placeholder='eg. 2025 (Year of Completion)'
                                                                onChange={(e) => {
                                                                    setStudentBatch(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none normal-nums" +
                                                                    (!isValidBatch && studentBatch ? ' ring-red-500' : isValidBatch && studentBatch ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <input
                                                    value={"Search"}
                                                    type="submit"
                                                    disabled={!isValidBatch}
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    onClick={closeModal}
                                                />
                                            </div>
                                        </form>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </main>
        )}

        <Toast ref={toast} position="bottom-center" />
    </>
}