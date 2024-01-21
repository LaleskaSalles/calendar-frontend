'use client'
import { useForm } from "react-hook-form";
import { useContext } from "react";


export default function Navbar() {

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <h1 className="self-center text-xl font-semibold whitespace-nowrap text-[#0F2A50] dark:text-white">Calendar</h1>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <p className="text-sm font-medium text-[#0F2A50] dark:text-gray-400">User</p>
                        <a href="#" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
                            >Logout</a>
                    </div>
                </div>
            </nav>
        
        </div>
    )
}
