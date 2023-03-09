import { UserOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Space, Typography } from 'antd';
import { ChangeEventHandler, Dispatch, FC, SetStateAction, useState } from 'react';

import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { updateAccount } from '@services/auth/auth.client.service';
import { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';
import { IUser } from 'types/user.type';

const { Text } = Typography;

type AccountInformationsFormModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
	dispatchUser: (user: IUser) => void;
}

const AccountInformationsFormModal: FC<AccountInformationsFormModalProperties> = ({ isOpen, setIsOpen, user, dispatchUser }) => {

	const { csrfToken } = useCsrfContext();

	const [ usernameInputValue, setUsernameInputValue ] = useState(user.username || '');

	const [ saving, setSaving ] = useState<boolean>(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);

	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const handleSaveAccountInfos = async () => {
		try {
			setSaving(true);
			await updateAccount({ username: usernameInputValue }, csrfToken);
			dispatchUser({
				...user,
				username: usernameInputValue,
			});
			setSaving(false);
			setIsOpen(false);
		} catch (error) {
			setSaving(false);
			const apiError = error as IApiError;
			if (apiError.response && apiError.response.data && apiError.response.data.code) {
				setErrorCode(apiError.response.data.code);
				return;
			}
		}
	};

	const handleCloseModal = () => setIsOpen(false);
	const handleChangeUsernameInputValue: ChangeEventHandler<HTMLInputElement> = ({ target }) => setUsernameInputValue(target.value);

	return (
		<Modal
			cancelText="Annuler"
			confirmLoading={ saving }
			okButtonProps={ { disabled: usernameInputValue === user.username || !usernameInputValue } }
			okText="Enregister"
			open={ isOpen }
			title={
				<Space
					size="middle"
					style={ { fontSize: '1.25rem' } }
				>
					<UserOutlined /><span>Profil</span>
				</Space>
		   }
			centered
			onCancel={ handleCloseModal }
			onOk={ handleSaveAccountInfos }
		>
			<Form layout="vertical">
				<Form.Item label="Nom d'utilisateur">
					<Input
						placeholder="Ex: John DOE"
						type="text"
						value={ usernameInputValue }
						onChange={ handleChangeUsernameInputValue }
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

export default AccountInformationsFormModal;
