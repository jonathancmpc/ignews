import Head from 'next/head'

import styles from '../styles/home.module.scss';

export default function Home() {
  return (
    <>
      {/* Todo conteúdo que eu coloco dento do componente Head(do Next) vai para o cabeçalho do html(head), podemos posicionar ele em qualquer lugar que ele sempre vai levar o conteúdo para head */}
      <Head>
        <title>Início | ig.news</title>
      </Head>
      <h1 className={styles.title}>
        Óh Senhor Jesus!
      </h1>
    </>
  )
}
