'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface RegisterProps { }

const Register: React.FC<RegisterProps> = () => {
  const navigate = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/user/register', { login, password });
      console.log('Register successful', response.data);
      setLogin('');
      setPassword('');
      alert('Register successful');
    } catch (error) {

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage('Erro ao registrar usuário. Verifique as informações e tente novamente.');
        
        if (error.response?.data.includes("already exists")) {
          window.alert("The Login already exists.");
        }
      } else {
        setErrorMessage('Erro ao registrar usuário. Tente novamente mais tarde.');
        window.alert('Erro ao registrar usuário. Tente novamente mais tarde.');
      }

      console.error('Erro durante o registro:', error);
    }
  
  };

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">


          <form onSubmit={handleRegister}>
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">Welcome</h1>
            <div>
              <input placeholder='Login' className="bg-gray-200 border-2 border-gray-100 focus:outline-none  block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="text"
                id="login"
                value={login}
                required
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div>
              <input placeholder='Password' className="bg-gray-200 border-2 border-gray-100 focus:outline-none  block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
                      text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
              type="submit">

              Register
            </button>
            <button
              className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-white
                      text-[#0F2A50] font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-[#0F2A50]"
              type="button"
              onClick={() => navigate.push('/')}>
              Go to Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;