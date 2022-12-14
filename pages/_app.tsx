import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import ThemeContextProvider from '../context/theme.context';
import CsrfContextProvider from '../context/csrf.context';
import AuthContextProvider from '../context/auth.context';
import Layout from '../components/layout/Layout';
import { store, wrapper } from '../store';
import { Provider } from 'react-redux';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={ store }>
            <ThemeContextProvider>
                <CsrfContextProvider>
                    <SessionProvider>
                        <AuthContextProvider>
                            <Layout>
                                <Component { ...pageProps } />
                            </Layout>
                        </AuthContextProvider>
                    </SessionProvider>
                </CsrfContextProvider>
            </ThemeContextProvider>
        </Provider>
    );
};

export default wrapper.withRedux(App);
