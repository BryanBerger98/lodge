import { DeleteOutlined, EditOutlined, KeyOutlined, LockOutlined, MoreOutlined, SendOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';

import { useCsrfContext } from '@context/csrf.context';
import useToast from '@hooks/useToast';
import { sendResetPasswordEmailToUser } from '@services/users/users.client.service';
import { IApiError } from 'types/error.type';
import { IUser } from 'types/user.type';

import Toast from '../ui/Toast';

import DeleteUserModal from './DeleteUserModal';
import SwitchDisableUserModal from './SwitchDisableUserModal';

type UserTableDataMenuProperties = {
	user: IUser,
	currentUser: IUser | null;
}

const UserTableDataMenu: FC<UserTableDataMenuProperties> = ({ user, currentUser }) => {

	const router = useRouter();

	const { csrfToken } = useCsrfContext();
	const [ isSwitchDisableUserModalOpen, setIsSwitchDisableUserModalOpen ] = useState(false);
	const [ isDeleteUserModalOpen, setIsDeleteUserModalOpen ] = useState(false);

	const { triggerErrorToast } = useToast({ locale: 'fr' });

	const onSendResetPasswordEmail = () => {
		sendResetPasswordEmailToUser(user._id, csrfToken)
			.then(() => {
				console.log('TOAST');
				toast.custom(<Toast><SendOutlined /><span>Email envoyé !</span></Toast>);
			})
			.catch(error => {
				triggerErrorToast(error as IApiError);
			});
	};

	const handleSwitchDisableUser = () => {
		setIsSwitchDisableUserModalOpen(true);
	};

	const handleDeleteUser = () => {
		setIsDeleteUserModalOpen(true);
	};

	const items: MenuProps['items'] = [
		{
		  label: 'Modifier',
		  key: 'edit',
		  icon: <EditOutlined />,
		  onClick: () => router.push(`/admin/users/edit/${ user._id }`),
		},
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
		  disabled: user._id === currentUser?._id,
		  onClick: handleSwitchDisableUser,
		},
		{
		  label: 'Activer le compte',
		  key: 'enable',
		  icon: <UnlockOutlined />,
		  style: { display: user.disabled ? 'flex' : 'none' },
		  disabled: user._id === currentUser?._id,
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
	];

	return (
		<>
			<Dropdown
				menu={ { items } }
				placement="bottomRight"
				trigger={ [ 'click' ] }
			>
				<Button>
					<Space>
						<MoreOutlined />
					</Space>
				</Button>
			</Dropdown>
			<SwitchDisableUserModal
				isOpen={ isSwitchDisableUserModalOpen }
				setIsOpen={ setIsSwitchDisableUserModalOpen }
				user={ user }
			/>
			<DeleteUserModal
				isOpen={ isDeleteUserModalOpen }
				setIsOpen={ setIsDeleteUserModalOpen }
				user={ user }
			/>
		</>
	);
};

export default UserTableDataMenu;
