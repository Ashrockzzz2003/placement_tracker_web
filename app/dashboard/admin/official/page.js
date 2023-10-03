"use client";
import Aos from "aos";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GET_REGISTERED_OFFICIALS_URL } from "@/util/constants";
import secureLocalStorage from "react-secure-storage";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { Toast } from "primereact/toast";
import Link from "next/link";
import Image from "next/image";

export default function AllOfficialsScreen() {
    const [officials, setOfficials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState(null);

    const router = useRouter();
    const toast = useRef(null);

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

    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));

        if (secureLocalStorage.getItem("userAccess") === null || secureLocalStorage.getItem("userAccess") === undefined) {
            secureLocalStorage.clear();
            alertError("Session Expired", "Please login again to continue.");
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        } else {
            fetch(GET_REGISTERED_OFFICIALS_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
                },
                method: "GET"
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setOfficials(data["managers"]);
                        setIsLoading(false);
                    });
                } else if (res.status === 401) {
                    secureLocalStorage.clear();
                    alertError("Session Expired", "Please login again to continue.");
                    setTimeout(() => {
                        router.replace("/login");
                    }, 3000);
                } else {
                    alertError("Error", "Something went wrong. Please try again later.");
                }
            }).catch((err) => {
                console.log(err);
                alertError("Error", "Something went wrong. Please try again later.");
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [router]);

    return <>
        {isLoading ? <LoadingScreen /> : (
            <main data-aos="fade-in">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/dashboard/admin"}>
                                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <div className="flex lg:flex lg:flex-1 lg:justify-end">
                            <Link href={"/dashboard/admin"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons">home</span>
                            </Link>
                            <button onClick={
                                () => {
                                    secureLocalStorage.removeItem("currentUser");
                                    secureLocalStorage.removeItem("userAccess");
                                    router.replace("/login");
                                }
                            } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ml-2">
                                {"Logout"}
                                <span className="material-icons ml-2">logout</span>
                            </button>
                        </div>
                    </nav>
                </header>

                <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                    <div
                        className="absolute inset-x-0 px-40 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
                        />
                    </div>

                    <div className="mx-auto max-w-2xl pt-16 lg:pt-24 pb-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {"Registered Officials"}
                            </h1>
                        </div>
                    </div>

                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                        <thead className="border-0 text-lg font-medium">
                            <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                <th className="px-8 py-4 rounded-tl-2xl border-black">ID</th>
                                <th className="px-8 py-4 border-black">Name</th>
                                <th className="px-8 py-4border-black">Email-ID</th>
                                <th className="px-8 py-4 border-black">Role</th>
                                <th className="px-8 py-4 border-black">Status</th>
                                <th className="px-8 py-4 rounded-tr-2xl border-black">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {officials.map((official, index) => {
                                return (
                                    <tr key={index} className="border-black border-opacity-50 border-2">
                                        <td className={"border px-8 py-4" + (index === officials.length - 1 ? " border-separate rounded-bl-2xl" : "")}>{official["id"]}</td>
                                        <td className="border px-8 py-4">{official["managerName"]}</td>
                                        <td className="border px-8 py-4"><span className="italic">{official["managerEmail"]}</span></td>
                                        {official["managerRole"] === "0" ?
                                            <td className="border items-center" >
                                                <span className="bg-purple-100 rounded-xl p-2 w-fit text-[#1d0e3a]">Teacher</span>
                                            </td> :
                                            official["managerRole"] === "1" ?
                                                <td className="border items-center">
                                                    <span className="bg-blue-100 rounded-xl p-2 text-[#0e1d3a]">Admin</span>
                                                </td> :
                                                <td className="border items-center">
                                                    <span className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f]">Unknown</span>
                                                </td>
                                        }

                                        {
                                            official["accountStatus"] === "1" ? <td className={"border items-center"} >
                                                <span className="bg-green-100 rounded-xl p-2 w-fit text-[#21430e]">Active</span>
                                            </td> : official["accountStatus"] === "0" ? <td className={"border items-center"}>
                                                <span className="bg-yellow-100 rounded-xl p-2 w-fit text-[#544a15]">Waitlist</span>
                                            </td> : official["accountStatus"] === "2" ? <td className={"border items-center"}>
                                                <span className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f]">Blocked</span>
                                            </td> : <td className={"border items-center"}>
                                                <span className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f]">Unknown</span>
                                            </td>
                                        }

                                        {
                                            official["accountStatus"] === "2" ? <td className={"border items-center p-2" + (index === officials.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button className="bg-green-100 rounded-xl p-2 w-fit text-[#21430e] flex flex-row"><span className="material-icons mr-2">verified</span>{"Activate"}</button>
                                            </td> : official["accountStatus"] === "1" ? <td className={"border items-center p-2" + (index === officials.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f] flex flex-row"><span className="material-icons mr-2">dangerous</span>{"Deactivate"}</button>
                                            </td> : <td className={"border items-center" + (index === officials.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button className="bg-gray-100 rounded-xl p-2 w-fit text-[#5e5e5e] hover:cursor-not-allowed">No Action</button>
                                            </td>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        )}
        <Toast ref={toast} position="bottom-center" />
    </>
}