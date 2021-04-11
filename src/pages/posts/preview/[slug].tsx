import { GetStaticProps } from "next"
import {query as q} from 'faunadb';
import { getSession, useSession } from "next-auth/client"
import Head from "next/head"
import { RichText } from "prismic-dom"
import { fauna } from "../../../services/fauna"

import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  //Verificando se o usuário está logado
  const [session]: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html: post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
              <Link href='/'>
                <a>Subscribe now 🤗</a>
              </Link>
          </div>
        </article>
      </main>
    </>
  )
}


export const getStaticPaths = () => {
  return {
    paths: [], //Quais posts gerar durante a build, quando não passamos nada, as páginas são carregadas dinâmicamente durante o carregamento da página
    fallback: 'blocking' //Pode-se usar true, false ou blocking. O blocking quando a página estática não estiver carregada ainda, faz com que seja carregada pelo Next no Server site render. 
  }
}

//Gerando o back do Next uma página estática
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0,8)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return {
    props: {
      post
    },
    redirect: 60 * 30, //Redirecionando e carregando novamente a página estática uma vez a cada 30 minutos
  }
}
