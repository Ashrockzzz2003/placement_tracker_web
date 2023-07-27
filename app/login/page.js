'use client';

import { useState } from 'react';
import Image from 'next/image';
import secureLocalStorage from 'react-secure-storage';
import { LOGIN_URL } from '../constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(userEmail);

  const isValidPassword = userPassword.length >= 8;

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail,
          userPassword: userPassword,
        })
      });

      if (res.status != 200) {
        alert("Invalid credentials. Please try again.");
        return;
      } else {
        const data = await res.json();
        
        secureLocalStorage.setItem("SECRET_TOKEN", data.SECRET_TOKEN);
        secureLocalStorage.setItem("currentUser", data);

        router.push('/');
      }

    } catch (error) {
      alert("Something went wrong. Please try again later.")
      return;
    }
  }

  return (
      <div className='flex h-screen flex-1 flex-col justify-center'>
        <div className="border border-bGray rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md bg-white">
          <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
            <Image src="/logo.png" alt="BHEL logo" width={128} height={128} className='ml-auto mr-auto my-2' />
            <hr className=' w-full' />
            {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Sign In
          </h2> */}
          </div>
          <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
            <div className='flex flex-row justify-center'>
              <button type='button' className='px-4 py-4 w-full text-2xl font-semibold'> Login </button>
            </div>
            <hr className=' w-full' />
          </div>

          <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-12 lg:px-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-md font-medium leading-6 text-black">
                  Email ID
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder='Enter your Email ID'
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                      (!isValidEmail && userEmail ? ' ring-red-500' : isValidEmail && userEmail ? ' ring-green-500' : ' ring-bGray')}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-md font-medium leading-6 text-black">
                    Password
                  </label>
                  <div className="text-md">
                    <a href="#" className="font-semibold text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder='Enter your Password'
                    className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userPassword ? ' ring-red-500' : isValidPassword && userPassword ? ' ring-green-500' : ' ring-bGray')}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p className="mt-10 text-center text-md text-gray-500">
                {"Don't have an account? "}
                <Link className="font-semibold leading-6 text-blue-600 hover:underline" href="/register">Register</Link>
              </p>

              <div>
                <input
                  value="Sign in"
                  type="submit"
                  disabled={!isValidEmail || !isValidPassword}
                  className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
