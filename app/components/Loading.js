"use client";

import Image from "next/image";
import Link from "next/link";

export default function Loading() {
    return (<>
        <header className="bg-white flex px-4">
            <Link href={"/"} className="w-full flex flex-row justify-center align-middle items-center m-2 my-4">
                <Image src="/logo.png" alt="Amrita logo" width={80} height={80} />
                <h1 className="text-2xl font-bold ml-4">Placement Tracker</h1>
            </Link>
        </header>
        <div className="flex flex-col justify-center items-center align-middle mt-[25%]">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-repeat animate-spin" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
            </svg>
            <p className="text-xl">Loading...</p>
        </div>
    </>);
}