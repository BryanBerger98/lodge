import { ArrowRightOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';

import { useAuthContext } from '@context/auth.context';
import useTranslate from '@hooks/useTranslate';
import { verifyEmail } from '@services/auth/auth.client.service';
import { IApiError } from 'types/error.type';

const { Title, Text } = Typography;

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const VerifyEmailBlock = () => {
	const router = useRouter();

	const [ loading, setLoading ] = useState(false);
	const [ success, setSuccess ] = useState(false);
	const [ error, setError ] = useState<string | null>('Error');

	const { getCurrentUser } = useAuthContext();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });
	const { token } = router.query;

	useEffect(() => {
		if (token && typeof token === 'string') {
			verifyEmail(token)
				.then(() => {
					setSuccess(true);
					getCurrentUser();
					setTimeout(() => {
						router.replace('/');
					}, 3000);
				}).catch((err: IApiError) => {
					if (err.response && err.response.data) {
						const errorMessage = getTranslatedError(err.response.data.code);
						return setError(errorMessage);
					}
				}).finally(() => {
					setLoading(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			{
				loading ?
					<div
						style={ { width: 200 } }
					>
						<Spin
							size="large"
							tip="Chargement..."
						>
							<div className="content" />
						</Spin>
					</div>
					: null
			}
			{
				!error && !loading && success ?
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
							Adresse email vérifiée
						</Title>
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
					</Card>
					: null
			}
			{
				error && !loading && !success ?
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
							Une erreur est survenue
						</Title>
						<div
							style={ {
								display: 'flex',
								justifyContent: 'center',
							} }
						>
							<Text
								type="danger"
							>
								<CloseCircleOutlined
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
					</Card>
					: null
			}
		</div>
	);
};

export default memo(VerifyEmailBlock);
