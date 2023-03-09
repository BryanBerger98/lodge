import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import ResetPasswordForm from '@components/admin/auth/ResetPasswordForm';
import Loader from '@components/admin/ui/Loader';
import { useCsrfContext } from '@context/csrf.context';
import csrf from '@utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

const { Title, Text } = Typography;

type ResetPasswordPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const ResetPasswordPage: FC<ResetPasswordPageProperties> = ({ csrfToken }) => {

	const router = useRouter();
	const [ loading, setLoading ] = useState(false);
	const [ success, setSuccess ] = useState(false);

	const { dispatchCsrfToken } = useCsrfContext();

	const { token } = router.query;

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ csrfToken, dispatchCsrfToken ]);

	const handleGoBack = () => router.push('/');

	return(
		<div
			style={ {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexGrow: 1,
			} }
		>
			<Loader isLoading={ loading } />
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
						Réinitialisation du mot de passe
					</Title>
					{
						!success ?
							<ResetPasswordForm
								csrfToken={ csrfToken }
								setIsLoading={ setLoading }
								setSuccess={ setSuccess }
								token={ token as string }
							/>
							:
							<>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'center',
									} }
								>
									<Text
										type="success"
									>
										<CheckCircleOutlined
											style={ { fontSize: 64 } }
										/>
									</Text>
								</div>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'center',
										margin: '1rem 0',
									} }
								>
									<Text>Vous allez être redirigé dans quelques secondes</Text>
								</div>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'center',
									} }
								>
									<Button
										icon={ <ArrowRightOutlined /> }
										type="primary"
										onClick={ handleGoBack }
									>
										Retour à l&apos;application
									</Button>
								</div>
							</>
					}
				</Card>
			</div>
		</div>
	);
};

export default ResetPasswordPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
