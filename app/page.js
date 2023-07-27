"use client";

import Image from 'next/image'
import Link from 'next/link'
import 'material-icons/iconfont/material-icons.css';
import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

export default function Home() {

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = secureLocalStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  return (
    loading ? (
      <>
        <header className="bg-white flex px-4">
          <div className="w-full flex flex-row justify-center align-middle items-center m-2">
            <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
            <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
            <Link href={"/login"} className="ml-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9]">
              <span className="material-icons mx-1">login</span>
              {"Login"}
            </Link>
          </div>
        </header>
        <div className="flex flex-col justify-center items-center align-middle mt-[25%]">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-repeat animate-spin" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
          </svg>
          <p className="text-xl">Loading...</p>
        </div>
      </>
    ) : currentUser ?
      (
        <main>
          <header className="bg-white flex px-4">
            <div className="w-full flex flex-row justify-center align-middle items-center m-2">
              <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
              <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
              <button className="ml-auto bg-[#f79f9f] text-[#400101] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#ffc9c9]">
                <span className="material-icons mx-1">logout</span>
                {"Logout"}
              </button>
            </div>
          </header>

          <h1 className="text-2xl font-bold ml-4 mt-4">Welcome {currentUser.fullName}</h1>
        </main>
      ) :

      <main>
        <header className="bg-white flex px-4">
          <div className="w-full flex flex-row justify-center align-middle items-center m-2">
            <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
            <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
            <Link href={"/login"} className="ml-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9]">
              <span className="material-icons mx-1">login</span>
              {"Login"}
            </Link>
          </div>
        </header>

        <div className="flex flex-col justify-center items-center align-middle mt-[25%]">
          <h1>You have to login to proceed.</h1>
          <br />
          <Link href={"/login"} className="ml-auto mr-auto bg-[#c7f79f] text-[#0d4001] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#e5ffc9]">
            <span className="material-icons mx-1">login</span>
            {"Login"}
          </Link>
        </div>
      </main>
  )
}
