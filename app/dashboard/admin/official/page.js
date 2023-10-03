"use client";
import Aos from "aos";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
import "aos/dist/aos.css";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GET_REGISTERED_OFFICIALS_URL, TOGGLE_ACCOUNT_STATUS_URL } from "@/util/constants";
import secureLocalStorage from "react-secure-storage";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { Toast } from "primereact/toast";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "@/util/SearchBar";
import { SelectButton } from "primereact/selectbutton";

export default function AllOfficialsScreen() {
    const [officials, setOfficials] = useState([]);
    const [officialsFiltered, setOfficialsFiltered] = useState([]);
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
                        setOfficialsFiltered(data["managers"]);
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

    const toggleAccountStatus = async (e, managerId, accountStatus) => {
        setIsLoading(true);
        e.preventDefault();
        if (userAccess === null || userAccess === undefined) {
            alertError("Session Expired", "Please login again to continue.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 3000);

        } else {
            try {
                const response = await fetch(TOGGLE_ACCOUNT_STATUS_URL, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("userAccess"),
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "managerId": managerId,
                        "accountStatus": accountStatus
                    })
                });

                const data = await response.json();

                if (response.status === 200) {
                    if (data["accountStatus"] !== undefined) {
                        setOfficials(officials.map((manager) => {
                            if (manager["id"] === managerId) {
                                manager["accountStatus"] = accountStatus;
                            }
                            return manager;
                        }));
                        setOfficialsFiltered(officials);
                        alertSuccess("Success", "Account Status updated successfully.");
                    } else {
                        alertError("Error", "Something went wrong. Please try again later.");
                    }
                } else if (response.status === 401) {
                    secureLocalStorage.clear();
                    alertError("Session Expired", "Please login again to continue.");
                    setTimeout(() => {
                        router.replace("/login");
                    }, 3000);
                } else if (data["message"] !== undefined) {
                    alertError("Error", data["message"]);
                } else {
                    alertError("Error", "Something went wrong. Please try again later.");
                }

            } catch (err) {
                console.log(err);
                alertError("Error", "Something went wrong. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const [searchText, setSearchText] = useState("");

    const roleOptions = ["Teacher", "Admin", "Unknown"];
    const [roleValue, setRoleValue] = useState(null);
    const [role, setRole] = useState(null);

    const statusOptions = ["Active", "Waitlist", "Blocked", "Unknown"];
    const [statusValue, setStatusValue] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (officials.length) {
            setOfficialsFiltered(officials.filter((official) => {
                return (official["managerName"].toLowerCase().includes(searchText.toLowerCase()) || official["managerEmail"].toLowerCase().includes(searchText.toLowerCase()) || official["id"].toString().includes(searchText)) &&
                    (role === null ? true : official["managerRole"] === role) &&
                    (status === null ? true : official["accountStatus"] === status);
            }));
        }
    }, [officials, searchText, role, status])




    return <>
        {isLoading ? <LoadingScreen /> : (
            <main className="mb-16" data-aos="fade-in">
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

                    <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray my-16">
                        <h1 className="text-xl font-bold text-center p-2">Power Search</h1>

                        <hr className="w-full border-bGray" />


                        <Searchbar onChange={
                            (value) => setSearchText(value)
                        } placeholderText={"Manager Name or Email or ID"} />

                        <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row">
                            <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                <SelectButton value={roleValue} onChange={(e) => {
                                    setRoleValue(e.value);
                                    setRole(e.value === "Teacher" ? "0" : e.value === "Admin" ? "1" : e.value === "Unknown" ? "2" : null);
                                }} options={roleOptions} />
                            </div>

                            <div className="border-bGray p-4 xl:border-b-0 xl:border-r">
                                <SelectButton value={statusValue} onChange={(e) => {
                                    setStatusValue(e.value);
                                    setStatus(e.value === "Active" ? "1" : e.value === "Waitlist" ? "0" : e.value === "Blocked" ? "2" : null);
                                }} options={statusOptions} />
                            </div>
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
                            {officialsFiltered.length === 0 ? (
                                <tr>
                                    <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={6}>No Data Found</td>
                                </tr>
                            ) : (
                                officialsFiltered.map((official, index) => {
                                return (
                                    <tr key={index} className="border-black border-opacity-50 border-2">
                                        <td className={"border px-8 py-4" + (index === officialsFiltered.length - 1 ? " border-separate rounded-bl-2xl" : "")}>{official["id"]}</td>
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
                                            official["accountStatus"] === "2" ? <td className={"border flex justify-center items-center p-2" + (index === officialsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button onClick={(e) => toggleAccountStatus(e, official["id"], "0")} className="bg-green-100 rounded-xl p-2 w-fit text-[#21430e] flex flex-row"><span className="material-icons mr-2">verified</span>{"Activate"}</button>
                                            </td> : official["accountStatus"] === "1" ? <td className={"border flex justify-center items-center p-2" + (index === officialsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button onClick={(e) => toggleAccountStatus(e, official["id"], "2")} className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f] flex flex-row"><span className="material-icons mr-2">dangerous</span>{"Block"}</button>
                                            </td> : official["accountStatus"] === "0" ? <td className={"border flex justify-center items-center p-2" + (index === officialsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button onClick={(e) => toggleAccountStatus(e, official["id"], "2")} className="bg-red-100 rounded-xl p-2 w-fit text-[#320f0f] flex flex-row"><span className="material-icons mr-2">dangerous</span>{"Block"}</button>
                                            </td> : <td className={"border flex justify-center items-center" + (index === officialsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <button className="bg-gray-100 rounded-xl p-2 w-fit text-[#5e5e5e] hover:cursor-not-allowed">No Action</button>
                                            </td>
                                        }
                                    </tr>
                                );
                            }))}
                        </tbody>
                    </table>
                </div>
            </main>
        )}
        <Toast ref={toast} position="bottom-center" />
    </>
}