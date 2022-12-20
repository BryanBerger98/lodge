import { Dispatch, SetStateAction } from 'react';
import { FiLock } from 'react-icons/fi';
import Button from '../ui/Button/Button';
import Modal from '../ui/Modal';

type DisableUserModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	onConfirmSwitchDisableUser: () => void;
}

const DisableUserModal = ({ isOpen, setIsOpen, onConfirmSwitchDisableUser }: DisableUserModalProperties) => {

    return (
        <Modal
            isOpen={ isOpen }
            closeModal={ () => setIsOpen(false) }
            title={ {
                text: <span className='flex items-center gap-2'><FiLock /><span>Suspendre ce compte</span></span>,
                color: 'text-warning-light-default dark:text-warning-dark-default',
            } }
        >
            <div className="my-5">
                <p className="text-sm text-secondary-dark-tint dark:text-secondary-light-shade">
					Une fois suspendu, l'utilisateur de ce compte ne pourra plus se connecter aux applications utilisant O'Keys.
                </p>
            </div>

            <div className="mt-4 flex text-sm justify-end">
                <Button
                    variant={ 'warning' }
                    onClick={ onConfirmSwitchDisableUser }
                >
					Confirmer
                </Button>
            </div>
        </Modal>
    );
};

export default DisableUserModal;
