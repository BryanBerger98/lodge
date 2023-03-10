import { DeleteOutlined } from '@ant-design/icons';
import { Space, Modal, Input } from 'antd';
import { useRouter } from 'next/router';
import { ChangeEventHandler, Dispatch, SetStateAction, useState } from 'react';

import { useCsrfContext } from '@context/csrf.context';
import useLoadReduxTable from '@hooks/useLoadReduxTable';
import useToast from '@hooks/useToast';
import { deleteUserById } from '@services/users/users.client.service';
import { fetchUsers, selectUsersState, setUsersTableConfig } from '@store/users.slice';
import { IApiError } from 'types/error.type';

import { IUser } from '../../../types/user.type';

type DeleteUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
}

const DeleteUserModal = ({ isOpen, setIsOpen, user }: DeleteUserModalProperties) => {

	const router = useRouter();
	const [ confirmDeleteUserInputValue, setConfirmDeleteUserInputValue ] = useState('');
	const { loadTable: loadUsersTable } = useLoadReduxTable({
		dataList: [],
		dataFetcher: fetchUsers,
		stateSelector: selectUsersState,
		tableConfigSetter: setUsersTableConfig,
	});

	const { csrfToken } = useCsrfContext();

	const { triggerErrorToast, triggerSuccessToast } = useToast({ locale: 'fr' });

	const handleConfirmDeleteUser = async () => {
		try {
			await deleteUserById(user._id, csrfToken);
			triggerSuccessToast('Utilisateur supprimé');
			loadUsersTable();
			router.push('/admin/users');
		} catch (error) {
			triggerErrorToast(error as IApiError);
		}
		setIsOpen(false);
		setConfirmDeleteUserInputValue('');
	};

	const handleCloseModal = () => {
		setIsOpen(false);
		setConfirmDeleteUserInputValue('');
	};

	const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
		setConfirmDeleteUserInputValue(event.target.value);
	};

	return (
		<Modal
			cancelText="Annuler"
			okButtonProps={ {
				danger: true,
				disabled: confirmDeleteUserInputValue !== user.email,
			} }
			okText="Confirmer"
			open={ isOpen }
			title={
				<Space
					className="text-danger"
					size="middle"
					style={ { fontSize: '1.25rem' } }
				>
					<DeleteOutlined /><span>Supprimer ce compte</span>
				</Space>
		   }
			centered
			onCancel={ handleCloseModal }
			onOk={ handleConfirmDeleteUser }
		>
			<div>
				<p>
					Les données relatives à cet utilisateur seront définitivement supprimées.
				</p>
				<p>
					Pour confirmer la suppression de ce compte, veuillez écrire l&apos;adresse email de l&apos;utilisateur (
					<span
						style={ {
							fontWeight: 'bold',
							userSelect: 'none',
						} }
					>
						{ user.email }
					</span>
					) ci-dessous:
				</p>
				<Input
					id="deleteUserEmailInput"
					placeholder="example@example.com"
					type="email"
					value={ confirmDeleteUserInputValue }
					onChange={ handleChangeInput }
				/>
			</div>
		</Modal>
	);
};

export default DeleteUserModal;
