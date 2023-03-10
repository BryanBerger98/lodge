import { MailOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useState, FC } from 'react';

import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { updateAccount, updateEmail } from '@services/auth/auth.client.service';
import { formatPhoneNumber, parsePhoneNumber, PhoneNumber } from '@utils/phone-number.util';
import { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';
import { IUser } from 'types/user.type';

import PhoneInput from '../forms/PhoneInput';

import PasswordFormModal from './PasswordFormModal';

const { Title, Text } = Typography;

type ContactInfosFormInputs = {
	phoneNumber: string;
	email: string;
};

type AccountContactInformationsFormProperties = {
	currentUser: IUser
}

const AccountContactInformationsForm: FC<AccountContactInformationsFormProperties> = ({ currentUser }) => {

	const { dispatchCurrentUser } = useAuthContext();
	const { csrfToken } = useCsrfContext();

	const [ form ] = Form.useForm();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const updateUser = async ({ email, password, phone_number }: { email?: string | null, phone_number?: string | null, password?: string | null }) => {
		try {
			if (email && password) {
				await updateEmail(email, password, csrfToken);
			}

			if (phone_number) {
				await updateAccount({ phone_number }, csrfToken);
			}

			return;
		} catch (error) {
			throw error;
		}
	};

	const [ isPasswordFormModalOpen, setIsPasswordFormModalOpen ] = useState(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);
	const [ saving, setSaving ] = useState(false);
	const [ phoneNumberValues, setPhoneNumberValues ] = useState<PhoneNumber | null>(currentUser.phone_number ? parsePhoneNumber(currentUser.phone_number) : null);

	const handleContactInfosFormSubmit = async (values: ContactInfosFormInputs) => {
		const { email } = values;

		if (currentUser.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
			setIsPasswordFormModalOpen(true);
			return;
		}

		setSaving(true);

		try {
			const { number } = phoneNumberValues ?? { number: '' };
			await updateUser({ phone_number: number });
			currentUser.phone_number = number;
			dispatchCurrentUser(currentUser);
			setSaving(false);
		} catch (error) {
			setSaving(false);
			const apiError = error as IApiError;
			if (apiError.response && apiError.response.data && apiError.response.data.code) {
				setErrorCode(apiError.response.data.code);
				return;
			}
		}
	};

	const handlePasswordFormSubmit = async (password: string) => {
		setSaving(true);
		setErrorCode(null);
		const { email } = form.getFieldsValue();
		const { number } = phoneNumberValues ?? { number: '' };
		const updateObject = {
			email: email && email.length > 0 ? email : null,
			phone_number: number && number.length > 0 ? number : null,
		};

		try {
			await updateUser({
				...updateObject,
				password: password && password.length >= 8 ? password : null,
			});

			if (updateObject.email) {
				currentUser.email = updateObject.email;
			}

			if (updateObject.phone_number) {
				currentUser.phone_number = updateObject.phone_number;
			}

			dispatchCurrentUser(currentUser);
			setIsPasswordFormModalOpen(false);
		} catch (err) {
			const apiError = err as IApiError;
			if (apiError.response && apiError.response.data && apiError.response.data.code) {
				setErrorCode(apiError.response.data.code);
				return;
			}
		} finally {
			setSaving(false);
		}
	};

	const handleChangePhoneNumber = (values: PhoneNumber | null) => {
		setPhoneNumberValues(values);
	};

	return(
		<>
			<Form
				form={ form }
				initialValues={ {
					email: currentUser.email || '',
					phone_number: currentUser.phone_number ? formatPhoneNumber(currentUser.phone_number, 'NATIONAL') : '',
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
				onFinish={ handleContactInfosFormSubmit }
			>
				<Title
					level={ 3 }
					style={ {
						display: 'flex',
						gap: 8,
						alignItems: 'center',
						marginBottom: 32,
						marginTop: 0,
					} }
				>
					<MailOutlined />
					<span>Contact</span>
				</Title>
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
				<PhoneInput
					label="Téléphone"
					name="phone_number"
					onChangePhoneNumber={ handleChangePhoneNumber }
				/>
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
			<PasswordFormModal
				errorCode={ errorCode }
				isOpen={ isPasswordFormModalOpen }
				setIsOpen={ setIsPasswordFormModalOpen }
				onSubmit={ handlePasswordFormSubmit }
			/>
		</>
	);
};

export default AccountContactInformationsForm;
