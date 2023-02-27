import { Card, Typography } from 'antd';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

import LoginForm, { LoginFormValues } from '@components/admin/auth/LoginForm';
import Loader from '@components/admin/ui/Loader';
import { useCsrfContext } from '@context/csrf.context';
import csrf from '@utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

const { Title } = Typography;

type LoginPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const LoginPage = ({ csrfToken }: LoginPageProperties) => {

	const router = useRouter();
	const [ error, setError ] = useState<string | null>(null);
	const [ loading, setLoading ] = useState<boolean>(false);

	const { dispatchCsrfToken } = useCsrfContext();

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ dispatchCsrfToken, csrfToken ]);

	const handleSubmitLoginForm = (values: LoginFormValues) => {
		setLoading(true);
		setError(null);
		const { email, password } = values;
		signIn('credentials', {
			redirect: false,
			email,
			password,
		})
			.then(() => {
				router.replace('/admin/dashboard');
			})
			.catch(() => {
				setLoading(false);
				setError('Identifiant ou mot de passe incorrects');
				return;
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div
			style={ {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				height: '100%',
				width: '100%',
				alignItems: 'center',
				flexGrow: 1,
			} }
		>
			<Loader isLoading={ loading } />
			<>
				<Card
					className="drop-shadow"
					style={ { width: '25%' } }
					title={ <Title style={ { textAlign: 'center' } }>{ appName }</Title> }
					bordered
				>
					<Title
						level={ 2 }
						style={ {
							textAlign: 'center',
							marginBottom: 20,
						} }
					>
						Connexion
					</Title>
					<LoginForm
						requestError={ error }
						onSubmit={ handleSubmitLoginForm }
					/>
				</Card>
			</>
		</div>
	);
};

export default LoginPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf ) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
