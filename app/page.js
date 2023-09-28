"use client"

import Image from 'next/image'
import Link from 'next/link'
import 'material-icons/iconfont/material-icons.css';

export default function Welcome() {
  return (
    <main>
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="lg:flex lg:gap-x-12">
              <Link href={"/"}>
                <Image src="/logo.png" alt="Amrita logo" width={128} height={128} className='ml-auto mr-auto my-4' />
              </Link>
            </div>
            <div className="lg:flex lg:flex-1 lg:justify-end">
              <Link href={"/login"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                <span className="material-icons">login</span>
              </Link>
            </div>
          </nav>
        </header>



        <div className="relative isolate px-6 lg:px-8 flex justify-center items-center h-screen m-auto pt-16">
          <div
            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cea8a8] to-[#dea9a9] opacity-20"
            />
          </div>

          <div className="mx-auto max-w-2xl py-48 lg:py-56">
            <div className="sm:mb-8 flex justify-center text-center">
              <div className="relative rounded-full px-3 py-1 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Amrita Vishwa Vidyapeetham, Coimbatore
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Amrita Placement Tracker
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                One-stop platform to track all placement-related information of CSE Department, Amrita Vishwa Vidyapeetham, Coimbatore. Register to get started. Sign In to access your dashboard if you are already registered.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href={"/login"} className="bg-[#000000] text-[#ffffff] rounded-lg items-center align-middle flex flex-row hover:bg-[#202020] text-lg px-2 py-1">
                  <span className="material-icons mr-2">login</span>
                  {"Sign In"}
                </Link>
                <Link href="/register" className="text-lg font-semibold text-gray-900 items-center align-middle flex flex-row  border border-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">
                  <span className="material-icons mr-2">app_registration</span>
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}