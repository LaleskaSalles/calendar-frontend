import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { login, password } = req.body;

  try {
    // Lógica para chamar a rota de registro no backend Java
    const response = await axios.post('http://localhost:8080/user/register', {
      login,
      password,
    });

    // A resposta do backend Java pode conter informações adicionais se necessário
    const responseData = response.data;

    // Ajuste conforme necessário
    return res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Outros métodos HTTP, se houver...

// Exporte cada método HTTP individualmente como uma exportação nomeada

