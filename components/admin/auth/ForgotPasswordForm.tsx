import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';

const { Text } = Typography;

export type ForgotPasswordFormValues = {
	email: string;
}

export type ForgotPasswordFormProperties = {
	onSubmit: (values: ForgotPasswordFormValues) => void;
	requestError: string | null;
	isEmailSent: boolean;
}

const ForgotPasswordForm = ({ onSubmit: handleSubmit, requestError = null, isEmailSent }: ForgotPasswordFormProperties) => {

	return (
		<Form
			layout="vertical"
			onFinish={ handleSubmit }
		>
			<Form.Item
				label="Adresse email"
				name="email"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					{
						type: 'email',
						message: 'Merci de saisir une adresse valide.',
					},
				] }
			>
				<Input
					placeholder="example@example.com"
					type="email"
				/>
			</Form.Item>
			<div
				style={ {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 16,
				} }
			>
				{ requestError ? <Text type="danger">{ requestError }</Text> : null }
				{
					!isEmailSent &&
						<>
							<Button
								htmlType="submit"
								icon={ <SendOutlined /> }
								type="primary"
							>
								Envoyer
							</Button>
							<Button
								href="/admin/auth/login"
								type="link"
							>
								Retour au formulaire de connexion
							</Button>
						</>
				}
			</div>
		</Form>
	);
};

export default ForgotPasswordForm;
