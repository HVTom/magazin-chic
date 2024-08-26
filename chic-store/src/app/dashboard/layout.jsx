'use client'
import Link from 'next/link';
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';



const links = [
  {
    name: 'Data Management',
    href: '/dashboard/data-management',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  },
  {
    name: 'Comenzi',
    href: '/dashboard/invoices',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  },
  {
    name: 'Cont',
    href: '/dashboard/admin_acc',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  },
];

async function getUser() {
  try {
    const { data } = await axios.get("../../api/account");
    console.log("getUser data inside dashboard: ", data)
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

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    async function checkUser() {
      const { user, error } = await getUser();
      if (error || !user) {
        router.push("/login");
        return;
      }
      if (user.role !== "admin") {
        router.push("/login");
        return;
      }
      setIsSuccess(true);
    }
    checkUser();
  }, [router]);


  if (!isSuccess) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className="text-3xl font-bold">Se încarcă...</h1>
      </div>
    )
  }


  return (
    <div className="my-12">
      <h1 className="flex justify-center text-3xl font-semibold mb-12">Dashboard</h1>

      <div className="flex flex-col md:flex-row md:justify-center md:mx-20">
        {/* Left sidebar */}
        <div className="w-full md:w-1/4 px-3 bg-white h-full mx-2"> {/* Adjusted width */}
          <h3 className="text-2xl p-2">Salut, Admin!</h3>

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
        <div className="w-full md:w-3/4 px-3 bg-white mt-8 md:mt-0 mx-2">{children}</div> {/* Adjusted width */}
      </div>
    </div>
  );
}

export default DashboardLayout;