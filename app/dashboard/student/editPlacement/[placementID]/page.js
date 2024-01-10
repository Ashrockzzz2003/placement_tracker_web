"use client";

import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { ADD_NEW_COMPANY_URL, STUDENT_EDIT_PLACEMENT_URL, GET_COMPANY_LIST_URL } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import 'material-icons/iconfont/material-icons.css';
import { Dropdown } from "primereact/dropdown";
import Aos from "aos";
import { Dialog, Transition } from "@headlessui/react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { SelectButton } from "primereact/selectbutton";

export default function NewPlacementScreen() {

    const router = useRouter();

    const { placementID } = useParams();
    const p = secureLocalStorage.getItem("studentPlacements");
    const placements = JSON.parse(p);
    var placement = {};
    if(placements === null || placements === undefined) {
        // placement.placementID = null;
        // placement.companyId = null;
        // placement.ctc = null;
        // placement.jobRole = null;
        // placement.jobLocation = null;
        // placement.placementDate = null;
        // placement.isIntern = null;
        // placement.isPPO = null;
        // placement.isOnCampus = null;
        // placement.isGirlsDrive = null;
        // placement.extraData = null;
        router.replace("/dashboard/student");
    }
    else{
        placement = placements.filter((p) => p.placementID === parseInt(placementID))[0];
    }

    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");
    let [isOpen, setIsOpen] = useState(false)

    /*
            "companyId":<companyId> INTEGER,
            "ctc":<ctc> FLOAT,
            "jobRole":"<jobRole>",
            "jobLocation":"<jobLocation>", //Optional
            "placementDate":"<placementDate>",
            "isIntern":"<0/1>",
            "isPPO":"<0/1>",
            "isOnCampus":"<0/1>",
            "isGirlsDrive":"<0/1>",
            "extraData":"<extraData>" //Optional
    */

    const [companyId, setCompanyId] = useState(placement.companyID);
    const [ctc, setCtc] = useState(placement.ctc);
    const [jobRole, setJobRole] = useState(placement.jobRole);
    const [jobLocation, setJobLocation] = useState(placement.jobLocation);
    const [placementDate, setPlacementDate] = useState(placement.placementDate.substring(0, 10));

    const internOptions = ["Yes", "No"];
    const [isIntern, setIsIntern] = useState(placement.isIntern === "1" ? "Yes" : "No");

    const ppoOptions = ["Yes", "No"];
    const [isPPO, setIsPPO] = useState(placement.isPPO === "1" ? "Yes" : "No");

    const onCampusOptions = ["Yes", "No"];
    const [isOnCampus, setIsOnCampus] = useState(placement.isOnCampus === "1" ? "Yes" : "No");

    const girlsDriveOptions = ["Yes", "No"];
    const [isGirlsDrive, setIsGirlsDrive] = useState(placement.isGirlsDrive === "1" ? "Yes" : "No");

    const [extraData, setExtraData] = useState(placement.extraData);

    //console.log(placement);

    // setCtc(placement.ctc);
    // setJobRole(placement.jobRole);
    // setJobLocation(placement.jobLocation);
    // setPlacementDate(placement.placementDate);
    // setIsIntern(placement.isIntern === 1 ? "Yes" : "No");
    // setIsPPO(placement.isPPO === 1 ? "Yes" : "No");
    // setIsOnCampus(placement.isOnCampus === 1 ? "Yes" : "No");
    // setIsGirlsDrive(placement.isGirlsDrive === 1 ? "Yes" : "No");
    // setExtraData(placement.extraData);


    // const rollNoRegex = new RegExp("^CB.EN.U4CSE[0-9]{5}$");
    // const isValidRollNo = rollNoRegex.test(studentRollNo);

    const ctcRegex = new RegExp("^[0-9]{1,2}(\\.[0-9]{1,2})?$");
    const isValidCtc = ctcRegex.test(ctc);

    const isValidJobRole = jobRole.length > 0;
    const isValidCompanyId = companyId !== null && companyId !== undefined;
    const isValidJobLocation = jobLocation.length > 0;
    const isValidPlacementDate = placementDate.length > 0;
    const isValidIntern = isIntern.length > 0 && (isIntern === "Yes" || isIntern === "No");
    const isValidPPO = isPPO.length > 0 && (isPPO === "Yes" || isPPO === "No");
    const isValidOnCampus = isOnCampus.length > 0 && (isOnCampus === "Yes" || isOnCampus === "No");
    const isValidGirlsDrive = isGirlsDrive.length > 0 && (isGirlsDrive === "Yes" || isGirlsDrive === "No");

    const isValidInput = isValidCtc && isValidJobRole && isValidCompanyId && isValidJobLocation && isValidPlacementDate && isValidIntern && isValidPPO && isValidOnCampus && isValidGirlsDrive;

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

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));

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
        })

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });

        setIsLoading(false);
    }, [router]);


    const handleEditPlacement = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        if (userAccess === null || userAccess === undefined) {
            alertError("Session Expired", "Please login again to continue.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
            return;
        }

        if (!isValidInput) {
            alertError("Error", "Please enter valid data.");
            return;
        }

        try {

            const req_data = {
                placementID: placementID.toString(),
                companyId: companyId.toString(),
                ctc: ctc,
                jobRole: jobRole,
                jobLocation: jobLocation,
                placementDate: placementDate,
                isIntern: isIntern === "Yes" ? "1" : "0",
                isPPO: isPPO === "Yes" ? "1" : "0",
                isOnCampus: isOnCampus === "Yes" ? '1' : '0',
                isGirlsDrive: isGirlsDrive === "Yes" ? '1' : '0',
                extraData: extraData,
            };
            const response = await fetch(STUDENT_EDIT_PLACEMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
                },
                body: JSON.stringify(req_data),
            });

            const data = await response.json();

            if (response.status === 200) {
                setIsLoading(true);
                alertSuccess("Success", "Placement Details Edited successfully.");

                //secureLocalStorage.removeItem("studentPlacements");
                // secureLocalStorage.setItem("studentPlacements", JSON.stringify({
                //     placementID: placementID.toString(),
                //     companyId: companyId.toString(),
                //     ctc: ctc,
                //     jobRole: jobRole,
                //     jobLocation: jobLocation,
                //     placementDate: placementDate,
                //     isIntern: req_data.isIntern,
                //     isPPO: req_data.isPPO,
                //     isOnCampus: req_data.isOnCampus,
                //     isGirlsDrive: req_data.isGirlsDrive,
                //     extraData: extraData,
                // }));

                setTimeout(() => {
                    router.replace("/dashboard/student");
                }, 2000);

            } else if (response.status === 401) {
                secureLocalStorage.clear();
                alertError("Session Expired", "Please login again to continue.");
                setTimeout(() => {
                    router.replace("/login");
                }, 3000);
            } else if (data["message"] !== undefined) {
                alertError("Error", data["message"]);
            } else {
                alertError("Error", "Something went wrong. Please try again later.");
            }
        } catch (err) {
            console.log(err);
            alertError("Error", "Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    const [companyName, setCompanyName] = useState("");
    const isValidCompanyName = companyName.length > 0;

    const addNewCompany = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (userAccess === null || userAccess === undefined) {
            alertError("Session Expired", "Please login again to continue.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        } else {
            if (!isValidCompanyName) {
                alertError("Error", "Please enter a valid company name.");
                return;
            }

            try {
                const response = await fetch(ADD_NEW_COMPANY_URL, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "companyName": companyName,
                    })
                });

                const data = await response.json();

                if (response.status === 200) {
                    //console.log(data);
                    if (data["companyId"] !== undefined && data["companyName"] !== undefined) {
                        companyList.push({
                            "id": data["companyId"],
                            "companyName": data["companyName"],
                        });
                        setCompanyList(companyList);
                        setCompanyName("");
                        setCompanyId(data["companyId"]);
                        alertSuccess("Success", "Company added successfully.");
                    } else {
                        // console.log(data["companyId"]);
                        // console.log(data["companyName"]);
                        alertError("Error", "Something went wrong. Please try again later.");
                    }
                } else if (response.status === 401) {
                    secureLocalStorage.clear();
                    alertError("Session Expired", "Please login again to continue.");
                    setTimeout(() => {
                        router.replace("/login");
                    }, 3000);
                } else if (data["message"] !== undefined) {
                    alertError("Error", data["message"]);
                } else {
                    alertError("Error", "Something went wrong. Please try again later.");
                }

                closeModal();
            } catch (err) {
                console.log(err);
                alertError("Error", "Something went wrong. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        return;
    }

    return <>
        {isLoading || companyList === undefined || companyList === null ? <LoadingScreen /> :
            <main>
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/dashboard/student"}>
                                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <div className="flex lg:flex lg:flex-1 lg:justify-end">
                            <Link href={"/dashboard/student"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons">home</span>
                            </Link>
                            {/* <button onClick={
                                () => {
                                    secureLocalStorage.removeItem("currentUser");
                                    secureLocalStorage.removeItem("userAccess");
                                    router.replace("/");
                                }
                            } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ml-2">
                                {"Logout"}
                                <span className="material-icons ml-2">logout</span>
                            </button> */}
                        </div>
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
                        <div className='flex flex-row justify-center'>
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Edit Placement</h1>
                        </div>
                        <hr className='border-gray-300 w-full' />
                    </div>

                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8">
                        <form className="space-y-6" onSubmit={handleEditPlacement}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Company</label>
                                <div className="mt-2">
                                    <Dropdown
                                        value={companyId} onChange={(e) => setCompanyId(e.value || '')} options={companyList} optionLabel="companyName" optionValue='id'
                                        placeholder="Select the company" className="w-full md:w-14rem" required
                                        filter={true}
                                    />
                                </div>
                            </div>

                            <p className="my-8 text-center text-md text-gray-500">
                                {"Can't find the company? "}
                                <button onClick={openModal} className="font-medium leading-6 text-blue-600 hover:underline">Add Company</button>
                            </p>

                            {/* <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Student Roll No
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="name"
                                        autoComplete="rollno"
                                        placeholder='CB.EN.U4CSEXXXXX'
                                        onChange={(e) => {
                                            setStudentRollNo(e.target.value.toUpperCase());
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none uppercase" +
                                            (!isValidRollNo && studentRollNo ? ' ring-red-500' : isValidRollNo && studentRollNo ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div> */}

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Role
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="name"
                                        autoComplete="rollno"
                                        placeholder='Enter the role (eg. SDE)'
                                        value={jobRole}
                                        onChange={(e) => {
                                            setJobRole(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidJobRole && jobRole ? ' ring-red-500' : isValidJobRole && jobRole ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Place/Location
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="name"
                                        autoComplete="rollno"
                                        placeholder='Enter the location (eg. Bengaluru)'
                                        value={jobLocation}
                                        onChange={(e) => {
                                            setJobLocation(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidJobLocation && jobLocation ? ' ring-red-500' : isValidJobLocation && jobLocation ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    CTC (LPA)
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        step={0.01}
                                        placeholder='45.00'
                                        value={ctc}
                                        onChange={(e) => {
                                            setCtc(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none normal-nums" +
                                            (!isValidCtc && ctc ? ' ring-red-500' : isValidCtc && ctc ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>


                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Placement Date (DD-MM-YYYY)
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        value={placementDate}
                                        onChange={(e) => {
                                            setPlacementDate(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-1 pt-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none normal-nums" +
                                            (!isValidPlacementDate && placementDate ? ' ring-red-500' : isValidPlacementDate && placementDate ? ' ring-green-500' : ' ring-bGray')}
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="w-full" />

                            <div className="flex flex-wrap justify-between">
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">Intership ?</label>
                                    <div className="mt-2">
                                        <SelectButton value={isIntern} onChange={(e) => {
                                            setIsIntern(e.value || '')
                                        }} options={internOptions} required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">PPO ?</label>
                                    <div className="mt-2">
                                        <SelectButton value={isPPO} onChange={(e) => {
                                            setIsPPO(e.value || '')
                                        }} options={ppoOptions} required />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-between">
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">On Campus ?</label>
                                    <div className="mt-2">
                                        <SelectButton value={isOnCampus} onChange={(e) => {
                                            setIsOnCampus(e.value || '')
                                        }} options={onCampusOptions} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">Girls Drive ?</label>
                                    <div className="mt-2">
                                        <SelectButton value={isGirlsDrive} onChange={(e) => {
                                            setIsGirlsDrive(e.value || '')
                                        }} options={girlsDriveOptions} required />
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Got Something to add more ?
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        placeholder='eg. 2 months internship, experience, etc.'
                                        value={extraData}
                                        onChange={(e) => {
                                            setExtraData(e.target.value);
                                        }}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"}
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    value="Edit Placement"
                                    type="submit"
                                    disabled={!isValidInput || isLoading}
                                    className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                            </div>

                        </form>
                    </div>
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
                                            New Company
                                        </Dialog.Title>
                                        <form onSubmit={addNewCompany}>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Please enter the name of the new company.
                                                </p>
                                                <div className="space-y-6">
                                                    <div>
                                                        <div className="mt-2">
                                                            <input
                                                                type="name"
                                                                placeholder='Enter the company name'
                                                                onChange={(e) => {
                                                                    setCompanyName(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                    (!isValidCompanyName && companyName ? ' ring-red-500' : isValidCompanyName && companyName ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <input
                                                    value={"Add Company"}
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
        }
        <Toast ref={toast} position="bottom-center" />
    </>
}