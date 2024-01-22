'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// import { useAuthStore } from '../stores/authStore';
import useAuthStore from '../stores/useAuthStore';



const Login: React.FC = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const response = await useAuthStore.getState().signIn(credentials.login, credentials.password);

      // setUser(response.data);
      // setAuthentication(true); 
      // setCookie('token', response.data.token);

      
      

      
      // const { data } = await axios.post('http://localhost:8080/user/login', credentials);
      // useAuthStore.getState().setAuthData(data.token, data.userId); 
      // localStorage.setItem('token', data.token);

      router.push('/');
      // return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Incorrect Login or Password');
      } else {
        console.error('Erro durante o login:', error);
      }
    }
  }

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">


          <form onSubmit={handleLogin}>
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
              Login</h1>
            <div>
              <input placeholder='Login' className="bg-gray-200 border-2 border-gray-100 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="text"
                id="login"
                value={credentials.login}
                required
                onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
              />
            </div>
            <div>
              <input placeholder='Password' className="bg-gray-200 border-2 border-gray-100 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="password"
                id="password"
                value={credentials.password}
                required
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button
              className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
                            text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
              type="submit">

              Login
            </button>
            <button
              className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-white
                            text-[#0F2A50] font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-[#0F2A50]"
              type="button" onClick={() => router.push('/register')}>
              Create an account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;