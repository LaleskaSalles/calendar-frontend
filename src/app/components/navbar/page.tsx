'use client'

import MyContext from "@/contextAPI/myContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from 'react';


const Navbar = () => {
    const router = useRouter()
    const contextValue = useContext(MyContext);

    const { logout, tokenLocal } = contextValue || {}

    const handleLogout = () => {
        if (logout) {
            logout();
            router.push('/');
        }
    };
    useEffect(() => {
        if (tokenLocal === '') {
            router.push('/')
        }
    }, [])
    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">

                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <h1 className="self-center text-xl font-semibold whitespace-nowrap text-[#0F2A50] dark:text-white">Calendar</h1>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <p className="text-sm font-medium text-[#0F2A50] dark:text-gray-400">{'Welcome to Calendar'}</p>
                        <a href="#" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
                            onClick={handleLogout}
                        >Logout</a>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navbar;
