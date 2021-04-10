import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
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
  ],
  callbacks: {
    // Pegando dados da sessão e verificando se tem uma assinatura ativa
    async session(session) {

      try {

        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }

    },
    //Fazendo login
    async signIn(user, account, profile) {
      
      const { email } = user; //pegando e-mail do usuário que retornou como calback do github ao fazer a autenticação

      try {
        //inserindo no banco utilizando a linguagem de consulta do Fauna chamado FQL
        await fauna.query(
          q.If( //se
            q.Not( //não
              q.Exists( //existe uma combinação entre os e-mails(Match)
                q.Match( //parecido com o where do sql, porém o que desejamos filtrar tem que está nos índices
                  q.Index('user_by_email'),
                  q.Casefold(user.email) //o case fold é para transformar tudo em minúscula
                )
              )
            ),
            q.Create( //então insere no banco o e-mail
              q.Collection('users'), //nome da tabela
              { data: { email } } //dados do usuário que queremos inserir
            ),
            q.Get( //se não, se já existe eu busco as informações -> select
              q.Match( // que sejam iguais
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          ) 
        )
              
        return true

      } catch {
        return false        
      }
    },
  },
});
