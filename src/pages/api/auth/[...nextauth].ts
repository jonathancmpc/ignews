import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  //Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user',
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user; //pegando e-mail do usuário que retornou como calback do github ao fazer a autenticação

      try {
        //inserindo no banco utilizando a linguagem de consulta do Fauna chamado FQL
        await fauna.query(
          q.Create(
            q.Collection('users'), //nome da tabela
            { data: { email } } //dados do usuário que queremos inserir
          )
        )
  
        return true

      } catch {
        return false        
      }
    },
  },
});
