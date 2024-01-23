'use client'
import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import axios from 'axios';


const MyProvider = ({ children }: { children: React.ReactNode }) => {
     
    const [tokenLocal,setTokenLocal] = useState(localStorage.getItem('token') || '')

    const loginUser = async (formData: any) => {
        try {
            const { data } = await axios.post('http://localhost:8080/user/login', formData)
            console.log(data)
            setTokenLocal(data.token)
            return data
        } catch (error) {
            console.error(error)
        }
    }

    const logout = () => {
        localStorage.clear()
        setTokenLocal('')
    }

    return (
        <MyContext.Provider value={{ loginUser,logout,tokenLocal }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyProvider;