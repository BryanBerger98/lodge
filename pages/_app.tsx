import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import Layout from '@components/layout/Layout';
import AuthContextProvider from '@context/auth.context';
import CsrfContextProvider from '@context/csrf.context';
import ThemeContextProvider from '@context/theme.context';


const App = ({ Component, pageProps }: AppProps) => {
	return (
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
	);
};

export default App;
