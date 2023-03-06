import { CheckCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { useCsrfContext } from '../../../context/csrf.context';
import useToast from '../../../hooks/useToast';
import { switchDisabledUser } from '../../../services/users/users.client.service';
import { updateUser } from '../../../store/users.slice';
import { IApiError } from '../../../types/error.type';
import { IUser } from '../../../types/user.type';
import Toast from '../ui/Toast';

type SwitchDisableUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
	setUser?: Dispatch<SetStateAction<IUser | null>>;
}

const SwitchDisableUserModal: FC<SwitchDisableUserModalProperties> = ({ isOpen, setIsOpen, user, setUser }) => {

	const { csrfToken } = useCsrfContext();
	const dispatch = useDispatch();

	const { triggerErrorToast } = useToast({ locale: 'fr' });

	const handleConfirmSwitchDisableUser = () => {
		switchDisabledUser(user._id, csrfToken)
			.then(() => {
				toast.custom(<Toast variant="success"><CheckCircleOutlined /><span>Modification enregistrée</span></Toast>);
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
			}).catch(error => {
				triggerErrorToast(error as IApiError);
			}).finally(() => {
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
