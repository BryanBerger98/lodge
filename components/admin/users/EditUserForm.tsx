import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { ErrorCode, ErrorDomain } from '../../../types/error.type';
import { IUser } from '../../../types/user.type';
import { parsePhoneNumber, PhoneNumber } from '../../../utils/phone-number.util';
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

const EditUserForm = ({ user = defaultUser, onSubmit, isSaving, errorCode }: EditUserFormProperties) => {

	const [ phoneNumberValues, setPhoneNumberValues ] = useState<PhoneNumber | null>(user && user.phone_number ? parsePhoneNumber(user.phone_number) : null);

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
				layout="vertical"
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
						{ /* <PhoneField
							errors={ errors as DeepMap<EditUserFormInputs, FieldError> }
							label="Téléphone"
							name="phone_number"
							placeholder="+33 6 01 02 03 04"
							register={ register }
							onChangePhoneNumber={ handleChangePhoneNumber }
						/> */ }
						<PhoneInput onChangePhoneNumber={ handleChangePhoneNumber } />
					</Col>
				</Row>
				<Form.Item
					initialValue="user"
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

				<Button
					htmlType="submit"
					icon={ <SaveOutlined /> }
					loading={ isSaving }
					type="primary"
				>
					Enregistrer
				</Button>
			</Form>
		</>
	);
};

export default EditUserForm;
