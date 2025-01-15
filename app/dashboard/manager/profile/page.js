"use client";

import { useEffect, useState, useRef } from "react";
import secureLocalStorage from "react-secure-storage";
import Link from "next/link";
import Image from "next/image";
import { Toast } from "primereact/toast";
import { LoadingScreen } from "@/util/LoadingScreen/LoadingScreen";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const toast = useRef(null);

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

  const showToast = (message, severity) => {
    if (toast.current) {
      toast.current.show({ severity, summary: severity.toUpperCase(), detail: message, life: 3000 });
    }
  };

  if (!profileData) {
    return <LoadingScreen />
  }

  return (
    <>
      <main className="mb-16" data-aos="fade-in">

      <header className="relative inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="lg:flex lg:gap-x-12">
            <Link href={"/dashboard/manager"}>
              <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
            </Link>
          </div>
          <div className="flex lg:flex lg:flex-1 lg:justify-end">
            <Link href={"/dashboard/manager"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
              <span className="material-icons">home</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative mt-3">
        <div
          className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20" />
        </div>
        <div className="bg-white/50 p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h1 className="text-4xl font-bold">{profileData.name}</h1>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${profileData.accountStatus === "1" ? "bg-green-100 text-green-700" : profileData.accountStatus === "0" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
          >
            {profileData.accountStatus === "1" ? "Active" : profileData.accountStatus === "0" ? "Blocked" : "Waitlisted"}
          </span>
            <div className="mt-6">
              <p className="text-gray-700">
                <strong>ID:</strong> {profileData.id}
              </p>

              <p className="text-gray-700">
                <strong>Email:</strong> {profileData.email}
              </p>

              <p className="text-gray-700">
                <strong>Role: </strong>    
                  {profileData.role === "0" ? "Professor" : profileData.role === "1" ? "Administrator" : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Toast ref={toast} position="bottom-center" />
    </>
  );
}
