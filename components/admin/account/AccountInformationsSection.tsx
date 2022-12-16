import { FiEdit } from 'react-icons/fi';
import Button from '../ui/Button/Button';
import { FC, useState } from 'react';
import { useAuthContext } from '../../../context/auth.context';
import useTranslate from '../../../hooks/useTranslate';
import AccountProfilePhotoInput from './AccountProfilePhotoInput';
import AccountInformationsFormModal from './AccountInformationsFormModal';
import { IUser } from '../../../types/user.type';

type AccountInformationsSectionProperties = {
	currentUser: IUser | null;
}

const AccountInformationsSection: FC<AccountInformationsSectionProperties> = ({ currentUser }) => {

    const { dispatchCurrentUser } = useAuthContext();
    const { getTranslatedRole } = useTranslate({ locale: 'fr' });

    const [ isEditAccountInfosModalOpen, setIsEditAccountInfosModalOpen ] = useState(false);

    return(
        <>
            <div className="bg-primary-light-default dark:bg-primary-dark-default rounded-md p-6 text-light-50 dark:text-light-800 mb-4 flex flex-wrap gap-4">
                { currentUser && <AccountProfilePhotoInput currentUser={ currentUser } /> }
                <div className="my-auto mr-auto">
                    <h2 className="text-2xl">{currentUser && currentUser.username ? currentUser.username : <span className="italic">Sans nom</span>}</h2>
                    <p className="text-indigo-200 dark:text-light-700">{currentUser && currentUser.role && getTranslatedRole(currentUser.role)}</p>
                </div>
                <div className="mx-auto md:mx-0 lg:mr-0 mb-auto text-sm">
                    <Button
                        variant='secondary'
                        onClick={ () => setIsEditAccountInfosModalOpen(true) }
                    >
                        <FiEdit />
                        <span>Modifier</span>
                    </Button>
                </div>
            </div>
            {
                currentUser &&
				<AccountInformationsFormModal
				    isOpen={ isEditAccountInfosModalOpen }
				    setIsOpen={ setIsEditAccountInfosModalOpen }
				    dispatchUser={ dispatchCurrentUser }
				    user={ currentUser }
				/>
            }
        </>
    );
};

export default AccountInformationsSection;
