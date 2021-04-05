import Head from 'next/head'

import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      {/* Todo conteúdo que eu coloco dento do componente Head(do Next) vai para o cabeçalho do html(head), podemos posicionar ele em qualquer lugar que ele sempre vai levar o conteúdo para head */}
      <Head>
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get acess to all the publications <br />
            <span>for $9.90 month</span>
          </p>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}
