import { CheckOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { sendVerifyAccountEmailToUser } from '@services/auth/auth.client.service';
import { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';

const { Title, Text } = Typography;

const AccountEmailVerification = () => {

	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);
	const [ loading, setLoading ] = useState(false);
	const [ emailSent, setEmailSent ] = useState(false);
	const [ counter, setCounter ] = useState(60);

	const startCountDown = (delay: number) => {
		setCounter(delay);
		let newDelay = delay;
		const timer = setInterval(() => {
			newDelay--;
			setCounter(newDelay);
			if (newDelay === 0) {
				clearInterval(timer);
				setEmailSent(false);
			}
		}, 1000);
	};

	const handleSendVerificationEmail = async () => {
		setLoading(true);
		setErrorCode(null);
		try {
			await sendVerifyAccountEmailToUser();
			toast.custom(
				<div className="flex items-center gap-4 bg-primary-light-default text-light-50 text-medium text-base px-5 py-3 rounded-md drop-shadow">
					<SendOutlined /><span>Email envoyé !</span>
				</div>
			);
			startCountDown(60);
			setEmailSent(true);
		} catch (error) {
			const { response } = error as IApiError;
			if (response && response.data && response.data.code) {
				setErrorCode(response.data.code);
			}
		} finally {
			setLoading(false);
		}
	};

	return(
		<div
			style={ {
				border: 1,
				borderColor: 'rgba(5, 5, 5, 0.06)',
				borderStyle: 'solid',
				borderRadius: 8,
				padding: 24,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: 16,
			} }
		>
			<div>
				<Title
					level={ 3 }
					style={ {
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						fontSize: 18,
					} }
					type="danger"
				>
					<WarningOutlined />
					<span>Votre adresse email n&apos;est pas vérifiée</span>
				</Title>
			</div>
			{
				emailSent && !errorCode ?
					<Text>
						Renvoyer un email dans { counter } secondes
					</Text>
					: null
			}
			{
				!emailSent &&
					<Button
						icon={ <CheckOutlined /> }
						loading={ loading }
						type="primary"
						onClick={ handleSendVerificationEmail }
					>
						Vérifier mon adresse email
					</Button>
			}
		</div>
	);
};

export default AccountEmailVerification;
