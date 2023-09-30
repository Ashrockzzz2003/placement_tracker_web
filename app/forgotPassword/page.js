'use client';

import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { FORGOT_PASSWORD_URL, FORGOT_PASSWORD_VERIFY_URL, RESET_PASSWORD_URL } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { hashPassword } from "@/util/hash";
export default function ForgotPassword() {
    useEffect(() => {
        secureLocalStorage.clear();
        Aos.init({
            duration: 512,
            once: true,
            delay: 100,
        });
    }, []);

    const [userEmail, setUserEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const otpRegex = /^[0-9]{6}$/;
    const isValidOtp = otp.length === 6 && otpRegex.test(otp[0] + otp[1] + otp[2] + otp[3] + otp[4] + otp[5]);

    const [otpVerifyToken, setOtpVerifyToken] = useState('');
    const [resetPasswordToken, setResetPasswordToken] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);

    const isValidPassword = (newPassword.length > 0 && newPassword.length >= 8 && confirmPassword.length == 0) || (confirmPassword.length > 0 && newPassword === confirmPassword);

    const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@(cb.students.amrita.edu|cb.amrita.edu)$/);

    const isValidEmail = emailRegex.test(userEmail) || userEmail === "ashrockzzz2003@gmail.com" || userEmail === "hsheadone@gmail.com";

    const toast = useRef(null);


    const alertError = (summary, detail) => {
        toast.current.show({
            severity: 'error',
            summary: summary,
            detail: detail,
            life: 5000,
        });
    };

    const alertSuccess = (summary, detail) => {
        toast.current.show({
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 5000,
        });
    };

    const router = useRouter();

    // fetch otpVerifyToken
    const handleStep1 = async (e) => {
        setIsLoading(true);

        e.preventDefault();

        if (!userEmail || userEmail === '' || !step1) {
            alertError('Error', 'Please enter your email address');
            return;
        }

        try {
            const response = await fetch(FORGOT_PASSWORD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                alertSuccess("Success", "OTP sent to your email address");


                setTimeout(() => {
                    setOtpVerifyToken(data.SECRET_TOKEN);
                    setStep2(true);
                    setStep1(false);
                    setIsLoading(false);
                }, 1000);

            } else if (response.status === 500) {
                alertError('Oops!', 'Something went wrong! Please try again later!');

                setTimeout(() => {
                    setIsLoading(false);
                    router.replace("/");
                }, 2000);
            } else if (data.message !== undefined || data.message !== null) {
                alertError('Reset Password Failed', data.message);

                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            } else {
                alertError('Oops!', 'Something went wrong! Please try again later!');

                setTimeout(() => {
                    setIsLoading(false);
                    router.replace("/login");
                }, 2000);
            }

            return;
        } catch (error) {
            console.log(error);
            alertError("Error", "Something went wrong. Please try again.");

            setTimeout(() => {
                setIsLoading(false);
                secureLocalStorage.clear();
                router.replace("/");
            }, 2000);
            return;
        } finally {
            setIsLoading(false);
        }
    }

    // fetch resetPasswordToken
    const handleStep2 = async (e) => {
        setIsLoading(true);

        e.preventDefault();

        const otpString = otp[0] + otp[1] + otp[2] + otp[3] + otp[4] + otp[5];

        if (step1 || !step2 || !otpString || otpString === '' || !isValidOtp || !otpVerifyToken || otpVerifyToken.length === 0 || !isValidPassword) {
            alertError('Error', 'Please re-enter the OTP');
            return;
        }

        try {
            let response = await fetch(FORGOT_PASSWORD_VERIFY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + otpVerifyToken,
                },
                body: JSON.stringify({
                    otp: otpString,
                }),
            });

            let data = await response.json();

            if (response.status === 200) {
                setResetPasswordToken(data.SECRET_TOKEN);
                console.log(data);

                response = await fetch(RESET_PASSWORD_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + data.SECRET_TOKEN,
                    },
                    body: JSON.stringify({
                        userPassword: hashPassword(newPassword),
                    }),
                });

                data = await response.json();

                if (response.status === 200) {
                    alertSuccess("Success", "Password reset successfully. Redirecting to login page...");
                    setTimeout(() => {
                        setIsLoading(false);
                        router.replace("/login");
                    }, 2000);
                } else if (response.status === 500) {
                    alertError('Oops!', 'Something went wrong! Please try again later!');
                    setTimeout(() => {
                        setIsLoading(false);
                        router.replace("/");
                    }, 2000);
                } else if (data.message !== undefined || data.message !== null) {
                    alertError('Password Reset Failed', data.message);
                    setTimeout(() => {
                        setIsLoading(false);
                        router.replace("/");
                    }, 2000);
                } else {
                    alertError('Oops!', 'Something went wrong! Please try again later!');
                    setTimeout(() => {
                        setIsLoading(false);
                        router.replace("/login");
                    }, 2000);
                }

                return;
            } else if (response.status === 500) {
                alertError('Oops!', 'Something went wrong! Please try again later!');
                setTimeout(() => {
                    setIsLoading(false);
                    router.replace("/login");
                }, 2000);
            } else if (data.message !== undefined || data.message !== null) {
                alertError('Registration Failed', data.message);
                setTimeout(() => {
                    setIsLoading(false);
                    router.replace("/login");
                }, 2000);
            } else {
                alertError('Oops!', 'Something went wrong! Please try again later!');
                setTimeout(() => {
                    setIsLoading(false);
                    router.replace("/login");
                }, 2000);
            }

            return;

        } catch (error) {
            console.log(error);
            alertError("Error", "Something went wrong. Please try again.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/");
            }, 2000);
            return;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading || (step2 === true && (otpVerifyToken === null || otpVerifyToken.length === 0)) ? (
                <LoadingScreen />
            ) : (step1 === true && step2 === false) ? (
                <main className='flex h-screen flex-1 flex-col justify-center' data-aos="fade-in">
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/"}>
                                    <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="flex flex-1 justify-end space-x-1">
                                <Link replace={true} href={"/register"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                    {"Login"}
                                    <span className="material-icons ml-2">login</span>
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
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Forgot Password</h1>
                            </div>
                            <hr className='border-gray-300 w-full' />
                        </div>

                        <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                            <form className="space-y-6" onSubmit={handleStep1}>
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
                                    <input
                                        value="Reset Password"
                                        type="submit"
                                        disabled={!isValidEmail || isLoading}
                                        className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            ) : (step2 === true && step1 === false && otpVerifyToken !== null && otpVerifyToken.length !== 0) ? (
                <main className='flex h-screen flex-1 flex-col justify-center' data-aos="fade-in">
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
                                <Link href={"/"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                    <span className="material-icons">home</span>
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
                            <form className="space-y-6" onSubmit={handleStep2}>
                                {/* OTP input */}
                                <div>
                                    <label htmlFor="otp" className="block text-lg font-medium text-gray-700">
                                        OTP
                                    </label>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {"Enter the OTP received through email in " + userEmail}
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
                                        disabled={!isValidOtp || !isValidPassword || isLoading}
                                        className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                                </div>
                            </form>
                        </div>
                    </div>

                </main>
            ) : router.replace("/")}
            <Toast position="bottom-center" ref={toast} />
        </>
    );
}