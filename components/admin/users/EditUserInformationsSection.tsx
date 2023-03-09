import { DeleteOutlined, KeyOutlined, LockOutlined, MoreOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space, Tag } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

import { useCsrfContext } from '@context/csrf.context';
import useToast from '@hooks/useToast';
import useTranslate from '@hooks/useTranslate';
import { sendResetPasswordEmailToUser } from '@services/users/users.client.service';
import { IApiError } from 'types/error.type';
import { IUser } from 'types/user.type';

import PageTitle from '../ui/PageTitle';
import Toast from '../ui/Toast';

import DeleteUserModal from './DeleteUserModal';
import SwitchDisableUserModal from './SwitchDisableUserModal';
import UserProfilePhotoInput from './UserProfilePhotoInput';

type EditUserInformationsSectionProperties = {
	user: IUser | null;
	setUser: Dispatch<SetStateAction<IUser | null>>;
	currentUser: IUser;
}

const EditUserInformationsSection = ({ user, setUser, currentUser }: EditUserInformationsSectionProperties) => {

	const { csrfToken } = useCsrfContext();
	const { getTranslatedRole } = useTranslate({ locale: 'fr' });
	const { triggerErrorToast } = useToast({ locale: 'fr' });

	const [ isSwitchDisableUserModalOpen, setIsSwitchDisableUserModalOpen ] = useState(false);
	const [ isDeleteUserModalOpen, setIsDeleteUserModalOpen ] = useState(false);

	const onSendResetPasswordEmail = () => {
		if (user) {
			sendResetPasswordEmailToUser(user._id, csrfToken)
				.then(() => {
					toast.custom(<Toast variant="success"><FiSend /><span>Email envoyé !</span></Toast>);
				})
				.catch(error => {
					triggerErrorToast(error as IApiError);
				});
		}
	};

	const handleSwitchDisableUser = () => {
		setIsSwitchDisableUserModalOpen(true);
	};

	const handleDeleteUser = () => {
		setIsDeleteUserModalOpen(true);
	};

	const items: MenuProps['items'] = user ? [
		{
			label: 'Reinitialiser le mot de passe',
			key: 'reset_password',
			icon: <KeyOutlined />,
			onClick: onSendResetPasswordEmail,
		},
		{
		  label: 'Suspendre le compte',
		  key: 'disable',
		  icon: <LockOutlined />,
		  danger: true,
		  style: { display: user.disabled ? 'none' : 'flex' },
		  onClick: handleSwitchDisableUser,
		},
		{
		  label: 'Activer le compte',
		  key: 'enable',
		  icon: <UnlockOutlined />,
		  style: { display: user.disabled ? 'flex' : 'none' },
		  onClick: handleSwitchDisableUser,
		},
		{
		  label: 'Supprimer',
		  key: 'delete',
		  icon: <DeleteOutlined />,
		  danger: true,
		  disabled: user._id === currentUser?._id || user.role === 'admin',
		  onClick: handleDeleteUser,
		},
	] : [];

	return(
		user ?
			(
				<>
					<Space
						className="drop-shadow"
						style={ {
							borderRadius: 8,
							backgroundColor: '#F5F5F5',
							padding: '2rem',
							margin: '2rem 0',
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
						} }
					>
						<Space
							size="large"
						>
							<UserProfilePhotoInput
								setUser={ setUser }
								user={ user }
							/>
							<Space direction="vertical">
								<PageTitle style={ { margin: 0 } }>{ user.username }</PageTitle>
								<Space size="small">
									<Tag>{ getTranslatedRole(user.role) }</Tag>
									<Tag
										color={ user && user.disabled ? 'warning' : 'success' }
										icon={ user && user.disabled ? <LockOutlined /> : <UnlockOutlined /> }
									>
										{ user && user.disabled ? 'Ce compte est suspendu' : 'Ce compte est actif' }
									</Tag>
								</Space>
							</Space>
						</Space>
						<Space>
							<Dropdown
								menu={ { items } }
								placement="bottomRight"
								trigger={ [ 'click' ] }
							>
								<Button type="text">
									<Space>
										<MoreOutlined />
									</Space>
								</Button>
							</Dropdown>
						</Space>
					</Space>
					<SwitchDisableUserModal
						isOpen={ isSwitchDisableUserModalOpen }
						setIsOpen={ setIsSwitchDisableUserModalOpen }
						setUser={ setUser }
						user={ user }
					/>
					<DeleteUserModal
						isOpen={ isDeleteUserModalOpen }
						setIsOpen={ setIsDeleteUserModalOpen }
						user={ user }
					/>
				</>
			)
			: null
	);
};

export default EditUserInformationsSection;
