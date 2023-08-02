"use client";


import { ADD_COMPANY_URL } from "@/app/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function AddCompany() {

    const [companyName, setCompanyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isValidCompanyName = companyName.length > 0;

    const handleAddCompany = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const token = secureLocalStorage.getItem("SECRET_TOKEN");

        if (!token) {
            alert("Session Expired. Please login first");
            secureLocalStorage.clear();
            window.location.href = "/login";
            return;
        }

        const res = await fetch(ADD_COMPANY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                companyName: companyName
            })
        });

        setIsLoading(false);

        if (res.status === 200) {
            alert("Company Added Successfully");
            window.location.href = "/company";
            return;
        } else if (res.status === 401) {
            alert("Session Expired. Please login first");
            secureLocalStorage.clear();
            window.location.href = "/login";
            return;
        } else {
            const data = await res.json();

            if (data && data.message) {
                alert(data.message);
            }
            else {
                alert("Something went wrong. Please try again later");
            }
            return;
        }
    }

    return (
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
                            <button type='button' className='px-4 py-4 w-full text-2xl font-semibold'> Add new Company </button>
                        </div>
                        <hr className=' w-full' />
                    </div>

                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-12 lg:px-8">
                        <form className="space-y-6" onSubmit={handleAddCompany}>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Company Name
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Enter Company Name"
                                        onChange={(e) => { setCompanyName(e.target.value) }}
                                        className={
                                            "block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCompanyName && companyName ? " ring-red-500" : isValidCompanyName && companyName ? " ring-green-500" : " ring-bGray")}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <input
                                        value="Add Company"
                                        type="submit"
                                        disabled={
                                            !isValidCompanyName
                                        }
                                        className={`w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

}