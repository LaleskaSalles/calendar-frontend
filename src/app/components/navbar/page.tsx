'use client'

import { useRouter } from "next/navigation";
import { useAuthStore } from '@/app/stores/authStore';
import { MouseEvent } from 'react';


const Navbar = () => {
    const { nameUser } = useAuthStore();
    const router = useRouter();
    const { logout } = useAuthStore();

    const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    
        logout();
    
        router.push('/login');
      };


    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <h1 className="self-center text-xl font-semibold whitespace-nowrap text-[#0F2A50] dark:text-white">Calendar</h1>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <p className="text-sm font-medium text-[#0F2A50] dark:text-gray-400">{  `Welcome, ${nameUser}` }</p>
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
