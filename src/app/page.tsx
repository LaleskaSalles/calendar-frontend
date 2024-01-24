'use client'
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import MyContext from '@/contextAPI/myContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MyContextType {
  loginUser: (formData: any) => Promise<any>;
}

const HomePage: React.FC = () => {
  const router = useRouter()
  const { loginUser } = useContext(MyContext) as MyContextType;
  const { register, handleSubmit } = useForm()

  const submit = async (formData: any) => {
    try {
      const response = await loginUser(formData)
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('id', response.userId)
        router.push('/events')
      } else {
        toast.error('Incorrect login or password.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      return response

    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <main>
      <section className="min-h-screen flex flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">

            <form onSubmit={handleSubmit(submit)}>
              <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
                Login</h1>
              <div>
                <input placeholder='Login' className="bg-gray-200 border-2 border-gray-100 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                  type="text"
                  id="login"
                  {...register('login')}
                  required

                />
              </div>
              <div>
                <input placeholder='Password' className="bg-gray-200 border-2 border-gray-100 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700"
                  type="password"
                  id="password"
                  {...register('password')}
                  required

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
                type="button"
                onClick={() => router.push('/register')}
              >
                Create an account
              </button>
            </form>
          </div>
        </div>
      </section>
      );

    </main>

  );
};

export default HomePage;