import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import useTranslate from '@hooks/useTranslate';
import { resetPassword } from '@services/auth/auth.client.service';
import { IApiError } from 'types/error.type';

const { Text } = Typography;

type ResetPasswordInputs = {
	password: string;
	passwordConfirm: string;
};

type ResetPasswordFormProperties = {
	csrfToken: string;
	token: string;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<boolean>>;
}

const ResetPasswordForm: FC<ResetPasswordFormProperties> = ({ csrfToken, token, setIsLoading, setSuccess }) => {

	const router = useRouter();
	const [ error, setError ] = useState<string | null>(null);

	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const handleResetPasswordFormSubmit = (values: ResetPasswordInputs) => {
		if (!token || token && typeof token !== 'string') {
			return;
		}
		const { password } = values;
		setIsLoading(true);

		resetPassword(token, password, csrfToken).then(() => {
			setSuccess(true);
			setTimeout(() => {
				router.replace('/admin/auth/login');
			}, 3000);
		}).catch((err: IApiError) => {
			if (err.response && err.response.data) {
				const errorMessage = getTranslatedError(err.response.data.code);
				return setError(errorMessage);
			}
		}).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<Form
			layout="vertical"
			onFinish={ handleResetPasswordFormSubmit }
		>
			<Form.Item
				label="Nouveau mot de passe"
				name="password"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					{
						min: 8,
						message: 'Minimum 8 caractères.',
					},
				] }
			>
				<Input.Password
					placeholder="********"
				/>
			</Form.Item>
			<Form.Item
				dependencies={ [ 'password' ] }
				label="Confirmer le mot de passe"
				name="passwordConfirm"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('Les nouveaux mots de passe doivent être identiques.'));
						},
					}),
				] }
			>
				<Input.Password
					placeholder="********"
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
				{ error ? <Text type="danger">{ error }</Text> : null }
				<Button
					htmlType="submit"
					icon={ <CheckOutlined /> }
					type="primary"
				>
					Valider
				</Button>
			</div>
		</Form>
	);
};

export default ResetPasswordForm;
