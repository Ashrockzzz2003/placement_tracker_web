"use client";

import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { MANGER_LOGIN_VERFIY_URL, STUDENT_REGISTER_VERIFY_URL } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { hashPassword } from "@/util/hash";

export default function RegisterVerify() {
    const toast = useRef(null);

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const otpRegex = /^[0-9]{6}$/;
    const isValidOtp = otp.length === 6 && otpRegex.test(otp[0] + otp[1] + otp[2] + otp[3] + otp[4] + otp[5]);

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerToken, setRegisterToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isValidPassword = (newPassword.length > 0 && newPassword.length >= 8 && confirmPassword.length == 0) || (confirmPassword.length > 0 && newPassword === confirmPassword);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setRegisterEmail(secureLocalStorage.getItem("loginVerifyEmail"));
        setRegisterToken(secureLocalStorage.getItem("loginVerifyToken"));
    }, []);


    const handleVerify = async (e) => {
        e.preventDefault();

        const otpString = otp[0] + otp[1] + otp[2] + otp[3] + otp[4] + otp[5];

        if (registerEmail === null || registerToken === null || registerToken.length == 0 || registerEmail.length == 0 || otpString === null || otpString.length == 0) {
            alertError("Error", "Session expired. Please try again.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 2000);
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(MANGER_LOGIN_VERFIY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + registerToken,
                },
                body: JSON.stringify({
                    otp: otpString,
                    newPassword: hashPassword(newPassword),
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                alertSuccess("Login Successful", "OTP verified successfully. Redirecting to dashboard.");
                // console.log(data);
                secureLocalStorage.clear();
                secureLocalStorage.setItem("userAccess", data["SECRET_TOKEN"]);
                secureLocalStorage.setItem("currentUser", JSON.stringify({
                    managerId: data["managerId"],
                    managerName: data["managerName"],
                    managerEmail: data["managerEmail"],
                    managerRole: data["managerRole"],
                    accountStatus: data["accountStatus"],
                }));
                setTimeout(() => {
                    router.replace("/dashboard/manager");
                }, 2000);

            } else if (response.status === 500) {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            } else if (data.message !== undefined || data.message !== null) {
                alertError('Registration Failed', data.message);
            } else {
                alertError('Oops!', 'Something went wrong! Please try again later!');
            }

        } catch (error) {
            console.error(error);
            alertError("Error", "Something went wrong. Please try again.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 2000);
            return;
        } finally {
            setLoading(false);
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
        registerEmail === null || registerToken === null || registerEmail.length == 0 || registerToken.length == 0 ?
            <LoadingScreen /> :
            <main className='flex h-screen flex-1 flex-col justify-center'>
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/"}>
                                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <div className="flex flex-1 justify-end space-x-1">
                            <Link replace={true} href={"/login"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons">login</span>
                            </Link>
                        </div>
                    </nav>
                </header>

                <div className="border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50 ">
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
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Account Verification</h1>
                        </div>
                        <hr className='border-gray-300 w-full' />
                    </div>

                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                        <form className="space-y-6" onSubmit={handleVerify}>
                            {/* OTP input */}
                            <div>
                                <label htmlFor="otp" className="block text-lg font-medium text-gray-700">
                                    OTP
                                </label>
                                <p className="mt-1 text-sm text-gray-500">
                                    {"Enter the OTP received through email in " + registerEmail}
                                </p>

                                <div className="flex flex-1 space-x-1 mt-4">
                                    {/* 6 input boxes */}
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                key={index}
                                                type="text"
                                                name="otp"
                                                id="otp"
                                                maxLength={1}
                                                size={1}
                                                autoComplete="off"
                                                className="w-1/6 px-2 py-4 rounded-xl text-center border border-gray-300 focus:ring-0 text-lg font-semibold"
                                                value={data}
                                                onChange={(e) => {
                                                    const otpCopy = [...otp];
                                                    otpCopy[index] = e.target.value;
                                                    setOtp(otpCopy);
                                                    if (e.target.value.length === 1 && index !== otp.length - 1) {
                                                        e.target.nextSibling.focus();
                                                    } else if (e.target.value.length === 0 && index !== 0) {
                                                        e.target.previousSibling.focus();
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className='border-gray-300 w-full p-0' />

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    New Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder='Enter your Password'
                                        className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && newPassword ? ' ring-red-500' : isValidPassword && newPassword ? ' ring-green-500' : ' ring-bGray')}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Re-Enter New Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        autoComplete="confirm-password"
                                        placeholder='Re-Enter your Password'
                                        className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && confirmPassword ? ' ring-red-500' : isValidPassword && confirmPassword ? ' ring-green-500' : ' ring-bGray')}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    value="Verify"
                                    type="submit"
                                    disabled={!isValidOtp || !isValidPassword || loading}
                                    className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                            </div>
                        </form>
                    </div>
                </div>

                <Toast position="bottom-center" ref={toast} />
            </main>
    );
}