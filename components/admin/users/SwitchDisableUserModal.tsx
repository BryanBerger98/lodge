import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';

import { useCsrfContext } from '../../../context/csrf.context';
import useToast from '../../../hooks/useToast';
import { switchDisabledUser } from '../../../services/users/users.client.service';
import { updateUser } from '../../../store/users.slice';
import { IUser } from '../../../types/user.type';

type SwitchDisableUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
	setUser?: Dispatch<SetStateAction<IUser | null>>;
}

const SwitchDisableUserModal: FC<SwitchDisableUserModalProperties> = ({ isOpen, setIsOpen, user, setUser }) => {

	const { csrfToken } = useCsrfContext();
	const dispatch = useDispatch();

	const { triggerErrorToast, triggerSuccessToast } = useToast({ locale: 'fr' });

	const handleConfirmSwitchDisableUser = () => {
		switchDisabledUser(user._id, csrfToken)
			.then(() => {
				triggerSuccessToast('Modification enregistrée', `L'utilisateur ${ !user.disabled ? 'ne pourra plus se connecter.' : 'pourra de nouveau se connecter.' }`);
				dispatch(updateUser({
					...user,
					disabled: !user.disabled,
				}));
				if (setUser) {
					setUser({
						...user,
						disabled: !user.disabled,
					});
				}
			}).catch(triggerErrorToast)
			.finally(() => {
				setIsOpen(false);
			});
	};

	const handleCancel = () => setIsOpen(false);

	const modalTitle = (
		<Space
			className="text-warning"
			size="middle"
			style={ { fontSize: '1.25rem' } }
		>
			{ user && user.disabled ? <><UnlockOutlined /><span>Débloquer ce compte</span></> : null }
			{ user && !user.disabled ? <><LockOutlined /><span>Suspendre ce compte</span></> : null }
		</Space>
	);

	return (
		<Modal
			cancelText="Annuler"
			okButtonProps={ { className: 'btn-warning' } }
			okText="Confirmer"
			open={ isOpen }
			title={ modalTitle }
			centered
			onCancel={ handleCancel }
			onOk={ handleConfirmSwitchDisableUser }
		>
			<div className="my-5">
				<p className="text-sm text-secondary-dark-tint dark:text-secondary-light-shade">
					{ user && user.disabled ? 'L\'utilisateur de ce compte pourra de nouveau se connecter.' : null }
					{ user && !user.disabled ? 'Une fois suspendu, l\'utilisateur de ce compte ne pourra plus se connecter.' : null }
				</p>
			</div>
		</Modal>
	);
};

export default SwitchDisableUserModal;
