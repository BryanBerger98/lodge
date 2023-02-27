import { LoginOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

export type LoginFormValues = {
	email: string;
	password: string;
}

export type LoginFormProperties = {
	onSubmit: (values: LoginFormValues) => void;
	requestError: string | null;
}

const LoginForm = ({ onSubmit: handleSubmit, requestError = null }: LoginFormProperties) => {

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
			<Form.Item
				label="Mot de passe"
				name="password"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					{
						min: 8,
						message: 'Au moins 8 caractères.',
					},
				] }
			>
				<Input
					placeholder="********"
					type="password"
				/>
			</Form.Item>
			<div
				style={ {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				} }
			>
				{ requestError ? <p className="text-sm text-danger-light-default dark:text-danger-dark-default mb-5">{ requestError }</p> : null }
				<Button
					htmlType="submit"
					icon={ <LoginOutlined /> }
					style={ { marginBottom: 16 } }
					type="primary"
				>
					Connexion
				</Button>
				<Button
					href="/admin/auth/forgot-password"
					type="link"
				>
					Mot de passe oublié ?
				</Button>
			</div>
		</Form>
	);
};

export default LoginForm;
