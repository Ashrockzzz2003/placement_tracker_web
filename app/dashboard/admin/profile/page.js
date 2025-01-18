"use client";

import { useEffect, useState, useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import { ProfilePage } from "@/util/ProfilePage";
import { Toast } from "primereact/toast";

export default function ProfilePageRender() {
    const [profileData, setProfileData] = useState(null);
    const toast = useRef(null);

    const showToast = (message, severity) => {
        if (toast.current) {
            toast.current.show({
                severity,
                summary: severity.toUpperCase(),
                detail: message,
                life: 3000,
            });
        }
    };

    useEffect(() => {
        const storedProfile = secureLocalStorage.getItem("currentUser");
        if (storedProfile) {
            const userProfile = JSON.parse(storedProfile);
            setProfileData({
                name: userProfile.managerName,
                email: userProfile.managerEmail,
                role: userProfile.managerRole,
                id: userProfile.managerId,
                accountStatus: userProfile.accountStatus,
            });
        } else {
            showToast("Profile Data not found!", "error");
        }
    }, []);

    const roleInfo = {
        dashboardPath: "/dashboard/admin",
        roleName: "Administrator",
    };

    return (
        <>
            <ProfilePage profileData={profileData} roleInfo={roleInfo} />
            <Toast ref={toast} position="bottom-center" />
        </>
    );
}
