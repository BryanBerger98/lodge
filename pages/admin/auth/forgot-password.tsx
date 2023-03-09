import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';

import ForgotPasswordForm, { ForgotPasswordFormValues } from '@components/admin/auth/ForgotPasswordForm';
import Loader from '@components/admin/ui/Loader';
import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { sendResetPasswordEmailToUserByEmail } from '@services/auth/auth.client.service';
import csrf from '@utils/csrf.util';
import { IApiError } from 'types/error.type';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

const { Title, Text } = Typography;

type ForgotPasswordPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const ForgotPasswordPage: FC<ForgotPasswordPageProperties> = ({ csrfToken }) => {

	const [ error, setError ] = useState<string | null>(null);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ emailSent, setEmailSent ] = useState<boolean>(false);
	const [ counter, setCounter ] = useState<number>(60);

	const { dispatchCsrfToken } = useCsrfContext();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ csrfToken, dispatchCsrfToken ]);

	const startCountDown = (delay: number) => {
		setCounter(delay);
		let t = delay;
		const timer = setInterval(() => {
			t--;
			setCounter(t);
			if (t === 0) {
				clearInterval(timer);
				setEmailSent(false);
			}
		}, 1000);
	};

	const handleForgotPasswordFormSubmit = async (values: ForgotPasswordFormValues) => {
		const { email } = values;
		setLoading(true);
		try {
			await sendResetPasswordEmailToUserByEmail(email, csrfToken);
			setLoading(false);
			setEmailSent(true);
			startCountDown(60);
		} catch (err) {
			const apiError = err as IApiError;
			setLoading(false);
			if (apiError.response && apiError.response.data && apiError.response.data.code) {
				const errorMessage = getTranslatedError(apiError.response.data.code);
				setError(errorMessage);
				return;
			}
		}
	};


	return(
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
			<Card
				className="drop-shadow"
				style={ { width: '25%' } }
				title={
					<Title
						style={ {
							textAlign: 'center',
							fontSize: 24,
						} }
					>
						{ appName }
					</Title>
				}
				bordered
			>
				<Title
					level={ 2 }
					style={ {
						textAlign: 'center',
						marginBottom: 20,
						fontSize: 20,
					} }
				>
					Mot de passe oublié
				</Title>
				<ForgotPasswordForm
					isEmailSent={ emailSent }
					requestError={ error }
					onSubmit={ handleForgotPasswordFormSubmit }
				/>
				{
					emailSent ?
						<div
							style={ {
					            display: 'flex',
					            flexDirection: 'column',
					            alignItems: 'center',
					            justifyContent: 'center',
					            gap: 16,
							} }
						>
							<Button
								icon={ <SendOutlined /> }
								type="primary"
								disabled
							>
								Renvoyer un email dans { counter } secondes
							</Button>
							<Text type="success">Email envoyé !</Text>
						</div>
						: null
				}
			</Card>
		</div>
	);
};

export default ForgotPasswordPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
