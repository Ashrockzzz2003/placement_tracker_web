"use client";

import { useEffect, useState } from "react"
import { ALL_STUDENTS_URL } from "../constants"
import Image from "next/image"
import Searchbar from "../components/SearchBar"
import secureLocalStorage from "react-secure-storage"
import 'material-icons/iconfont/material-icons.css';
import Link from "next/link";


export default function AllStudents() {
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [gender, setGender] = useState('')
    const [section, setSection] = useState('')
    const [isPlaced, setIsPlaced] = useState(false)
    const [noOfOffers, setNoOfOffers] = useState(0)
    const isValidOffer = noOfOffers >= 0;

    useEffect(() => {

        setLoading(true);

        const token = secureLocalStorage.getItem('SECRET_TOKEN');

        if (!token) {
            alert('Session expired. Please login again.');
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
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        if (students.length) {
            setFilteredStudents(students.filter(student => {
                return (student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) && (student.gender === gender || gender === "") && (student.section === section || section === "") && (isPlaced ? student.noOfOffers > 0 : true) && (student.noOfOffers >= noOfOffers)
            }
            ))
        }
    }, [searchTerm, students, gender, section, isPlaced, noOfOffers])

    return loading ?
        <>
            <header className="bg-white flex px-4">
                <div className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </div>
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
                <div className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </div>
            </header>
            <div className="mt-16">
                <h1 className="text-2xl font-bold text-center">Students</h1>
                <div className="w-full ml-auto mr-auto">
                    <Searchbar onChange={
                        (value) => setSearchTerm(value)
                    } placeholderText={"Search by Name or Roll Number"} />
                    <br />
                    {/* FILTERS */}
                    <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray">
                        <h1 className="text-xl font-bold text-center p-2">Filters</h1>

                        <hr className="w-full border-bGray" />

                        <div className="flex flex-row text-center space-x-2">
                            <div className="border-r border-bGray p-4">
                                <h4>Gender</h4>
                                <select className="m-2" onChange={(e) => setGender(e.target.value)} defaultValue={""} placeholder="Gender">
                                    <option value="">All</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>

                            <div className="border-r border-bGray p-4">
                                <h4>Section</h4>
                                <select className="m-2" onChange={(e) => setSection(e.target.value)} defaultValue={""} placeholder="Section">
                                    <option value="">All</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                </select>
                            </div>

                            <div className="p-4 border-r border-bGray ml-auto mr-auto">
                                <label htmlFor="isPlaced">Placed</label>
                                <br />
                                <input type="checkbox" className="h-8 w-8 mr-auto ml-auto" id="isPlaced" onChange={(e) => setIsPlaced(e.target.checked)} />
                            </div>

                            <div className="p-4">
                                <h4>No Of Offers</h4>
                                <input type="number" className={"block text-lg w-24 p-2 rounded-md text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:leading-6 !outline-none"} id="noOfOffers" onChange={(e) => setNoOfOffers(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <br />

                    <table className="w-11/12 ml-auto mr-auto my-4 rounded-t-2xl bg-white text-center border-collapse">
                        <thead className="border-0">
                            <tr>
                                <th className="px-4 py-2">Roll No</th>
                                <th className="px-4 py-2 border border-bGray">Full Name</th>
                                <th className="px-4 py-2 border border-bGray">Gender</th>
                                <th className="px-4 py-2 border border-bGray">Section</th>
                                <th className="px-4 py-2 border border-bGray">Batch</th>
                                <th className="px-4 py-2 border border-bGray">No of offers</th>
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
                                            <td className="border border-bGray px-4 py-2">{student.batch}</td>
                                            <td className="border border-bGray px-4 py-2">{student.noOfOffers}</td>
                                            <td rowSpan={student.noOfOffers} className="border border-bGray px-4 py-2">
                                                {student.isHigherStudies === "1" ? (
                                                    <span className="w-fit ml-auto mr-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">Higher Studies</span>
                                                ) : (
                                                    student.noOfOffers > 0 ? (
                                                        <div className="flex flex-row space-x-2">
                                                            {student.placement.map((offer, index) => {
                                                                return (
                                                                    <span key={index} className="w-fit ml-auto mr-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">

                                                                        {offer.company.companyName}<br />
                                                                        {offer.ctc}<br />
                                                                        {offer.role}<br /> {offer.location}<br />
                                                                        {(offer.isPPO === "1" ? "PPO" : "Not PPO")}<br />
                                                                        {(offer.isOnCampus === "1" ? "On-Campus" : "Off-Campus")}<br />
                                                                        {offer.datePlaced}
                                                                    </span>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="w-fit ml-auto mr-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">Not placed</span>
                                                    )

                                                )}
                                            </td>
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