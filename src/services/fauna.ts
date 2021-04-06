import { Client } from 'faunadb';

//Criar as tabelas/collections na plataforma do FaunaDB antes
export const fauna = new Client({
  secret: process.env.FAUNADB_KEY
});