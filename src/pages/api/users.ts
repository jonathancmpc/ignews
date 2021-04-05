import { NextApiRequest, NextApiResponse } from 'next';

// Já pode ser acessado pela rota /api/users
export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id: 1, name: 'Jonathan'},
    {id: 2, name: 'Kelly'},
    {id: 3, name: 'Lola'},
  ];

  return response.json(users);
}