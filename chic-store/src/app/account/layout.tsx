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
  {
    name: 'Date personale',
    href: '/account/personal_data',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
  },
  {
    name: 'Acțiuni Cont',
    href: '/account/actions',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
  }, [router]);


  if (!isSuccess) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className="text-3xl font-bold">Se încarcă...</h1>
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