import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Space, Typography } from 'antd';
import { ChangeEventHandler, Dispatch, FC, SetStateAction, useState } from 'react';

import useTranslate from '@hooks/useTranslate';
import { ErrorCode, ErrorDomain } from 'types/error.type';

const { Text } = Typography;

type PasswordFormModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	onSubmit: (password: string) => void;
	errorCode: ErrorCode<ErrorDomain> | null;
}

const PasswordFormModal: FC<PasswordFormModalProperties> = ({ isOpen, setIsOpen, onSubmit, errorCode }) => {

	const [ passwordInputValue, setPasswordInputValue ] = useState('');
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const handlePasswordFormSubmit = () => {
		onSubmit(passwordInputValue);
		setPasswordInputValue('');
	};

	const handleCloseModal = () => setIsOpen(false);
	const handleChangePasswordInputValue: ChangeEventHandler<HTMLInputElement> = ({ target }) => setPasswordInputValue(target.value);

	return(
		<Modal
			cancelText="Annuler"
			okButtonProps={ { disabled: !passwordInputValue || passwordInputValue.length < 8 } }
			okText="Enregister"
			open={ isOpen }
			title={
				<Space
					size="middle"
					style={ { fontSize: '1.25rem' } }
				>
					<LockOutlined /><span>Mot de passe</span>
				</Space>
	   }
			centered
			onCancel={ handleCloseModal }
			onOk={ handlePasswordFormSubmit }
		>
			<Form layout="vertical">
				<Form.Item label="Mot de passe">
					<Input.Password
						placeholder="********"
						value={ passwordInputValue }
						onChange={ handleChangePasswordInputValue }
					/>
				</Form.Item>
			</Form>
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
		</Modal>
	);
};

export default PasswordFormModal;
