'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface RegisterProps { }

const Register: React.FC<RegisterProps> = () => {
  const nagigate = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/auth/register', { login, password });
      console.log('Registro bem-sucedido:', response.data);
    } catch (error) {
      setErrorMessage('Erro ao registrar usuário. Verifique as informações e tente novamente.');
      console.error('Erro durante o registro:', error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">


          <form onSubmit={handleRegister}>
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
              Register</h1>
            <div className="py-2 text-left">
              <input placeholder='Login' className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)} required />
            </div>
            <div className="py-2 text-left">
              <input placeholder="Password" className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <button className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
                            text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
              type="submit">Register</button>
            <button
              className="border-2 my-2 border-[#0F2A50] focus:outline-none bg-white
                            text-[#0F2A50] font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-[#0F2A50]"
              onClick={() => nagigate.push('/login')}
            >
              Go to Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;