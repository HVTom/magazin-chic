'use client'
import Link from 'next/link';
import axios, { AxiosError } from "axios";
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const links = [
  {
    name: 'Comenzi',
    href: '/account/orders',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  },
  // {
  //   name: 'Favorite',
  //   href: '/account/favorites',
  //   icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  //     <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  //   </svg>
  // },
  {
    name: 'Date personale',
    href: '/account/personal_data',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  },
];

async function getUser() {
  try {
    const { data } = await axios.get("../../api/account");
    console.log("getUser data: ", data)
    return {
      user: data.user,
      error: null,
    };
  } catch (e) {
    console.log("getUser error: ", e);
    return {
      user: null,
      error: e,
    };
  }
}

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);


  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
      console.log("User data inside account layout: ", user);

      if (error) {
        router.push("/login");
        return;
      }

      // if the error did not happen, if everything is alright
      setIsSuccess(true);
      router.push("/account");

    })();
  }, [router.push]);


  if (!isSuccess) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    )
  }

  // TWEAK THE order card resizing
  return (
    <div className="my-12">
      <h1 className="flex justify-center text-3xl font-semibold mb-12">Contul meu</h1>

      <div className="flex flex-col md:flex-row md:justify-center md:mx-20">
        {/* Left sidebar */}
        <div className="w-full md:w-2/6 px-3 bg-white h-full mx-2">
          {/* <h3 className="text-2xl p-2">Salut, user!</h3> */}

          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <div className={`flex flex-row items-center justify-between my-12 hover:bg-gray-200 hover:cursor-pointer px-2 py-2 ${currentPath === link.href ? 'bg-gray-200' : ''}`}>
                <div className="flex flex-row justify-start">
                  {link.icon} {/* Render the SVG icon here */}
                  <p className="text-xl ml-2">{link.name}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>

              </div>
            </Link>
          ))}
        </div>

        {/* Right section with details */}
        <div className="w-full md:w-4/6 px-3 bg-white mt-8 md:mt-0 mx-2">{children}</div>
      </div>
    </div>
  );
}


export default AccountLayout;