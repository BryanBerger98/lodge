import { Dispatch, FC, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiLock, FiUnlock, FiX } from 'react-icons/fi';
import useUsersClientService from '../../../services/users/users.client.service';
import { IUser } from '../../../types/user.type';
import Button from '../ui/Button/Button';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

type SwitchDisableUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
	setUser?: Dispatch<SetStateAction<IUser | null>>;
}

const SwitchDisableUserModal: FC<SwitchDisableUserModalProperties> = ({ isOpen, setIsOpen, user, setUser }) => {

    // const { updateUser } = useUsersContext();
    const { switchDisabledUser } = useUsersClientService();

    const onConfirmSwitchDisableUser = () => {
        switchDisabledUser(user._id)
            .then(() => {
                toast.custom(<Toast variant='success'><FiCheck /><span>Modification enregistrée</span></Toast>);
                // updateUser({
                //     ...user,
                //     disabled: !user.disabled,
                // });
                if (setUser) {
                    setUser({
                        ...user,
                        disabled: !user.disabled,
                    });
                }
            }).catch(error => {
                toast.custom(<Toast variant='danger'><FiX /><span>Une erreur est survenue</span></Toast>);
                console.error(error);
            }).finally(() => {
                setIsOpen(false);
            });
    };

    const modalTitle = (
        <span className='flex items-center gap-2'>
            { user && user.disabled && <><FiUnlock /><span>Débloquer ce compte</span></> }
            { user && !user.disabled && <><FiLock /><span>Suspendre ce compte</span></> }
        </span>
    );

    return (
        <Modal
            isOpen={ isOpen }
            closeModal={ () => setIsOpen(false) }
            title={ {
                text: modalTitle,
                color: 'text-warning-light-default dark:text-warning-dark-default',
            } }
        >
            <div className="my-5">
                <p className="text-sm text-secondary-dark-tint dark:text-secondary-light-shade">
                    { user && user.disabled && 'L\'utilisateur de ce compte pourra de nouveau se connecter.'}
                    { user && !user.disabled && 'Une fois suspendu, l\'utilisateur de ce compte ne pourra plus se connecter.' }
                </p>
            </div>
            <div className="mt-4 flex text-sm justify-end">
                <Button
                    variant='warning'
                    onClick={ onConfirmSwitchDisableUser }
                >
					Confirmer
                </Button>
            </div>
        </Modal>
    );
};

export default SwitchDisableUserModal;
