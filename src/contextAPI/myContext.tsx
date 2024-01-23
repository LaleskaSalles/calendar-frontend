import { createContext, useContext } from 'react';

interface MyContextType {
    loginUser: (formData: any) => Promise<any>;
    logout: () => void;
    tokenLocal: string;
}  

const MyContext = createContext<MyContextType | null>(null);

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (!context) {
      throw new Error('useMyContext must be used within a MyProvider');
    }
    return context;
  };
  
  export default MyContext;