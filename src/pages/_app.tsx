import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Provider as NextAuthProvider } from 'next-auth/client'; //Provider para passar a informação do usuário logado para todas as páginas

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <NextAuthProvider session={pageProps.session}> {/* As informações da sessão são gravadas no pageProps */}
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp
