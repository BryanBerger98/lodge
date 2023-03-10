import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import { useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useTranslate from '@hooks/useTranslate';
import { formatPhoneNumber, parsePhoneNumber, PhoneNumber } from '@utils/phone-number.util';
import { ErrorCode, ErrorDomain } from 'types/error.type';
import { IUser } from 'types/user.type';

import PhoneInput from '../forms/PhoneInput';

export type EditUserFormInputs = {
	email: string;
	username: string;
	phone_number: string;
	role: 'admin' | 'user';
	disabled: boolean;
	emailVerified: boolean;
} & FieldValues;

type EditUserFormProperties = {
	user?: IUser | null;
	onSubmit: (values: EditUserFormInputs) => void;
	isSaving: boolean;
	errorCode: ErrorCode<ErrorDomain> | null;
};

const defaultUser = null;
const { Text } = Typography;

const EditUserForm = ({ user = defaultUser, onSubmit, isSaving, errorCode }: EditUserFormProperties) => {

	const [ phoneNumberValues, setPhoneNumberValues ] = useState<PhoneNumber | null>(user && user.phone_number ? parsePhoneNumber(user.phone_number) : null);
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const [ form ] = Form.useForm();

	const handleSubmitEditUserForm = (values: EditUserFormInputs) => {
		const { number } = phoneNumberValues ?? { number: '' };
		onSubmit({
			...values,
			phone_number: number as string,
			disabled: false,
			emailVerified: false,
		});
	};

	const handleChangePhoneNumber = (values: PhoneNumber | null) => {
		setPhoneNumberValues(values);
	};

	return (
		<>
			<Form
				className="text-sm"
				form={ form }
				initialValues={ {
					username: user?.username || '',
					email: user?.email || '',
					role: user?.role || 'user',
					phone_number: user && user.phone_number ? formatPhoneNumber(user.phone_number, 'NATIONAL') : '',
				} }
				layout="vertical"
				onFinish={ handleSubmitEditUserForm }
			>
				<Form.Item
					label="Nom d'utilisateur"
					name="username"
					rules={ [
						{
							required: true,
							message: 'Champ requis.',
						},
					] }
				>
					<Input
						placeholder="Ex: John DOE"
						type="text"
					/>
				</Form.Item>
				<Row gutter={ 8 }>
					<Col span={ 12 }>
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
					</Col>
					<Col span={ 12 }>
						<PhoneInput
							label="Téléphone"
							name="phone_number"
							onChangePhoneNumber={ handleChangePhoneNumber }
						/>
					</Col>
				</Row>
				<Form.Item
					label="Role"
					name="role"
					rules={ [
						{
							required: true,
							message: 'Champ requis.',
						},
					] }
				>
					<Select
						options={ [
							{
								value: 'user',
								label: 'Utilisateur',
							},
							{
								value: 'admin',
								label: 'Administrateur',
							},
						] }
					/>
				</Form.Item>

				<Space
					size="middle"
					wrap
				>
					<Button
						htmlType="submit"
						icon={ <SaveOutlined /> }
						loading={ isSaving }
						type="primary"
					>
						Enregistrer
					</Button>

					{ errorCode ? <Text type="danger">{ getTranslatedError(errorCode) }</Text> : null }
				</Space>
			</Form>
		</>
	);
};

export default EditUserForm;
