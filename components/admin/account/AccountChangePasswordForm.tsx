import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useState } from 'react';

import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { updatePassword } from '@services/auth/auth.client.service';
import type { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';

const { Title, Text } = Typography;

type ChangePasswordFormInputs = {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
};

const AccountChangePasswordForm = () => {

	const [ saving, setSaving ] = useState<boolean>(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);

	const { csrfToken } = useCsrfContext();

	const [ form ] = Form.useForm();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const handleChangePasswordFormSubmit = async (values: ChangePasswordFormInputs) => {
		setSaving(true);
		setErrorCode(null);
		const { newPassword, oldPassword } = values;

		try {
			await updatePassword(oldPassword, newPassword, csrfToken);
		} catch (error) {
			const apiError = error as IApiError;
			if (apiError.response && apiError.response.data && apiError.response.data.code) {
				setErrorCode(apiError.response.data.code);
				return;
			}
		} finally {
			setSaving(false);
			form.resetFields();
		}

	};

	return(
		<Form
			form={ form }
			initialValues={ {
				oldPassword: '',
				newPassword: '',
				newPasswordConfirm: '',
			} }
			layout="vertical"
			style={ {
				border: 1,
				borderColor: 'rgba(5, 5, 5, 0.06)',
				borderStyle: 'solid',
				borderRadius: 8,
				padding: 24,
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			} }
			onFinish={ handleChangePasswordFormSubmit }
		>
			<Title
				level={ 3 }
				style={ {
					display: 'flex',
					gap: 8,
					alignItems: 'center',
					marginTop: 0,
					marginBottom: 32,
				} }
			>
				<LockOutlined />
				<span>Mot de passe</span>
			</Title>
			<Form.Item
				label="Mot de passe actuel"
				name="oldPassword"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
				] }
			>
				<Input.Password
					placeholder="********"
				/>
			</Form.Item>
			<Form.Item
				dependencies={ [ 'oldPassword' ] }
				label="Nouveau mot de passe"
				name="newPassword"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					{
						min: 8,
						message: 'Minimum 8 caractères.',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (getFieldValue('oldPassword') !== value) {
								return Promise.resolve();
							}
						  	return Promise.reject(new Error('Le nouveau mot de passe doit être différent du précédent.'));
						},
					}),
				] }
			>
				<Input.Password
					placeholder="********"
				/>
			</Form.Item>
			<Form.Item
				dependencies={ [ 'newPassword' ] }
				label="Confirmer le mot de passe"
				name="newPasswordConfirm"
				rules={ [
					{
						required: true,
						message: 'Champ requis.',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('newPassword') === value) {
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
			<Space
				size="middle"
				style={ { marginTop: 'auto' } }
			>
				<Button
					htmlType="submit"
					icon={ <SaveOutlined /> }
					loading={ saving }
					style={ {
						marginTop: 'auto',
						width: 'fit-content',
					} }
					type="primary"
				>
					Enregistrer
				</Button>
				{
					errorCode ?
						<Text
							style={ { textAlign: 'center' } }
							type="danger"
						>
							{ getTranslatedError(errorCode) }
						</Text>
						: null
				}
			</Space>
		</Form>
	);
};

export default AccountChangePasswordForm;
