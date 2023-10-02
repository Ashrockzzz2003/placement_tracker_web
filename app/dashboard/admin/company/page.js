"use client";

import { GET_COMPANY_DATA_URL } from "@/util/constants";
import Aos from "aos";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'material-icons/iconfont/material-icons.css';
import "aos/dist/aos.css";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { Toast } from "primereact/toast";
import Link from "next/link";
import Image from "next/image";

export default function AllCompaniesScreen() {
    const [companyHireData, setCompanyHireData] = useState([]);
    const [companyHireDataFiltered, setCompanyHireDataFiltered] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");

    const [sectionData, setSectionData] = useState({});

    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("userAccess"));

        if (secureLocalStorage.getItem("userAccess") === null || secureLocalStorage.getItem("userAccess") === undefined) {
            secureLocalStorage.clear();
            alertError("Session Expired", "Please login again to continue.");
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        } else {
            fetch(GET_COMPANY_DATA_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${secureLocalStorage.getItem("userAccess")}`
                },
                method: "GET"
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        data = data["companyHireData"];
                        let finalData = [];
                        let k = -1;

                        let sectionOptions = {};

                        for (let i = 0; i < data.length; i++) {
                            if (sectionOptions[data[i]["studentSection"]] === undefined) {
                                sectionOptions[data[i]["studentSection"]] = 1;
                            } else {
                                sectionOptions[data[i]["studentSection"]] += 1;
                            }

                            if (i > 0 && finalData[k].companyId === data[i]["companyId"] && finalData[k].ctc === data[i]["ctc"] && finalData[k].jobRole === data[i]["jobRole"]) {
                                finalData[k].sectionData[data[i]["studentSection"]] = data[i]["totalHires"];
                            } else {
                                finalData.push({
                                    "companyId": data[i]["companyId"],
                                    "companyName": data[i]["companyName"],
                                    "ctc": data[i]["ctc"],
                                    "jobRole": data[i]["jobRole"],
                                    "sectionData": JSON.parse(`{"${data[i]["studentSection"]}": ${data[i]["totalHires"]}}`),
                                });
                                k += 1;
                            }
                        }

                        // sort keys
                        let keys = Object.keys(sectionOptions);
                        keys.sort();

                        let sortedSectionOptions = {};
                        keys.forEach((key) => {
                            sortedSectionOptions[key] = sectionOptions[key];
                        });

                        const groupedData = finalData.reduce((acc, obj) => {
                            const key = obj.companyId;
                            if (!acc[key]) {
                                acc[key] = {
                                    companyId: obj.companyId,
                                    companyName: obj.companyName,
                                    recruitData: [
                                        {
                                            "jobRole": obj.jobRole,
                                            "ctc": obj.ctc,
                                            "sectionData": obj.sectionData
                                        }
                                    ]
                                };
                            } else {
                                acc[key].recruitData.push({
                                    "jobRole": obj.jobRole,
                                    "ctc": obj.ctc,
                                    "sectionData": obj.sectionData
                                });
                            }

                            return acc;
                        }, {});

                        console.log(groupedData);
                        console.log(Object.values(groupedData));

                        finalData = Object.values(groupedData);

                        setSectionData(sortedSectionOptions);
                        setCompanyHireData(finalData);
                        setCompanyHireDataFiltered(finalData);
                        setIsLoading(false);
                    })
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
            });
        }

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });
    }, [router]);

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
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
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
                                    {"Company Data"}
                                </h1>
                            </div>
                        </div>

                        <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                            <thead className="border-0 text-lg font-medium">
                                <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                    <th className="px-4 py-2 rounded-tl-2xl border-black" rowSpan={2}>Company Name</th>
                                    <th className="px-4 py-2 border-black" rowSpan={2}>Job Role</th>
                                    <th className="px-4 py-2 border-black" rowSpan={2}>CTC</th>
                                    <th className="px-4 py-2 border-b-black" rowSpan={1} colSpan={Object.keys(sectionData).length}>Section</th>
                                    <th className="px-4 py-2 border-black rounded-tr-2xl" rowSpan={2}>Total Hires</th>
                                </tr>

                                <tr className="bg-black text-white bg-opacity-90">
                                    {Object.keys(sectionData).map((section, index) => {
                                        return (
                                            <th className="px-4 py-2 border-black" key={index}>{section}</th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {companyHireDataFiltered.length === 0 ? (
                                    <tr>
                                        <td className="border border-gray-200 rounded-b-2xl px-4 py-8 text-center text-lg" colSpan={5}>No Data Found</td>
                                    </tr>
                                ) : (
                                    companyHireDataFiltered.map((data, index) => {
                                        let totalHires = 0;

                                        return [
                                            (
                                                <tr key={index}>
                                                    <td className={"border border-gray-200 px-4 py-2" + (index === companyHireDataFiltered.length - 1 ? "border-separate rounded-bl-2xl" : "")} rowSpan={data.recruitData.length + 1}>{data.companyName}</td>
                                                </tr>
                                            ),
                                            (
                                                data.recruitData.map((pdata, pindex) => {
                                                    return (
                                                        <tr key={pindex}>
                                                        <td className="border border-gray-200 px-4 py-2">{pdata.jobRole}</td>
                                                        <td className="border border-gray-200 px-4 py-2">{pdata.ctc}</td>
                                                        {Object.keys(sectionData).map((section, sindex) => {
                                                            totalHires += pdata.sectionData[section] === undefined ? 0 : pdata.sectionData[section];
                                                            return (
                                                                <td className="border border-gray-200 px-4 py-2" key={sindex}>{pdata.sectionData[section] === undefined ? 0 : pdata.sectionData[section]}</td>
                                                            );
                                                        })}
                                                        <td className={"border border-gray-200 px-4 py-2" + (index === companyHireDataFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>{totalHires}</td>
                                                    </tr>
                                                    );
                                                })
                                            )
                                        ];
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            )}

            <Toast ref={toast} position="bottom-center" />
        </>
    );
}