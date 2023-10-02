"use client";

import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import 'material-icons/iconfont/material-icons.css';
import { GET_TOP_5_PLACEMENTS_URL } from "@/util/constants";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import Top5PlacementCard from "@/util/Top5PlacementCard";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";


export default function AdminDashboard() {
    const [managerEmail, setManagerEmail] = useState("");
    const [managerName, setManagerName] = useState("");
    const [managerRole, setManagerRole] = useState("");
    const [managerId, setManagerId] = useState("");
    const [accountStatus, setAccountStatus] = useState("");
    const [userAccess, setUserAccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [top5Placements, setTop5Placements] = useState([]);

    const toast = useRef(null);

    const router = useRouter();

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
        let manager = secureLocalStorage.getItem("currentUser");

        if (manager) {
            manager = JSON.parse(manager);
            setManagerEmail(manager.managerEmail);
            setManagerName(manager.managerName);
            setManagerRole(manager.managerRole);
            setManagerId(manager.id);
            setAccountStatus(manager.accountStatus);
        }

        fetch(GET_TOP_5_PLACEMENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setTop5Placements(data["placements"]);
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
        });

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });

        setIsLoading(false);
    }, [router]);

    return <>
        {isLoading || userAccess === null || userAccess === undefined || managerEmail === "" || managerName === "" || managerRole === "" || managerId === "" || accountStatus === "" || top5Placements === undefined || top5Placements === null ? (
            <LoadingScreen />
        ) : (
            <main>
                <div data-aos="fade-in">
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/dashboard/admin"}>
                                    <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="flex lg:flex lg:flex-1 lg:justify-end">
                                <Link href={"/dashboard/admin/profile"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 ">
                                    <span className="material-icons">person</span>
                                </Link>
                                <button onClick={
                                    () => {
                                        secureLocalStorage.removeItem("currentUser");
                                        secureLocalStorage.removeItem("userAccess");
                                        router.replace("/login");
                                    }
                                } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 ml-2">
                                    {"Logout"}
                                    <span className="material-icons ml-2">logout</span>
                                </button>
                            </div>
                        </nav>
                    </header>


                    <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                        <div
                            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
                            />
                        </div>

                        <div className="mx-auto max-w-2xl py-16 lg:py-24">
                            <div className="sm:mb-2 flex justify-center text-center">
                                <Link href={"https://www.amrita.edu"} target='_blank'><div className="relative rounded-full px-3 py-1 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                    Administrator
                                </div></Link>
                            </div>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    {"Welcome"}
                                </h1>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    {managerName}
                                </h1>
                            </div>
                        </div>

                        <h1 className="text-3xl text-center mb-2">Quick Actions</h1>
                        <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                            <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-fit max-w-4/5">
                                <h1 className="px-4 pt-2 text-[#1d0e3a] text-center text-xl">Manage Placements</h1>
                                <hr className="w-full border-[#1d0e3a] my-2" />
                                <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                    <Link href="/dashboard/admin/placement">
                                        <div className="bg-purple-100 text-[#1d0e3a] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons mr-2">work</span>
                                            {"All Placements"}
                                        </div>
                                    </Link>
                                    <Link href={"/dashboard/admin/placement/new"}>
                                        <div className="bg-purple-100 text-[#1d0e3a] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons">add</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 ">
                                <h1 className="px-4 pt-2 text-[#21430e] text-center text-xl">Manage Officials</h1>
                                <hr className="w-full border-[#21430e] my-2" />
                                <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                    <Link href="/dashboard/admin/official">
                                        <button className="bg-green-100 text-[#21430e] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons mr-2">manage_accounts</span>
                                            {"All Officials"}
                                        </button>
                                    </Link>
                                    <button>
                                        <div className="bg-green-100 text-[#21430e] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons">add</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 ">
                                <h1 className="px-4 pt-2 text-[#403914] text-center text-xl">Manage Students</h1>
                                <hr className="w-full border-[#544a15] my-2" />
                                <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                    <Link href="/dashboard/admin/student">
                                        <button className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons mr-2">badge</span>
                                            {"All Students"}
                                        </button>
                                    </Link>
                                    <button>
                                        <div className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons">add</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 ">
                                <h1 className="px-4 pt-2 text-[#461348] text-center text-xl">Manage Companies</h1>
                                <hr className="w-full border-[#461348] my-2" />
                                <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                    <Link href="/dashboard/company/student">
                                        <button className="bg-pink-100 text-[#461348] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons mr-2">badge</span>
                                            {"All Companies"}
                                        </button>
                                    </Link>
                                    <button>
                                        <div className="bg-pink-100 text-[#461348] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                            <span className="material-icons">add</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl text-center mb-2">Top Placements</h1>
                        <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                            {top5Placements.length === 0 ? (
                                <div className='border border-red-50 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-red-200'>
                                    <p className="p-8 text-center text-red-900">No placements yet</p>
                                </div>
                            ) : (
                                top5Placements.map((placement, index) => {
                                    return (
                                        <Top5PlacementCard placementData={placement} key={index} />
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        )}
        <Toast ref={toast} position="bottom-center" />
    </>
}