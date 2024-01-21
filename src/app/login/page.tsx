'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Login: React.FC = () => {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        login,
        password,
      });

      console.log('Login successful:', response.data);
      router.push('/');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">


          <form>
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
              Login</h1>
            <div>
              <input placeholder='Login' className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="text"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div>
              <input placeholder='Password' className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
                            text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
              type="button" onClick={handleLogin}>
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