'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import secureLocalStorage from "react-secure-storage";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Toast } from 'primereact/toast';
import { LOGIN_URL } from "@/util/constants";
import { hashPassword } from "@/util/hash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';

export default function Login() {
    useEffect(() => {
        secureLocalStorage.clear();
    }, []);

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const toast = useRef(null);

    const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@(cb.students.amrita.edu|cb.amrita.edu)$/);

    const isValidEmail = emailRegex.test(userEmail) || userEmail === "ashrockzzz2003@gmail.com" || userEmail === "hsheadone@gmail.com";
    const isValidPassword = userPassword.length >= 8;

    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isValidEmail) {
            alertError('Invalid Email ID', 'Please enter a valid Email ID');
            return;
        }

        if (!isValidPassword) {
            alertError('Invalid Password', 'Please enter a valid Password');
            return;
        }

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    userPassword: hashPassword(userPassword),
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                alertSuccess('Login Successful', 'Redirecting to Dashboard ...');
                /* manager
                accountStatus: "1"
                managerEmail: "ashrockzzz2003@gmail.com"
                managerId: 1
                managerName: "Ashwin Narayanan S"
                managerRole: "1"
                message: "Manager logged in!" 
                */
                /* student
                {
                "message": "Student logged in!",
                "SECRET_TOKEN": <SECRET_TOKEN>,
                "studentEmail": "CB.EN.U4CSE21008@cb.students.amrita.edu",
                "studentName": "Ashwin Narayanan S",
                "studentRollNo": "CB.EN.U4CSE21008",
                "studentId": 41,
                "studentSection": "A",
                "studentGender": "M",
                "studentBatch": "2023",
                "studentDept": "CSE",
                "isHigherStudies": "0",
                "isPlaced": "0",
                "CGPA": null
                */
                // console.log(data);
                secureLocalStorage.clear();

                if (data["studentEmail"] !== undefined) {
                    secureLocalStorage.setItem("userAccess", data["SECRET_TOKEN"]);
                    secureLocalStorage.setItem("currentUser", JSON.stringify({
                        studentId: data["studentId"],
                        studentName: data["studentName"],
                        studentEmail: data["studentEmail"],
                        studentRollNo: data["studentRollNo"],
                        studentSection: data["studentSection"],
                        studentGender: data["studentGender"],
                        studentBatch: data["studentBatch"],
                        studentDept: data["studentDept"],
                        isHigherStudies: data["isHigherStudies"],
                        isPlaced: data["isPlaced"],
                        CGPA: data["CGPA"],
                        accountStatus: data["accountStatus"],
                    }));
                } else if (data["managerEmail"] !== undefined) {
                    secureLocalStorage.setItem("userAccess", data["SECRET_TOKEN"]);
                    secureLocalStorage.setItem("currentUser", JSON.stringify({
                        managerId: data["managerId"],
                        managerName: data["managerName"],
                        managerEmail: data["managerEmail"],
                        managerRole: data["managerRole"],
                        accountStatus: data["accountStatus"],
                    }));

                    if (data["managerRole"] === "1") {
                        setTimeout(() => {
                            router.replace("/dashboard/admin");
                        });
                    } else if (data["managerRole"] === "0") {
                        setTimeout(() => {
                            router.replace("/dashboard/manager");
                        });
                    }
                }

            } else if (response.status === 201) {
                alertSuccess("First Time Login!", "Verify OTP sent to your email ID and set your password!");
                console.log(data);
                secureLocalStorage.setItem("loginVerifyToken", data["SECRET_TOKEN"]);
                secureLocalStorage.setItem("loginVerifyEmail", userEmail);


                setTimeout(() => {
                    router.push("/login/verify");
                }, 1000);
            } else if (response.status === 500) {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            } else if (data.message !== undefined || data.message !== null) {
                alertError('Login Failed', data.message);
            } else {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            }

        } catch (error) {
            console.log(error);
            alertError('Oops!', 'Something went wrong! Please try again later!');
        }


    }

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


    return (
        <main className='flex h-screen flex-1 flex-col justify-center'>
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="lg:flex lg:gap-x-12">
                        <Link href={"/"}>
                            <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end space-x-1">
                        <Link replace={true} href={"/register"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                            {"Register"}
                            <span className="material-icons ml-2">app_registration</span>
                        </Link>
                        <Link href={"/"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                            <span className="material-icons">home</span>
                        </Link>
                    </div>
                </nav>
            </header>
            <div className="border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50">
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

                <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                    <div className='flex flex-row justify-center'>
                        <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Sign In</h1>
                    </div>
                    <hr className='border-gray-300 w-full' />
                </div>

                <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Email ID
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder='Enter your Email ID'
                                    onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidEmail && userEmail ? ' ring-red-500' : isValidEmail && userEmail ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-black">
                                    Password
                                </label>
                                <div className="text-md">
                                    <Link replace={true} href={"/forgotPassword"} className="font-medium text-blue-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder='Enter your Password'
                                    className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userPassword ? ' ring-red-500' : isValidPassword && userPassword ? ' ring-green-500' : ' ring-bGray')}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* <p className="mt-10 text-center text-md text-gray-500">
                        {"Don't have an account? "}
                        <Link className="font-semibold leading-6 text-blue-600 hover:underline" href="/register">Register</Link>
                    </p> */}

                        <p className="mt-10 text-center text-md text-gray-500">
                            {"Don't have an account? "}
                            <Link className="font-medium leading-6 text-blue-600 hover:underline" href="/register">Register</Link>
                        </p>

                        <div>
                            <input
                                value="Sign In"
                                type="submit"
                                disabled={!isValidEmail || !isValidPassword}
                                className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                        </div>
                    </form>
                </div>
            </div>

            <Toast position="bottom-center" ref={toast} />
        </main>
    );

}