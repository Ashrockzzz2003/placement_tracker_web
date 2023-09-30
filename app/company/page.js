"use client";

import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";
import { GET_COMPANY_DATA_URL } from "@/util/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompanyStats() {
    const [companyHireData, setCompanyHireData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // set data structure
    const [sectionData, setSectionData] = useState({});

    useEffect(() => {
        fetch(GET_COMPANY_DATA_URL, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer v4.public.eyJ1c2VyRW1haWwiOiJhc2hyb2Nrenp6MjAwM0BnbWFpbC5jb20iLCJ1c2VyUm9sZSI6IjEiLCJzZWNyZXRfa2V5IjoiRSQjXiEkJSFeJCohJChVSElBTkpLZm5ramFzbmZrYW5zZGtsYW5ka09JSkooKSNRJCkzNDI0MzQzMjQ0MjQzbzR1cTA0MDl1cXVqSU9ES1FKTkhET0xRSk5ESVVITyM5ODR1MzIwNDgwMjR1aGl1c2pKQWJkc2FmZGpzYWZoYkJiaEJGQlZIRkZJV0pSUU85VTQzMjQzMjg0MzI0MzI4NE9JUUpGS0pOSkJBSEZCKigkISkoJCohKCohJCMoJCojISgkJiFIQUZLQUZKQkFIRkJBRkRBQkhGQkFTU0ZCQVNGSEFGQUhGQkhBQkZIQURCRkUkI14hJCUhXiQqISQoVUhJQU5KS2Zua2phc25ma2Fuc2RrbGFuZGtPSUpKKCkjUSQpM280dXEwNDA5dXF1aklPREtRSk5IRE9MUUpORElVSE8jOTg0dTMyMDQ4MDI0dWhpdXNqSkFiZHNhZmRqc2FmaGJCYmhCRkJWSEZGSVdKUlFPOVU0MzI0MzI4NDMyNDMyODRPSVFKRktKTkpCQUhGQiooJCEpKCQqISgqISQjKCQqIyEoJCYhSEFGS0FGSkJBSEZCQUZEQUJIRkJBRSQjXiEkJSFeJCohJChVSElBTkpLZm5ramFzbmZrYW5zZGtsYW5ka09JSkooKSNRJCkzNTY1MzY0MzI0MjQzNDEjOTg0dTMyMDQ4MDI0dWhpdXNqSkFiZHNhZmRqc2FmaGJCYmhCRkJWSEZGSVdKUlFPOVU0MzI0MzI4NDMyNDMyODRPSVFKRktKTkpCQUhGQiooJCEpKCQqISgqISQjKCQqIyEoJCYhSEFGS0FGSkJBSEZCQUZEQUJIRkJBU1NGQkFTRkhBRkFIRkJIQUJGSEFEQkZTU0ZCQUUkI14hJCUhXiQqISQoVUhJQU5KS2Zua2phc25ma2Fuc2RrbGFuZGtPSUpKKCkjUSQpM280dXEwNDA5dXF1aklPREtRSk5IRE9MUUpORElVSE8jOTg0dTMyMDQ4MDI0dWhpdXNqSkFiZHNhZmRqc2FmaGJCYmhCRkJWSEZGSVdKUlFPOVU0MzI0MzI4NDMyNDMyODRPSVFKRktKTkpCQUhGQiooJCEpKCQqISgqISQjKCQqIyEoJCYhSEFGS0FGSkJBSEZCQUZEQUJIRkJBU1NGQkFTRkhBRkFIRkJIQUJGSEFEQkZFJCNeISQlIV4kKiEkKFVISUFOSktmbmtqYXNuZmthbnNka2xhbmRrT0lKSigpI1EkKTNvNHVxMDQwOXVxdWpJT0RLUUpOSERPTFFKTkRJVUhPIzk4NHUzMjA0ODAyNHVoaXVzakpBYmRzYWZkanNhZmhiQmJoQkZCVkhGRklXSlJRTzlVNDMyNDMyODQzMjQzMjg0T0lRSkZLSk5KQkFIRkIqKCQhKSgkKiEoKiEkIygkKiMhKCQmIUhBRktBRkpCQUhGQkFGREFCSEZCQVNTRkJBU0ZIQUZBSEZCSEFCRkhBREJGU0ZIQUZBSEZCSEFCRkhBREUkI14hJCUhXiQqISQoVUhJQU5KS2Zua2phc25ma2Fuc2RrbGFuZGtPSUpKKCkjUSQpM280dXEwNDA5dXF1aklPREtRSk5IRE9MUUpORSQjXiEkJSFeJCohJChVSElBTkpLZm5ramFzbmZrYW5zZGtsYW5ka09JSkooKSNRJCkzbzR1cTA0MDl1cXVqSU9ES1FKTkhET0xRSk5ESVVITyM5ODR1MzIwNDgwMjR1aGl1c2pKQWJkc2FmZGpzYWZoYkJiaEJGQlZIRkZJV0pSUU85VTQzMjQzMjg0MzI0MzI4NE9JUUpGS0pOSkJBSEZCKigkISkoJCohKCohJCMoJCojISgkJiFIQUZLQUZKQkFIRkJBRkRBQkhGQkFTU0ZCQVNGSEFGQUhGQkhBIiwiaWF0IjoiMjAyMy0wOS0zMFQxMTo0OTozNi41ODBaIiwiZXhwIjoiMjAyMy0wOS0zMFQxMzo0OTozNi41ODBaIn0GRb2E9kL_mC-JYksHn-N615joWbbtAkOppKTR2sIjuUpglvTRBAMwNRiPl768I62xHPsqujq17kVzfKqZlvcN"
            },
            method: "GET"
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then((data) => {
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

            setSectionData(sortedSectionOptions);
            setCompanyHireData(finalData);
            setIsLoading(false);
        })
    }, []);


    return isLoading || companyHireData === null ? <LoadingScreen /> : (
        <table className="text-center border">
            <thead>
                <tr className="p-2 border">
                    <th className="p-2 border" rowSpan={2}>Company Name</th>
                    <th className="p-2 border" rowSpan={2}>Job Role</th>
                    <th className="p-2 border" rowSpan={2}>CTC</th>
                    <th className="p-2 border" colSpan={Object.keys(sectionData).length}>Section</th>
                    <th className="p-2 border" rowSpan={2}>Total Hires</th>
                </tr>
                {Object.keys(sectionData).map((section, index) => {
                    return (
                        <th className="p-2 border" key={index}>{section}</th>
                    );
                })}
            </thead>
            <tbody>
                {companyHireData.map((data, index) => {
                    let totalHires = 0;

                    return (
                        <tr className="p-2 border" key={index}>
                            <td className="p-2 border"><Link href={`/company/${data.companyId}`} className="underline">{data.companyName}</Link></td>
                            <td className="p-2 border">{data.jobRole}</td>
                            <td className="p-2 border">{data.ctc}</td>
                            {Object.keys(sectionData).map((section, index) => {
                                totalHires += data.sectionData[section] === undefined ? 0 : data.sectionData[section];
                                return (
                                    <td className="p-2 border" key={index}>{data.sectionData[section] === undefined ? 0 : data.sectionData[section]}</td>
                                );
                            })}
                            <td className="p-2 border">{totalHires}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>

    )
}