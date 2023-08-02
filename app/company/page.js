"use client";

import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ALL_COMPANIES_URL } from "../constants";
import Loading from "../components/Loading";
import Link from "next/link";
import Image from "next/image";
import 'material-icons/iconfont/material-icons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Searchbar from "../components/SearchBar";
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from "primereact/selectbutton";

export default function AllCompanies() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    const [companyOptions, setCompanyOptions] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState(null);

    const isPlacedOptions = ['Has Offers', 'No Offers'];
    const [isPlacedValue, setIsPlacedValue] = useState('');
    const [isPlaced, setIsPlaced] = useState(null);

    const isPPOOptions = ['PPO', 'Normal'];
    const [isPPOValue, setIsPPOValue] = useState('');
    const [isPPO, setIsPPO] = useState(null);


    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [ctcValue, setCtcValue] = useState(null);

    const sections = [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' }
    ];
    const [selectedSections, setSelectedSections] = useState(null);


    useEffect(() => {
        setLoading(true);

        const token = secureLocalStorage.getItem("SECRET_TOKEN");

        if (!token) {
            alert('Session expired. Please login again.');
            secureLocalStorage.clear();
            window.location.href = '/login';
            setLoading(false);
            return;
        }

        fetch(ALL_COMPANIES_URL, {
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
            setCompanies(data.data);
            setFilteredCompanies(data.data);
            setCompanyOptions(data.companyData);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        if (companies.length) {
            setFilteredCompanies(companies.filter(company => {
                return ((company.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (selectedCompanies === null || selectedCompanies.length === 0 || selectedCompanies.includes(company.companyName)) &&
                    (isPlaced === null || (isPlaced !== null && isPlaced === true ? company.placementData.length > 0 : company.placementData.length === 0)) &&
                    (selectedSections === null || selectedSections.length === 0 || company.placementData.some(placement => placement.sectionData.some(sectionData => selectedSections.includes(sectionData.section) && ((isPlaced === true && sectionData.noOfStudents >= 1) || (isPlaced === false && sectionData.noOfStudents === 0) || (isPlaced === null)) ))) && (isPPO === null || (isPPO !== null && company.placementData.some(placement => placement.isPPO === isPPO)))
                )
            }))
        }
    }, [companies, searchTerm, selectedCompanies, isPlaced, selectedSections, isPPO])

    return loading ? <Loading /> :
        (
            <>
                <header className="bg-white flex px-4">
                    <Link href={"/"} className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                        <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                        <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                    </Link>
                </header>
                <div className="mt-8">
                    <h1 className="text-2xl font-bold text-center">Companies and Placements</h1>
                    <br />
                    <Link href={"/company/add"} className="w-fit ml-auto mr-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9]">
                        <span className="material-icons mx-1">post_add</span>
                        {"Add Company"}
                    </Link>
                    <br />
                    <Link href={"/placement/add"} className="w-fit ml-auto mr-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9]">
                        <span className="material-icons mx-1">work</span>
                        {"Add Placement"}
                    </Link>

                    <div className="w-full ml-auto mr-auto my-4">
                        {/* FILTERS */}
                        <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray">
                            <h1 className="text-xl font-bold text-center p-2">Filters</h1>

                            <hr className="w-full border-bGray" />

                            <Searchbar onChange={
                                (value) => setSearchTerm(value)
                            } placeholderText={"Search by Company Name"} />

                            <div className="flex flex-col border-t border-bGray justify-center items-center xl:flex-row">
                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <MultiSelect value={selectedCompanies} onChange={
                                        (e) => {
                                            setSelectedCompanies(e.value);
                                        }
                                    } options={companies} filter filterPlaceholder="Enter Company Name" optionLabel="companyName" optionValue="companyName" display="chip"
                                        showClear={true}
                                        placeholder="Select Companies" maxSelectedLabels={2} className="w-full md:w-20rem" />
                                </div>

                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <SelectButton value={isPlacedValue} onChange={(e) => {
                                        setIsPlacedValue(e.value)
                                        setIsPlaced(e.value === "Has Offers" ? true : e.value === "No Offers" ? false : null)
                                    }} options={isPlacedOptions} />
                                </div>

                                <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                    <SelectButton value={isPPOValue} onChange={(e) => {
                                        setIsPPOValue(e.value)
                                        setIsPPO(e.value === "PPO" ? "1" : e.value === "Normal" ? "0" : null)
                                    }} options={isPPOOptions} />
                                </div>

                                <div className="p-4">
                                    <MultiSelect value={selectedSections} onChange={
                                        (e) => {
                                            setSelectedSections(e.value);
                                            console.log(selectedSections);
                                        }
                                    } options={sections} optionLabel="name" optionValue="name" display="chip"
                                        showClear={true}
                                        placeholder="Select Sections" maxSelectedLabels={2} className="w-full md:w-20rem" />
                                </div>
                            </div>


                        </div>

                    </div>

                    {/* TABLE */}

                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-t-2xl bg-white text-center border-collapse">
                        <thead className="border-0">
                            <tr>
                                <th rowSpan={2} className="px-4 py-2 border-b">Company</th>
                                <th colSpan={4} className="px-4 py-2 border">Placement Data</th>
                                <th colSpan={5} className="px-4 py-2">Across Sections</th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border">Note</th>
                                <th className="px-4 py-2 border">CTC</th>
                                <th className="px-4 py-2 border">Role</th>
                                <th className="px-4 py-2 border">PPO ?</th>
                                <th className="px-4 py-2 border">Total No Of Offers</th>

                                <th className="px-4 py-2 border">A</th>
                                <th className="px-4 py-2 border">B</th>
                                <th className="px-4 py-2 border">C</th>
                                <th className="px-4 py-2 border">D</th>
                                <th className="px-4 py-2 border">E</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredCompanies.length > 0 ? filteredCompanies.map((company, index) => {
                                    return company.placementData.length === 0 ? (
                                        <>
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">{company.companyName}</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                                <td className="px-4 py-2 border">-</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            <tr key={index}>
                                                <td rowSpan={company.placementData.length + 1} className="px-4 py-2 border">{company.companyName}</td>
                                            </tr>
                                            {
                                                company.placementData.map((placement, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-4 py-2 border">{!placement.extra ? "-" : placement.extra}</td>
                                                            <td className="px-4 py-2 border">{placement.ctc}</td>
                                                            <td className="px-4 py-2 border">{placement.role}</td>
                                                            <td className="px-4 py-2 border">{placement.isPPO === "1" ? "Yes" : "No"}</td>
                                                            <td className="px-4 py-2 border">{placement.noOfOffers}</td>
                                                            {
                                                                // sort sections alphabetically
                                                                placement.sectionData.sort((a, b) => {
                                                                    if (a.section < b.section) {
                                                                        return -1;
                                                                    }
                                                                    if (a.section > b.section) {
                                                                        return 1;
                                                                    }
                                                                    return 0;
                                                                }).map((section, index) => {
                                                                    return (
                                                                        <td key={index} className="px-4 py-2 border">{section.noOfStudents}</td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </>
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
            </>
        );
}