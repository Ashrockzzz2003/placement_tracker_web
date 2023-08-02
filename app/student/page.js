"use client";

import { useEffect, useState } from "react"
import { ALL_STUDENTS_URL } from "../constants"
import Image from "next/image"
import Searchbar from "../components/SearchBar"
import secureLocalStorage from "react-secure-storage"
import 'material-icons/iconfont/material-icons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SelectButton } from 'primereact/selectbutton';
import { MultiSelect } from 'primereact/multiselect';
import Link from "next/link";


export default function AllStudents() {
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const genderOptions = ['M', 'F'];
    const [gender, setGender] = useState('');


    const sections = [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' }
    ];
    const [selectedSections, setSelectedSections] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState(null);

    const isPlacedOptions = ['Placed', 'Not Placed'];
    const [isPlacedValue, setIsPlacedValue] = useState('');
    const [isPlaced, setIsPlaced] = useState(null);

    const isHigherStudiesOptions = ['Higher Studies', 'Not Higher Studies'];
    const [isHigherStudiesValue, setIsHigherStudiesValue] = useState('');
    const [isHigherStudies, setIsHigherStudies] = useState(null);

    const isOnCampusOptions = ['On Campus', 'Off Campus'];
    const [isOnCampusValue, setIsOnCampusValue] = useState('');
    const [isOnCampus, setIsOnCampus] = useState(null);

    const isPPOOptions = ['PPO', 'Normal'];
    const [isPPOValue, setIsPPOValue] = useState('');
    const [isPPO, setIsPPO] = useState(null);

    useEffect(() => {

        setLoading(true);

        const token = secureLocalStorage.getItem('SECRET_TOKEN');

        if (!token) {
            alert('Session expired. Please login again.');
            secureLocalStorage.clear();
            window.location.href = '/login';
            setLoading(false);
            return;
        }


        fetch(ALL_STUDENTS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
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
            setStudents(data.data);
            setFilteredStudents(data.data);
            setCompanies(data.companies);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        if (students.length) {
            setFilteredStudents(students.filter(student => {
                return (student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) && (student.gender === gender || gender === "") && (selectedSections === null || selectedSections.includes(student.section) || selectedSections.length === 0) && (selectedCompanies === null || student.companies.some(companyName => selectedCompanies.includes(companyName)) || selectedCompanies.length === 0) && (isPlaced === true ? student.noOfOffers > 0 : student.noOfOffers === 0 || isPlaced === null) && (isHigherStudies === student.isHigherStudies || isHigherStudies === null) && (student.placement.some(placementType => placementType.isOnCampus !== (isOnCampus === "0" ? "1" : "0")) || isOnCampus === null) && (student.placement.some(placementType => placementType.isPPO !== (isPPO === "0" ? "1" : "0")) || isPPO === null)
            }
            ))
        }
    }, [searchTerm, students, gender, isPlaced, selectedSections, selectedCompanies, isHigherStudies, isOnCampus, isPPO])

    return loading ?
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
        </>
        :
        <>
            <header className="bg-white flex px-4">
                <Link href={"/"} className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </Link>
            </header>
            <div className="mt-8">
                <h1 className="text-2xl font-bold text-center">Students</h1>
                <Link href={"/student/add"} className="w-fit ml-auto mr-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9] mt-4">
                    <span className="material-icons mx-1">person_add</span>
                    {"Add Student"}
                </Link>
                <div className="w-full ml-auto mr-auto my-4">
                    {/* FILTERS */}
                    <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray">
                        <h1 className="text-xl font-bold text-center p-2">Filters</h1>

                        <hr className="w-full border-bGray" />

                        <Searchbar onChange={
                            (value) => setSearchTerm(value)
                        } placeholderText={"Search by Name or Roll Number"} />

                        <div className="flex flex-col border-t border-bGray justify-center items-center xl:flex-row">
                            <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                <SelectButton value={gender} onChange={(e) => {
                                    setGender(e.value || '')
                                }} options={genderOptions} />
                            </div>

                            <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                <MultiSelect value={selectedSections} onChange={
                                    (e) => {
                                        setSelectedSections(e.value);
                                        console.log(selectedSections);
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
                                } options={companies} filter filterPlaceholder="Enter Company Name" optionLabel="companyName" optionValue="companyName" display="chip"
                                    showClear={true}
                                    placeholder="Select Companies" maxSelectedLabels={2} className="w-full md:w-20rem" />
                            </div>
                            <div className="p-4">
                                <SelectButton value={isPlacedValue} onChange={(e) => {
                                    setIsPlacedValue(e.value)
                                    setIsPlaced(e.value === "Placed" ? true : e.value === "Not Placed" ? false : null)
                                }} options={isPlacedOptions} />
                            </div>
                        </div>
                        <div className="flex flex-col border-t border-bGray justify-center items-center xl:flex-row">
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
                        </div>
                    </div>

                    <br />

                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-t-2xl bg-white text-center border-collapse">
                        <thead className="border-0">
                            <tr>
                                <th className="px-4 py-2">Roll No</th>
                                <th className="px-4 py-2">Full Name</th>
                                <th className="px-4 py-2">Gender</th>
                                <th className="px-4 py-2">Section</th>
                                <th className="px-4 py-2">No of offers</th>
                                <th className="px-4 py-2">Offers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredStudents.length > 0 ? filteredStudents.map((student, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border border-bGray px-4 py-2">{student.rollNo}</td>
                                            <td className="border border-bGray px-4 py-2">{student.fullName}</td>
                                            <td className="border border-bGray px-4 py-2">{student.gender === "M" ? "Male" : "Female"}</td>
                                            <td className="border border-bGray px-4 py-2">{student.section}</td>
                                            <td className="border border-bGray px-4 py-2">{student.noOfOffers}</td>
                                            {parseInt(student.noOfOffers) > 0 ? (
                                                <td colSpan={student.noOfOffers} className="border border-bGray px-4 py-2">
                                                    {student.isHigherStudies === "1" ? (
                                                        <span className="w-fit ml-auto mr-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">Higher Studies</span>
                                                    ) : (
                                                        student.noOfOffers > 0 ? (
                                                            <div className="flex flex-row space-x-2">
                                                                {student.placement.map((offer, index) => {
                                                                    return (
                                                                        <span key={index} className="w-fit ml-auto mr-auto bg-[#9ff7e4] text-[#01402e] rounded-xl py-2 items-center align-middle flex flex-col hover:bg-[#fcffc9]">
                                                                            <span className="font-semibold border-b border-[#01402f] w-full px-2">{offer.companyName}</span>
                                                                            <span className="px-2">{offer.ctc + " LPA"}</span>
                                                                            <span className="px-2">{offer.role}</span>
                                                                            <span className="px-2">{offer.location}</span>
                                                                            <span className="px-2">{(offer.isPPO === "1" ? "PPO" : "Not PPO")}</span>
                                                                            <span className="px-2">{(offer.isOnCampus === "1" ? "On-Campus" : "Off-Campus")}</span>
                                                                            <span className="px-2">{offer.datePlaced}</span>
                                                                        </span>
                                                                    )
                                                                })}
                                                            </div>
                                                        ) : (
                                                            null
                                                        )

                                                    )}
                                                </td>
                                            ) : (
                                                <td className="border border-bGray px-4 py-2">
                                                    <span className="w-fit ml-auto mr-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">Not placed</span>
                                                </td>
                                            )}
                                        </tr>
                                    )

                                }) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-2">No students found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
}