import { FC, useState } from 'react';
import { FiEdit, FiKey, FiLock, FiSend, FiTrash, FiUnlock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import DropdownItem from '../ui/DropdownMenu/DropdownItem';
import DropdownMenu from '../ui/DropdownMenu/DropdownMenu';
import Toast from '../ui/Toast';
import SwitchDisableUserModal from './SwitchDisableUserModal';
import DeleteUserModal from './DeleteUserModal';
import { IUser } from '../../../types/user.type';
import { sendResetPasswordEmailToUser } from '../../../services/users/users.client.service';
import { useCsrfContext } from '../../../context/csrf.context';
import { IApiError } from '../../../types/error.type';
import useToast from '../../../hooks/useToast';

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
                toast.custom(<Toast><FiSend /><span>Email envoyé !</span></Toast>);
            })
            .catch(error => {
                triggerErrorToast(error as IApiError);
            });
    };

    return (
        <>
            <DropdownMenu name={ null }>
                <div className="p-1">
                    <DropdownItem
                        icon={ <FiEdit /> }
                        name='Modifier'
                        onClick={ () => router.push(`/admin/users/edit/${ user._id }`) }
                    />
                    { user && !user.disabled &&
						<>
						    <DropdownItem
						        icon={ <FiKey /> }
						        name='Réinitialiser le mot de passe'
						        onClick={ onSendResetPasswordEmail }
						    />
						    {
						        currentUser && currentUser._id !== user._id &&
								<DropdownItem
								    icon={ <FiLock /> }
								    name='Suspendre le compte'
								    onClick={ () => setIsSwitchDisableUserModalOpen(true) }
								    variant='warning'
								/>
						    }
						</>
                    }
                    { user && user.disabled &&
						<DropdownItem
					    icon={ <FiUnlock /> }
					    name='Débloquer le compte'
					    onClick={ () => setIsSwitchDisableUserModalOpen(true) }
					    variant='warning'
						/>
                    }
                </div>
                {
                    currentUser && currentUser._id !== user._id &&
					<div className="p-1">
					    <DropdownItem
					        icon={ <FiTrash /> }
					        name='Supprimer'
					        variant='danger'
					        onClick={ () => setIsDeleteUserModalOpen(true) }
					    />
					</div>
                }
            </DropdownMenu>
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
