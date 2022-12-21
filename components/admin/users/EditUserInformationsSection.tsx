import UserProfilePhotoInput from './UserProfilePhotoInput';
import DropdownMenu from '../ui/DropdownMenu/DropdownMenu';
import DropdownItem from '../ui/DropdownMenu/DropdownItem';
import { FiKey, FiLock, FiSend, FiTrash, FiUnlock, FiX } from 'react-icons/fi';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import Toast from '../ui/Toast';
import SwitchDisableUserModal from './SwitchDisableUserModal';
import DeleteUserModal from './DeleteUserModal';
import { sendResetPasswordEmailToUser } from '../../../services/users/users.client.service';
import { IUser } from '../../../types/user.type';
import useTranslate from '../../../hooks/useTranslate';
import { useCsrfContext } from '../../../context/csrf.context';

type EditUserInformationsSectionProperties = {
	user: IUser | null;
	setUser: Dispatch<SetStateAction<IUser | null>>;
	currentUser: IUser;
}

const EditUserInformationsSection = ({ user, setUser, currentUser }: EditUserInformationsSectionProperties) => {

    const { csrfToken } = useCsrfContext();
    const { getTranslatedRole } = useTranslate({ locale: 'fr' });

    const [ isSwitchDisableUserModalOpen, setIsSwitchDisableUserModalOpen ] = useState(false);
    const [ isDeleteUserModalOpen, setIsDeleteUserModalOpen ] = useState(false);

    const onSendResetPasswordEmail = () => {
        if (user) {
            sendResetPasswordEmailToUser(user._id, csrfToken)
                .then(() => {
                    toast.custom(<Toast variant='success'><FiSend /><span>Email envoyé !</span></Toast>);
                })
                .catch(error => {
                    toast.custom(<Toast variant='danger'><FiX /><span>Une erreur est survenue</span></Toast>);
                    console.error(error);
                });
        }
    };

    return(
        <>
            <div className="bg-primary-light-default dark:bg-primary-dark-default rounded-md p-6 text-secondary-light-tint dark:text-secondary-dark-default mb-4 flex flex-wrap gap-4">
                {
                    user &&
					<UserProfilePhotoInput
					    user={ user }
					    setUser={ setUser }
					/>
                }
                <div className="my-auto">
                    <h2 className="text-2xl">{user && user.username ? user.username : <span className="italic">Sans nom</span>}</h2>
                    <p className="text-primary-lighter dark:text-secondary-dark-tint">{user && user.role && getTranslatedRole(user.role)}</p>
                </div>
                <div className="ml-auto mb-auto">
                    <DropdownMenu name={ null }>
                        <div className="p-1">
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
                            { user && user.disabled && <DropdownItem
                                icon={ <FiUnlock /> }
                                name='Débloquer le compte'
                                onClick={ () => setIsSwitchDisableUserModalOpen(true) }
                                variant='warning'
                            /> }
                        </div>
                        {
                            currentUser && user && currentUser._id !== user._id &&
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
                </div>
            </div>
            {
                user &&
				<SwitchDisableUserModal
				    isOpen={ isSwitchDisableUserModalOpen }
				    setIsOpen={ setIsSwitchDisableUserModalOpen }
				    user={ user }
				    setUser={ setUser }
				/>
            }
            {
                user &&
				<DeleteUserModal
                	isOpen={ isDeleteUserModalOpen }
				    setIsOpen={ setIsDeleteUserModalOpen }
				    user={ user }
				/>
            }
        </>
    );
};

export default EditUserInformationsSection;
