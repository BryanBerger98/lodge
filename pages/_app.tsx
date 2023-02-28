import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';

import Layout from '../components/layout/Layout';
import AuthContextProvider from '../context/auth.context';
import CsrfContextProvider from '../context/csrf.context';
import ThemeContextProvider from '../context/theme.context';
import { store, wrapper } from '../store';


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
