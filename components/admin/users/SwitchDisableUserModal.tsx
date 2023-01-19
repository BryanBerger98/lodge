import { Dispatch, FC, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiLock, FiUnlock } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useCsrfContext } from '../../../context/csrf.context';
import useToast from '../../../hooks/useToast';
import { switchDisabledUser } from '../../../services/users/users.client.service';
import { updateUser } from '../../../store/users.slice';
import { IApiError } from '../../../types/error.type';
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

    const { csrfToken } = useCsrfContext();
    const dispatch = useDispatch();

    const { triggerErrorToast } = useToast({ locale: 'fr' });

    const onConfirmSwitchDisableUser = () => {
        switchDisabledUser(user._id, csrfToken)
            .then(() => {
                toast.custom(<Toast variant='success'><FiCheck /><span>Modification enregistrée</span></Toast>);
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
