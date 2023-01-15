import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash, FiX } from 'react-icons/fi';
import { useCsrfContext } from '../../../context/csrf.context';
import useLoadUsersTable from '../../../hooks/useLoadUsersTable';
import useTranslate from '../../../hooks/useTranslate';
import { deleteUserById } from '../../../services/users/users.client.service';
import { IApiError } from '../../../types/error.type';
import { IUser } from '../../../types/user.type';
import Button from '../ui/Button/Button';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

type DeleteUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
}

const DeleteUserModal = ({ isOpen, setIsOpen, user }: DeleteUserModalProperties) => {

    const router = useRouter();
    const [ confirmDeleteUserInputValue, setConfirmDeleteUserInputValue ] = useState('');
    const { loadUsersTable } = useLoadUsersTable();

    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const { csrfToken } = useCsrfContext();

    const triggerErrorToast = (errorMessage: string) => {
        toast.custom(<Toast variant='danger'><FiX /><span>{ errorMessage }</span></Toast>);
    };

    const onConfirmDeleteUser = async () => {
        try {
            await deleteUserById(user._id, csrfToken);
            toast.custom(<Toast variant='success'><FiTrash /><span>Utilisateur supprimé</span></Toast>);
            loadUsersTable();
            router.push('/admin/users');
        } catch (error) {
            const apiError = error as IApiError;
            if (apiError.response && apiError.response.data && apiError.response.data.code) {
                const errorMessage = getTranslatedError(apiError.response.data.code);
                triggerErrorToast(errorMessage ?? 'Une erreur est survenue');
            }
        }
        setIsOpen(false);
        setConfirmDeleteUserInputValue('');
    };

    const onCloseModal = () => {
        setIsOpen(false);
        setConfirmDeleteUserInputValue('');
    };

    return (
        <Modal
            isOpen={ isOpen }
            closeModal={ onCloseModal }
            title={ {
                text: <span className='flex items-center gap-2'><FiTrash /><span>Supprimer ce compte</span></span>,
                color: 'text-danger-light-default dark:text-danger-dark-default',
            } }
        >
            <div className="my-5">
                <p className="text-sm text-secondary-dark-tint dark:text-secondary-light-shade">
					Les données relatives à cet utilisateur seront définitivement supprimées.
                </p>
                <p className="text-sm text-secondary-dark-tint dark:text-secondary-light-shade mb-3">
					Pour confirmer la suppression de ce compte, veuillez écrire l'adresse email de l'utilisateur (<span className='font-bold select-none'>{user.email}</span>) ci-dessous:
                </p>
                <div className="flex text-sm">
                    <input
                        type="email"
                        value={ confirmDeleteUserInputValue }
                        onChange={ (e) => setConfirmDeleteUserInputValue(e.target.value) }
                        className="p-2 rounded-md border-[0.5px] border-secondary-light-shade dark:border-secondary-dark-tint bg-white dark:bg-secondary-dark-default w-full dark:text-light-50"
                        id="deleteUserEmailInput"
                        placeholder="example@example.com"
                    />
                </div>
            </div>

            <div className="mt-4 flex text-sm justify-end">
                <Button
                    variant={ 'danger' }
                    onClick={ onConfirmDeleteUser }
                    disabled={ !confirmDeleteUserInputValue || (confirmDeleteUserInputValue && confirmDeleteUserInputValue !== user.email) ? true : false }
                >
					Confirmer
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteUserModal;
