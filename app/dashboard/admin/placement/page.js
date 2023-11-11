"use client";

import { GET_ALL_PLACEMENTS_URL, GET_COMPANY_LIST_URL } from "@/util/constants";
import Aos from "aos";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
import "aos/dist/aos.css";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from 'primereact/multiselect';
import Searchbar from "@/util/SearchBar";
import { Dialog, Transition } from "@headlessui/react";

export default function AllPlacedStudentsScreen() {
    const [allPlacedStudentData, setAllPlacedStudentData] = useState([]);
    const [allPlacedStudentDataFiltered, setAllPlacedStudentDataFiltered] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");
    const [sections, setSections] = useState();
    const [companyList, setCompanyList] = useState([]);

    const [tempTotalPlacements, setTempTotalPlacements] = useState(0);
    const [totalPlacements, setTotalPlacements] = useState(0);

    const [maxCTC, setMaxCTC] = useState(0);
    const [minCTC, setMinCTC] = useState(0);
    const [avgCTC, setAvgCTC] = useState(0);

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

        fetch(GET_ALL_PLACEMENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
            },
            body: JSON.stringify({
                "batch": new Date().getFullYear(),
                // "batch": "2022",
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    const sections = [];

                    const groupedData = data["placementData"].reduce((acc, obj) => {
                        const key = obj["studentId"];
                        if (!acc[key]) {
                            if (sections.length === 0 || sections[sections.length - 1].name !== obj["studentSection"]) {
                                sections.push({
                                    "name": obj["studentSection"],
                                });
                            }
                            acc[key] = {
                                "studentId": obj["studentId"],
                                "studentRollNo": obj["studentRollNo"],
                                "studentEmail": obj["studentEmail"],
                                "studentName": obj["studentName"],
                                "studentGender": obj["studentGender"],
                                "studentDept": obj["studentDept"],
                                "studentBatch": obj["studentBatch"],
                                "studentSection": obj["studentSection"],
                                "isHigherStudies": obj["isHigherStudies"],
                                "cgpa": obj["cgpa"],
                                "studentAccountStatus": obj["studentAccountStatus"],
                                "placements": [
                                    {
                                        "placementId": obj["placementId"],
                                        "companyId": obj["companyId"],
                                        "companyName": obj["companyName"],
                                        "ctc": obj["ctc"],
                                        "jobRole": obj["jobRole"],
                                        "jobLocation": obj["jobLocation"],
                                        "placementDate": obj["placementDate"],
                                        "isIntern": obj["isIntern"],
                                        "isPPO": obj["isPPO"],
                                        "isOnCampus": obj["isOnCampus"],
                                        "isGirlsDrive": obj["isGirlsDrive"],
                                        "extraData": obj["extraData"],
                                    }
                                ],
                            };
                        } else {
                            acc[key]["placements"].push({
                                "placementId": obj["placementId"],
                                "companyId": obj["companyId"],
                                "companyName": obj["companyName"],
                                "ctc": obj["ctc"],
                                "jobRole": obj["jobRole"],
                                "jobLocation": obj["jobLocation"],
                                "placementDate": obj["placementDate"],
                                "isIntern": obj["isIntern"],
                                "isPPO": obj["isPPO"],
                                "isOnCampus": obj["isOnCampus"],
                                "isGirlsDrive": obj["isGirlsDrive"],
                                "extraData": obj["extraData"],
                            });
                        }

                        // Sort Placements
                        acc[key]["placements"].sort((a, b) => {
                            return new Date(b["ctc"]) - new Date(a["ctc"]);
                        });
                        return acc;
                    }, {});

                    // Overall Sort by top placement
                    const sortedData = Object.values(groupedData).sort((a, b) => {
                        return new Date(b["placements"][0]["ctc"]) - new Date(a["placements"][0]["ctc"]);
                    });

                    // Total Placements
                    let total = 0;

                    Object.values(groupedData).forEach((student) => {
                        total += student["placements"].length;
                    });

                    setTotalPlacements(total);
                    setSections(sections);
                    setAllPlacedStudentData(Object.values(sortedData));
                    setAllPlacedStudentDataFiltered(Object.values(sortedData));
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
        })

        fetch(GET_COMPANY_LIST_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setCompanyList(data["companies"]);
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
        }).finally(() => {
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            alertError("Error", "Something went wrong. Please try again later.");
        });

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });

    }, [router]);


    const [searchText, setSearchText] = useState("");
    const [selectedSections, setSelectedSections] = useState(null);
    const [selectedCompanies, setSelectedCompanies] = useState(null);

    const isHigherStudiesOptions = ['Higher Studies', 'Not Higher Studies'];
    const [isHigherStudiesValue, setIsHigherStudiesValue] = useState('');
    const [isHigherStudies, setIsHigherStudies] = useState(null);

    const isInternOptions = ['Intern', 'Full-Time'];
    const [isInternValue, setIsInternValue] = useState('');
    const [isIntern, setIsIntern] = useState(null);

    const isPPOOptions = ['PPO', 'Normal'];
    const [isPPOValue, setIsPPOValue] = useState('');
    const [isPPO, setIsPPO] = useState(null);

    const isOnCampusOptions = ['On Campus', 'Off Campus'];
    const [isOnCampusValue, setIsOnCampusValue] = useState('');
    const [isOnCampus, setIsOnCampus] = useState(null);

    const isGirlsDriveOptions = ["Girls Drive", "Normal"];
    const [isGirlsDriveValue, setIsGirlsDriveValue] = useState('');
    const [isGirlsDrive, setIsGirlsDrive] = useState(null);

    const genderOptions = ["Male", "Female", "Other"];
    const [genderValue, setGenderValue] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        if (allPlacedStudentData.length && companyList.length) {
            setAllPlacedStudentDataFiltered(allPlacedStudentData.filter((student) => {
                return (
                    ((student["studentRollNo"].toUpperCase().includes(searchText.toUpperCase())) || (student["studentName"].toLowerCase().includes(searchText.toLowerCase()))) && (student["studentGender"] === gender || gender === '') &&
                    (selectedSections === null || selectedSections.length === 0 || selectedSections.includes(student["studentSection"])) &&
                    (selectedCompanies === null || selectedCompanies.length === 0 || student["placements"].some((placement) => {
                        return selectedCompanies.includes(placement["companyId"]);
                    })) &&
                    (isHigherStudies === null || isHigherStudies === '' || student["isHigherStudies"] === isHigherStudies) &&
                    (isIntern === null || isIntern === '' || student["placements"].some((placement) => {
                        return placement["isIntern"] === isIntern;
                    })) && (isPPO === null || isPPO === '' || student["placements"].some((placement) => {
                        return placement["isPPO"] === isPPO;
                    })) && (isOnCampus === null || isOnCampus === '' || student["placements"].some((placement) => {
                        return placement["isOnCampus"] === isOnCampus;
                    })) && (isGirlsDrive === null || isGirlsDrive === '' || student["placements"].some((placement) => {
                        return placement["isGirlsDrive"] === isGirlsDrive;
                    }))
                );
            }));
        }
    }, [searchText, selectedSections, selectedCompanies, isHigherStudies, isIntern, isPPO, isOnCampus, allPlacedStudentData, companyList, gender, isGirlsDrive]);

    useEffect(() => {
        // max, min, avg ctc
        let max = 0;
        let min = 0;
        let sum = 0;
        let total = 0;

        allPlacedStudentDataFiltered.forEach((student) => {
            student["placements"].forEach((placement) => {
                if (isIntern !== null && isIntern !== '' && placement["isIntern"] !== isIntern) {
                    return;
                }
                if (isPPO !== null && isPPO !== '' && placement["isPPO"] !== isPPO) {
                    return;
                }
                if (isOnCampus !== null && isOnCampus !== '' && placement["isOnCampus"] !== isOnCampus) {
                    return;
                }

                if (isGirlsDrive !== null && isGirlsDrive !== '' && placement["isGirlsDrive"] !== isGirlsDrive) {
                    return;
                }

                if (selectedCompanies !== null && selectedCompanies.length !== 0 && !selectedCompanies.includes(placement["companyId"])) {
                    return;
                }

                if (isHigherStudies !== null && isHigherStudies !== '' && student["isHigherStudies"] !== isHigherStudies) {
                    return;
                }

                if (placement["ctc"] > max) {
                    max = placement["ctc"];
                }
                if (placement["ctc"] !== 0 && (placement["ctc"] < min || min === 0)) {
                    min = placement["ctc"];
                }

                total++;
                sum += placement["ctc"];
            });
        });

        setTempTotalPlacements(total);
        setMaxCTC(max);
        setMinCTC(min);
        setAvgCTC((sum / allPlacedStudentDataFiltered.length).toFixed(2));
    }, [allPlacedStudentDataFiltered, isIntern, isPPO, isOnCampus, isGirlsDrive, selectedCompanies, totalPlacements, isHigherStudies]);


    const [studentBatch, setStudentBatch] = useState(new Date().getFullYear());
    const [currentBatch, setCurrentBatch] = useState(studentBatch);
    const batchRegex = new RegExp("^[0-9]{4}$");
    const isValidBatch = batchRegex.test(studentBatch) && parseInt(studentBatch) >= 2018 && parseInt(studentBatch) <= new Date().getFullYear() + 2 && studentBatch !== currentBatch;

    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true);
    }

    const getBatchData = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        if (!isValidBatch) {
            alertError("Invalid Batch", "Please enter a valid batch.");
            setIsLoading(false);
            return;
        }

        fetch(GET_ALL_PLACEMENTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
            },
            body: JSON.stringify({
                "batch": studentBatch,
                // "batch": "2022",
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    const sections = [];

                    const groupedData = data["placementData"].reduce((acc, obj) => {
                        const key = obj["studentId"];
                        if (!acc[key]) {
                            if (sections.length === 0 || sections[sections.length - 1].name !== obj["studentSection"]) {
                                sections.push({
                                    "name": obj["studentSection"],
                                });
                            }
                            acc[key] = {
                                "studentId": obj["studentId"],
                                "studentRollNo": obj["studentRollNo"],
                                "studentEmail": obj["studentEmail"],
                                "studentName": obj["studentName"],
                                "studentGender": obj["studentGender"],
                                "studentDept": obj["studentDept"],
                                "studentBatch": obj["studentBatch"],
                                "studentSection": obj["studentSection"],
                                "isHigherStudies": obj["isHigherStudies"],
                                "cgpa": obj["cgpa"],
                                "studentAccountStatus": obj["studentAccountStatus"],
                                "placements": [
                                    {
                                        "placementId": obj["placementId"],
                                        "companyId": obj["companyId"],
                                        "companyName": obj["companyName"],
                                        "ctc": obj["ctc"],
                                        "jobRole": obj["jobRole"],
                                        "jobLocation": obj["jobLocation"],
                                        "placementDate": obj["placementDate"],
                                        "isIntern": obj["isIntern"],
                                        "isPPO": obj["isPPO"],
                                        "isOnCampus": obj["isOnCampus"],
                                        "isGirlsDrive": obj["isGirlsDrive"],
                                        "extraData": obj["extraData"],
                                    }
                                ],
                            };
                        } else {
                            acc[key]["placements"].push({
                                "placementId": obj["placementId"],
                                "companyId": obj["companyId"],
                                "companyName": obj["companyName"],
                                "ctc": obj["ctc"],
                                "jobRole": obj["jobRole"],
                                "jobLocation": obj["jobLocation"],
                                "placementDate": obj["placementDate"],
                                "isIntern": obj["isIntern"],
                                "isPPO": obj["isPPO"],
                                "isOnCampus": obj["isOnCampus"],
                                "isGirlsDrive": obj["isGirlsDrive"],
                                "extraData": obj["extraData"],
                            });
                        }

                        // Sort Placements
                        acc[key]["placements"].sort((a, b) => {
                            return new Date(b["ctc"]) - new Date(a["ctc"]);
                        });

                        return acc;
                    }, {});

                    // Overall Sort by top placement
                    const sortedData = Object.values(groupedData).sort((a, b) => {
                        return new Date(b["placements"][0]["ctc"]) - new Date(a["placements"][0]["ctc"]);
                    });

                    // Total Placements
                    let total = 0;

                    Object.values(groupedData).forEach((student) => {
                        total += student["placements"].length;
                    });

                    setTotalPlacements(total);

                    setSections(sections);
                    setAllPlacedStudentData(Object.values(sortedData));
                    setAllPlacedStudentDataFiltered(Object.values(sortedData));

                    setSearchText("");
                    setSelectedSections(null);
                    setSelectedCompanies(null);
                    setIsHigherStudiesValue('');
                    setIsHigherStudies(null);
                    setIsInternValue('');
                    setIsIntern(null);
                    setIsPPOValue('');
                    setIsPPO(null);
                    setIsOnCampusValue('');
                    setIsOnCampus(null);
                    setGenderValue('');
                    setGender('');
                    setIsGirlsDriveValue('');
                    setIsGirlsDrive('');
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
            if (err.status !== 400) {
                console.log(err);
                alertError("Error", "Something went wrong. Please try again later.");
            }
        }).finally(() => {
            setCurrentBatch(studentBatch);
            setStudentBatch(studentBatch);
            setIsLoading(false);
        })
    }

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <main className="mb-16" data-aos="fade-in">
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/dashboard/admin"}>
                                    <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="flex lg:flex lg:flex-1 lg:justify-end">
                                <Link href={"/dashboard/admin"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
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
                            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
                            />
                        </div>

                        <div className="mx-auto max-w-2xl pt-16 lg:pt-24 ">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {"Placements | " + studentBatch + " Batch"}
                                </h1>
                                <br />
                                <input
                                    value={"Search For a different Batch"}
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    onClick={openModal}
                                />
                            </div>
                        </div>

                        <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray my-8">
                            <h1 className="text-xl font-bold text-center p-2">Power Search</h1>

                            <hr className="w-full border-bGray" />

                            <Searchbar onChange={
                                (value) => setSearchText(value)
                            } placeholderText={"Student Name or Roll Number"} />

                            <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row">
                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <SelectButton value={genderValue} onChange={(e) => {
                                        setGender((e.value === null || e.value === '') ? '' : e.value[0])
                                        setGenderValue(e.value || '')
                                    }} options={genderOptions} />
                                </div>

                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <MultiSelect value={selectedSections} onChange={
                                        (e) => {
                                            setSelectedSections(e.value);
                                        }
                                    } options={sections} optionLabel="name" optionValue="name" display="chip"
                                        showClear={true}
                                        placeholder="Select Sections" maxSelectedLabels={2} className="w-full md:w-20rem" />
                                </div>

                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <MultiSelect value={selectedCompanies} onChange={
                                        (e) => {
                                            setSelectedCompanies(e.value);
                                        }
                                    } options={companyList} filter filterPlaceholder="Enter Company Name" optionLabel="companyName" optionValue="id" display="chip"
                                        showClear={true}
                                        placeholder="Select Companies" maxSelectedLabels={2} className="w-full md:w-20rem" />
                                </div>

                                <div className="p-4">
                                    <SelectButton value={isInternValue} onChange={(e) => {
                                        setIsInternValue(e.value)
                                        setIsIntern(e.value === "Intern" ? "1" : e.value === "Full-Time" ? "0" : null)
                                    }} options={isInternOptions} />
                                </div>
                            </div>
                            <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row">
                                <div className="p-4">
                                    <SelectButton value={isHigherStudiesValue} onChange={(e) => {
                                        setIsHigherStudiesValue(e.value)
                                        setIsHigherStudies(e.value === "Higher Studies" ? "1" : e.value === "Not Higher Studies" ? "0" : null)
                                    }} options={isHigherStudiesOptions} />
                                </div>

                                <div className="p-4">
                                    <SelectButton value={isPPOValue} onChange={(e) => {
                                        setIsPPOValue(e.value)
                                        setIsPPO(e.value === "PPO" ? "1" : e.value === "Normal" ? "0" : null)
                                    }} options={isPPOOptions} />
                                </div>


                                <div className="p-4">
                                    <SelectButton value={isOnCampusValue} onChange={(e) => {
                                        setIsOnCampusValue(e.value)
                                        setIsOnCampus(e.value === "On Campus" ? "1" : e.value === "Off Campus" ? "0" : null)
                                    }} options={isOnCampusOptions} />
                                </div>

                                <div className="p-4">
                                    <SelectButton value={isGirlsDriveValue} onChange={(e) => {
                                        setIsGirlsDriveValue(e.value)
                                        setIsGirlsDrive(e.value === "Girls Drive" ? "1" : e.value === "Normal" ? "0" : null)
                                    }} options={isGirlsDriveOptions} />
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-wrap justify-center items-center mb-8">
                            <div className="border-t border-l border-b rounded-l-2xl">
                                <div className="text-center">
                                    <h1 className="text-xl font-semibold text-center p-4">Max CTC</h1>
                                    <hr className="w-full" />
                                    <h1 className="text-lg font-light text-center p-3">{maxCTC} {" LPA"}</h1>
                                </div>
                            </div>

                            <div className="border">
                                <div className="text-center">
                                    <h1 className="text-xl font-semibold text-center p-4">Avg CTC</h1>
                                    <hr className="w-full" />
                                    <h1 className="text-lg font-light text-center p-3">{avgCTC} {" LPA"}</h1>
                                </div>
                            </div>

                            <div className="border-t border-r border-b rounded-r-2xl">
                                <div className="text-center">
                                    <h1 className="text-xl font-semibold text-center p-4">Min CTC</h1>
                                    <hr className="w-full" />
                                    <h1 className="text-lg font-light text-center p-3">{minCTC} {" LPA"}</h1>
                                </div>
                            </div>

                            <div className="border mx-4 rounded-xl flex flex-wrap justify-center items-center">
                                <div className="text-center">
                                    <h1 className="text-xl font-semibold text-center p-4">Students</h1>
                                    <hr className="w-full" />
                                    <div className="p-1">
                                        <h1 className="text-lg font-light text-center">{allPlacedStudentDataFiltered.length} {" / "} {allPlacedStudentData.length}</h1>
                                        <p className="text-xs font-light text-center text-gray-500">{(allPlacedStudentDataFiltered.length / allPlacedStudentData.length * 100).toFixed(2)} {"%"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-xl flex flex-wrap justify-center items-center">
                                <div className="text-center">
                                    <h1 className="text-xl font-semibold text-center p-4">Offers</h1>
                                    <hr className="w-full" />
                                    <div className="p-1">
                                        <h1 className="text-lg font-light text-center">{tempTotalPlacements} {" / "} {totalPlacements}</h1>
                                        <p className="text-xs font-light text-center text-gray-500">{(tempTotalPlacements / totalPlacements * 100).toFixed(2)} {"%"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                            <thead className="border-0 text-lg font-medium">
                                <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                    <th className="px-2 py-1 rounded-tl-2xl border-black" rowSpan={2}>Roll Number</th>
                                    <th className="px-2 py-1 border-black" rowSpan={2}>Student Name</th>
                                    <th className="px-2 py-1 border-black" rowSpan={2}>Gender</th>
                                    <th className="px-2 py-1 border-black" rowSpan={2}>Class</th>
                                    <th className="px-2 py-1 border-black" rowSpan={2}>CGPA</th>
                                    <th className="px-2 py-1 border-b-black rounded-tr-2xl" rowSpan={1} colSpan={4}>Placements</th>
                                </tr>
                                <tr className="bg-black text-white bg-opacity-90">
                                    <th className="px-2 py-1 border-black">Company</th>
                                    <th className="px-2 py-1 border-black">CTC</th>
                                    <th className="px-2 py-1 border-black">Location</th>
                                    <th className="px-2 py-1 border-black">Quick Facts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPlacedStudentDataFiltered.length === 0 ? (
                                    <tr>
                                        <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={10}>No Data Found</td>
                                    </tr>
                                ) : (
                                    allPlacedStudentDataFiltered.map((student, index) => {
                                        return [
                                            (<tr key={index}>

                                                <td className={"border border-gray-200 px-2 py-1" + (index === allPlacedStudentDataFiltered.length - 1 ? "border-separate rounded-bl-2xl" : "")} rowSpan={student["placements"].length + 1}>{student["studentRollNo"]}</td>
                                                <td className="border border-gray-200 px-2 py-1" rowSpan={student["placements"].length + 1}>{student["studentName"]}</td>
                                                <td className="border border-gray-200 px-2 py-1" rowSpan={student["placements"].length + 1}>{student["studentGender"]}</td>
                                                <td className="border border-gray-200 px-2 py-1" rowSpan={student["placements"].length + 1}>{student["studentDept"]} {" "} {student["studentSection"]}</td>
                                                <td className="border border-gray-200 px-2 py-1" rowSpan={student["placements"].length + 1}>{student["cgpa"] ?? "-"}</td>
                                            </tr>),
                                            student["placements"].map((placement, pindex) => {
                                                return (
                                                    <tr key={pindex}>
                                                        <td className="border border-gray-200 px-0.5 py-1 text-center">
                                                            <Link href={`/dashboard/admin/company/${placement['companyId']}`}>{placement["companyName"]}</Link>
                                                            {placement["jobRole"] !== "-" ? (
                                                                <p className="text-xs text-gray-500">{placement["jobRole"]}</p>
                                                            ) : null}
                                                        </td>
                                                        <td className="border border-gray-200 px-2 py-1">{placement["ctc"] + " LPA"}</td>
                                                        <td className="border border-gray-200 px-2 py-1">{placement["jobLocation"] ?? "-"}</td>
                                                        <td className={"border border-gray-200 px-2 py-1" + (index === allPlacedStudentDataFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                            <div className="flex flex-wrap">
                                                                {placement["isIntern"] === "1" ? (
                                                                    <div className="bg-yellow-100 rounded-xl p-2 m-1 text-[#544a15]">Intern</div>
                                                                ) : null}
                                                                {placement["isPPO"] === "1" ? (
                                                                    <div className="bg-green-100 rounded-xl p-2 m-1 text-[#21430e]">PPO</div>
                                                                ) : null}
                                                                {placement["isOnCampus"] === '1' ? (
                                                                    <div className="bg-purple-100 rounded-xl p-2 m-1 text-[#1d0e3a]">On Campus</div>
                                                                ) : (
                                                                    <div className="bg-red-100 rounded-xl p-2 m-1 text-[#320f0f]">Off Campus</div>
                                                                )}
                                                                {placement["isGirlsDrive"] === '1' ? (
                                                                    <div className="bg-pink-100 rounded-xl p-2 m-1 text-[#461348]">Girls Drive</div>
                                                                ) : (
                                                                    null
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ];

                                    })
                                )}
                            </tbody>
                        </table>
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
                                            <form onSubmit={getBatchData}>
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
    )
}