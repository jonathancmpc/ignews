import { GetStaticProps } from 'next';
import Head from 'next/head'

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

// Três formas de chamar uma API no Next:
// Client-side -> chamada normal com o useEffect diretamente na função principal
// Server-side -> chamada utilizando o Next/Node com a função getServerSideProps
// Static Site Generation -> chamada utilizando o Next/Node uma vez, e depois salva-se um HTML para todos consumirem estáticamente. Utiliza-se a função getStaticProps.

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

//O parâmetro props(desestruturado para product) pega o retorno da função do Next getServerSideProps
export default function Home({ product }: HomeProps) {
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
            <span>{`for ${product.amount} month`}</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

//Somente podemos usar essa função em pages e não em componentes
//O nome da função tem que ser exatamente este
//O resultado dessa função pode ser extraído através do parâmetro props passado na função principal da Home
//Essa função é executada no servidor Node do Next("BackEnd") e não no cliente. Por isso se dermos um console.log aqui, não irá aparecer na nossa aplicação. Para acessar o resultado da função basta passar como parâmetro da função Home e chamá-lo por lá. Pois assim que o node executa ele envia para o cliente a resposta.
//A função geStaticProps, diferente da getServerSideProps, salva um HTML estático para que não seja feita a requisição a API todas as vezes.
//Somente geStaticProps(Static Site Generation - SSG) se o conteúdo for o mesmo para todo mundo que acessa a página. Se for por exemplo o nome de um usuário, não podemos usá-lo se não irá aparecer o nome da mesma pessoa para todos que acessarem a aplicaçãoo.
export const getStaticProps: GetStaticProps = async () => {
  // Acessando o preço do produto pela api do stripe, utilizando a api do preço gerada na plataforma do stripe
  const price = await stripe.prices.retrieve('price_1IcrmoLGRE9h3OAlNpFyIkoA', {
    //Para ter acesso a todas as informações do produto
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //Transformando em centavos, é mais fácil de trabalhar na formatação depois
  }

  return {
    props: {
      product
    },
    //Quanto tempo em segundos a página tem que ser revalidada, ou seja, busca na API
    revalidate: 60 * 60 * 24, // 24 horas
  }
}
