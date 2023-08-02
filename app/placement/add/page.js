"use client";

import { ADD_PLACEMENT_URL, ADD_PLACEMENT_UTIL_URL } from "@/app/constants";
import Image from "next/image";
import Link from "next/link";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";


export default function AddPlacement() {
    const [companyData, setCompanyData] = useState([]);
    const [studentData, setStudentData] = useState([]);

    const [companyID, setCompanyID] = useState('');
    const [studentRollNo, setStudentRollNo] = useState('');
    const [role, setRole] = useState('');
    const [ctc, setCtc] = useState('');
    const [datePlaced, setDatePlaced] = useState('');

    const isPPOOptions = ['PPO', 'Normal'];
    const [isPPOValue, setIsPPOValue] = useState('');
    const [isPPO, setIsPPO] = useState(null);

    const isOnCampusOptions = ['On Campus', 'Off Campus'];
    const [isOnCampusValue, setIsOnCampusValue] = useState('');
    const [isOnCampus, setIsOnCampus] = useState(null);


    const [location, setLocation] = useState('');
    const [extra, setExtra] = useState('');

    const isValidCompanyID = companyID !== '';
    const isValidStudentRollNo = studentRollNo !== '';
    const isValidRole = role !== '';
    const isValidCtc = ctc !== '';
    const isValidDatePlaced = datePlaced !== '';
    const isValidIsPPO = isPPO !== null;
    const isValidIsOnCampus = isOnCampus !== null;
    const isValidLocation = location !== '';


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const token = secureLocalStorage.getItem("SECRET_TOKEN");

        if (!token) {
            alert("Please login first.");
            secureLocalStorage.clear();
            setIsLoading(false);
            window.location.href = "/login";
        }

        fetch(ADD_PLACEMENT_UTIL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            setIsLoading(false);
            if (res.status === 200) {
                return res.json()
            }
            else if (res.status === 401) {
                alert('Session expired. Please login again.');
                secureLocalStorage.clear();
                window.location.href = '/login';
            } else {
                const data = res.json();
                if (data && data.message) {
                    alert(data.message);
                }
                else {
                    alert('Something went wrong. Please try again later.');
                }
            }
        }).then(data => {
            setCompanyData(data.companyData);
            setStudentData(data.studentData);
        });

        setIsLoading(false);
    }, [])

    const handleAddPlacement = async (e) => {
        setIsLoading(true);

        const token = secureLocalStorage.getItem("SECRET_TOKEN");

        if (!token) {
            alert("Please login first.");
            setIsLoading(false);
            secureLocalStorage.clear();
            window.location.href = "/login";
        }

        e.preventDefault();

        if (!isValidCompanyID || !isValidStudentRollNo || !isValidRole || !isValidCtc || !isValidDatePlaced || !isValidIsPPO || !isValidIsOnCampus || !isValidLocation) {
            alert('Please enter valid data.');
            setIsLoading(false);
            return;
        }

        const res = await fetch(ADD_PLACEMENT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                companyID: companyID.toString(),
                studentRollNo: studentRollNo,
                role: role,
                ctc: ctc,
                datePlaced: datePlaced,
                isPPO: isPPO,
                isOnCampus: isOnCampus,
                location: location,
                extra: extra
            })
        });

        if (res.status === 200) {
            alert('Placement added successfully.');
            window.location.href = '/';
            setIsLoading(false);
            return;
        }
        else if (res.status === 401) {
            alert('Session expired. Please login again.');
            secureLocalStorage.clear();
            window.location.href = '/login';
            setIsLoading(false);
            return;
        }
        else {
            setIsLoading(false);
            const data = await res.json();
            if (data && data.message) {
                alert(data.message);
            }
            else {
                alert('Something went wrong. Please try again later.');
            }

            return;
        }
    }

    return isLoading || !companyData || companyData === null || companyData.length === 0 || !studentData || studentData === [] || studentData.length === 0 ?
        <>
            <header className="bg-white flex px-4">
                <Link href={"/"} className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </Link>
            </header>
            <div className="flex flex-col justify-center items-center align-middle mt-[25%]">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-repeat animate-spin" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                </svg>
                <p className="text-xl">Loading...</p>
            </div>
        </> :
        <>
            <header className="bg-white flex px-4">
                <Link href={"/"} className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </Link>
            </header>
            <div className='flex mt-8 flex-1 flex-col justify-center'>
                <div className="border border-bGray rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md bg-white">
                    <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                        <div className='flex flex-row justify-center'>
                            <button type='button' className='px-4 py-4 w-full text-2xl font-semibold'> Add new Placement </button>
                        </div>
                        <hr className=' w-full' />
                    </div>


                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-12 lg:px-8">
                        <form className="space-y-6" onSubmit={handleAddPlacement}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Company</label>
                                <div className="mt-2">
                                    <Dropdown value={companyID} onChange={(e) => { setCompanyID(e.value) }} options={companyData} optionLabel="companyName" optionValue='id'
                                        placeholder="Select the company" className="w-full md:w-14rem" filter required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Student Roll Number</label>
                                <div className="mt-2">
                                    <Dropdown value={studentRollNo} onChange={(e) => { setStudentRollNo(e.value) }} options={studentData} optionLabel="rollNo" optionValue='rollNo'
                                        placeholder="Select Roll No" className="w-full md:w-14rem" filter required />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Role
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Role"
                                        onChange={(e) => { setRole(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidRole && role ? " ring-red-500" : isValidRole && role ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        CTC
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        step="0.0001"
                                        autoComplete="off"
                                        placeholder="Enter CTC"
                                        onChange={(e) => { setCtc(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCtc && ctc ? " ring-red-500" : isValidCtc && ctc ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        PPO
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <SelectButton value={isPPOValue} onChange={(e) => {
                                        setIsPPOValue(e.value)
                                        setIsPPO(e.value === "PPO" ? "1" : e.value === "Normal" ? "0" : null)
                                    }} options={isPPOOptions} required />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        On Campus
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <SelectButton value={isOnCampusValue} onChange={(e) => {
                                        setIsOnCampusValue(e.value)
                                        setIsOnCampus(e.value === "On Campus" ? "1" : e.value === "Off Campus" ? "0" : null)
                                    }} options={isOnCampusOptions} required />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Date Placed
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        autoComplete="off"
                                        placeholder="Select Date placed"
                                        onChange={(e) => { setDatePlaced(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidDatePlaced && datePlaced ? " ring-red-500" : isValidDatePlaced && datePlaced ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Location
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Location"
                                        onChange={(e) => { setLocation(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidLocation && location ? " ring-red-500" : isValidLocation && location ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Any Notes?
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Remarks/Notes"
                                        onChange={(e) => { setExtra(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"}
                                    />
                                </div>
                            </div>


                            <div>
                                <input
                                    value="Add Placement"
                                    type="submit"
                                    disabled={
                                        !isValidCompanyID ||
                                        !isValidStudentRollNo ||
                                        !isValidRole ||
                                        !isValidCtc ||
                                        !isValidIsPPO ||
                                        !isValidIsOnCampus ||
                                        !isValidLocation
                                    }
                                    className={`w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
}