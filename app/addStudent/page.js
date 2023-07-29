'use client';

import { useState } from 'react';
import Image from 'next/image';
import secureLocalStorage from 'react-secure-storage';
import { ADD_STUDENT_URL } from '../constants';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [rollNo, setrollNo] = useState('')
    const [fullName, setfullName] = useState('')
    const [gender, setgender] = useState('');
    const [section, setsection] = useState('');
    const [batch, setbatch] = useState('');
    const [campus, setcampus] = useState('');
    const [dept, setdept] = useState('');
    const [isHigherStudies, setisHigherStudies] = useState(false);


    const isValidRollNo = rollNo.length > 0;
    // check if fullName has only alphabets and spaces and .

    const fullNameRegex = /^[a-zA-Z .]+$/;

    const isValidFullName = fullNameRegex.test(fullName);
    const isValidGender = gender === "M" || gender === "F";
    const isValidSection = ['A', 'B', 'C', 'D', 'E', 'F'].includes(section);
    const isValidBatch = batch > 0;
    const isValidCampus = campus.length > 0;
    const isValidDept = dept.length > 0;
    const isValidIsHigherStudies = typeof isHigherStudies === 'boolean';

    const router = useRouter();

    const handleAddNewStudent = async (e) => {
        e.preventDefault();
        try {
            const token = secureLocalStorage.getItem('SECRET_TOKEN');

            console.log(JSON.stringify({
                rollNo: rollNo,
                fullName: fullName,
                gender: gender,
                section: section,
                batch: batch,
                campus: campus,
                dept: dept,
                isHigherStudies: isHigherStudies ? "1" : "0"
            }));


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
                    campus: campus,
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
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="M"
                                            checked={gender === "M"}
                                            onChange={(e) => setgender(e.target.value)}
                                            className={
                                                "form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out " +
                                                (!isValidGender ? "ring-red-500" : "")
                                            }
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="F"
                                            checked={gender === "F"}
                                            onChange={(e) => setgender(e.target.value)}
                                            className={
                                                "form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out " +
                                                (!isValidGender ? "ring-red-500" : "")
                                            }
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">Section</label>
                                <div className="mt-2">
                                    <select
                                        value={section}
                                        onChange={(e) => setsection(e.target.value)}
                                        className={
                                            "block w-full text-lg rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset " +
                                            (!isValidSection && section ? " ring-red-500" : isValidSection && section ? " ring-green-500" : " ring-bGray") +
                                            " outline-none placeholder:text-gray-400 sm:text-md sm:leading-6"
                                        }
                                        required
                                    >
                                        <option value="">Select Section</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                    </select>
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
                                    Campus
                                </label>
                                <div className="mt-2">
                                    <select
                                        value={campus}
                                        onChange={(e) => setcampus(e.target.value)}
                                        className={
                                            "block w-full text-lg rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset " +
                                            (!isValidCampus && campus ? "ring-red-500" : isValidCampus && campus ? "ring-green-500" : "ring-bGray") +
                                            " outline-none placeholder:text-gray-400 sm:text-md sm:leading-6"}
                                        required
                                    >
                                        <option value="">Select Campus</option>
                                        <option value="CB">CB</option>
                                        <option value="KL">Kollam</option>
                                        <option value="CH">Chennai</option>
                                        <option value="BN">Bengaluru</option>
                                    </select>
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
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isHigherStudies"
                                            onChange={(e) => setisHigherStudies(e.target.checked)}
                                            className={
                                                "form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out " +
                                                (isHigherStudies ? " ring-green-500" : " ring-bGray")
                                            }
                                        />
                                    </label>
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
                                        !isValidCampus ||
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
