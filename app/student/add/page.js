'use client';

import { useState } from 'react';
import Image from 'next/image';
import secureLocalStorage from 'react-secure-storage';
import { ADD_STUDENT_URL } from '../../constants';
import { useRouter } from 'next/navigation';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export default function AddStudent() {
    const [rollNo, setrollNo] = useState('')
    const [fullName, setfullName] = useState('')
    const [batch, setbatch] = useState('');
    const [dept, setdept] = useState('');

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
    const [section, setSelectedSection] = useState(null);


    const isHigherStudiesOptions = ['Yes', 'No'];
    const [isHigherStudiesValue, setIsHigherStudiesValue] = useState('');
    const [isHigherStudies, setIsHigherStudies] = useState(null);


    const isValidRollNo = rollNo.length > 0;
    // check if fullName has only alphabets and spaces and .

    const fullNameRegex = /^[a-zA-Z .]+$/;

    const isValidFullName = fullNameRegex.test(fullName);
    const isValidGender = gender === "M" || gender === "F";
    const isValidSection = ['A', 'B', 'C', 'D', 'E', 'F'].includes(section);
    const isValidBatch = batch > 0;
    const isValidDept = dept.length > 0;
    const isValidIsHigherStudies = typeof isHigherStudies === 'boolean';

    const router = useRouter();

    const handleAddNewStudent = async (e) => {
        e.preventDefault();
        try {
            const token = secureLocalStorage.getItem('SECRET_TOKEN');

            if (!token) {
                alert("You are not logged in. Please login to continue.");
                router.push('/login');
                return;
            }

            const res = await fetch(ADD_STUDENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    rollNo: rollNo,
                    fullName: fullName,
                    gender: gender,
                    section: section,
                    batch: batch,
                    campus: "CB",
                    dept: dept,
                    isHigherStudies: isHigherStudies ? "1" : "0"
                })
            });

            if (res.status != 200) {
                const data = await res.json();
                if (data.message)
                    alert(data.message);
                else
                    alert("Something went wrong. Please try again later.")
                return;
            } else {
                alert("Student added successfully.")
                router.push('/');
            }

        } catch (error) {
            alert("Something went wrong. Please try again later.")
            return;
        }
    }

    return (
        <>
            <header className="bg-white flex px-4">
                <div className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                    <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                    <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
                </div>
            </header>
            <div className='flex mt-8 flex-1 flex-col justify-center'>
                <div className="border border-bGray rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md bg-white">
                    <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                        <div className='flex flex-row justify-center'>
                            <button type='button' className='px-4 py-4 w-full text-2xl font-semibold'> Add new Student </button>
                        </div>
                        <hr className=' w-full' />
                    </div>

                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-12 lg:px-8">
                        <form className="space-y-6" onSubmit={handleAddNewStudent}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Roll No
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Roll No"
                                        onChange={(e) => setrollNo(e.target.value)}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidRollNo && rollNo ? " ring-red-500" : isValidRollNo && rollNo ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Full Name
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Full Name"
                                        onChange={(e) => setfullName(e.target.value)}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidFullName && fullName ? " ring-red-500" : isValidFullName && fullName ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Gender</label>
                                <div className="mt-2">
                                    <SelectButton value={gender} onChange={(e) => {
                                        setGender(e.value || '')
                                    }} options={genderOptions} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Section</label>
                                <div className="mt-2">
                                    <Dropdown value={section} onChange={(e) => setSelectedSection(e.value)} options={sections} optionLabel="name" optionValue='name'
                                        placeholder="Select a section" className="w-full md:w-14rem" />
                                </div>
                            </div>


                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Batch
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Enter Batch (eg. 2021)"
                                        onChange={(e) => setbatch(e.target.value)}
                                        className={
                                            "block w-full text-lg rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset " +
                                            (!isValidBatch && batch ? " ring-red-500" : isValidBatch && batch ? " ring-green-500" : " ring-bGray") +
                                            " outline-none placeholder:text-gray-400 sm:text-md sm:leading-6"
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Department
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Department"
                                        onChange={(e) => setdept(e.target.value)}
                                        className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidDept && dept ? " ring-red-500" : isValidDept && dept ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Higher Studies?
                                </label>
                                <div className="mt-2">
                                    <SelectButton value={isHigherStudiesValue} onChange={(e) => {
                                        setIsHigherStudiesValue(e.value)
                                        setIsHigherStudies(e.value === "Yes" ? true : e.value === "No" ? false : null)
                                    }} options={isHigherStudiesOptions} />
                                </div>
                            </div>


                            <div>
                                <input
                                    value="Add Student"
                                    type="submit"
                                    disabled={
                                        !isValidRollNo ||
                                        !isValidFullName ||
                                        !isValidGender ||
                                        !isValidSection ||
                                        !isValidBatch ||
                                        !isValidDept ||
                                        !isValidIsHigherStudies
                                    }
                                    className={`w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );
}
