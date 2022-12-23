import { bool, func, string, shape } from 'prop-types';
import { FiSave, FiUser } from 'react-icons/fi';
import Modal from '../ui/Modal';
import * as Yup from 'yup';
import Button from '../ui/Button/Button';
import TextField from '../forms/TextField';
import { Dispatch, FC, SetStateAction } from 'react';
import { IUser } from '../../../types/user.type';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateAccount } from '../../../services/auth/auth.client.service';
import { useCsrfContext } from '../../../context/csrf.context';

export type EditAccountInformationsFormInputs = {
	username: string;
} & FieldValues;

type AccountInformationsFormModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	user: IUser;
	dispatchUser: (user: IUser) => void;
}

const AccountInformationsFormModal: FC<AccountInformationsFormModalProperties> = ({ isOpen, setIsOpen, user, dispatchUser }) => {

    const { csrfToken } = useCsrfContext();

    const accountInfosFormSchema = Yup.object().shape({ username: Yup.string().required('Champs requis') });

    const { register, handleSubmit, formState: { errors } } = useForm<EditAccountInformationsFormInputs>({
        resolver: yupResolver(accountInfosFormSchema),
        mode: 'onTouched',
        defaultValues: { username: user ? user.username : '' },
    });

    const handleAccountInfosFormSubmit = async (values: EditAccountInformationsFormInputs) => {
        const { username } = values;
        try {

            setIsOpen(false);
            await updateAccount({ username }, csrfToken);
            dispatchUser({
                ...user,
                username,
            });
        } catch (error) {
            throw error;
        }
    };

    return (
        <Modal
            isOpen={ isOpen }
            closeModal={ () => setIsOpen(false) }
            title={ {
                text: <span className='flex items-center gap-2'><FiUser /><span>Profil</span></span>,
                color: 'text-primary-light-default dark:text-primary-dark-default',
            } }
        >
            <div className="my-5">
                <form onSubmit={ handleSubmit(handleAccountInfosFormSubmit) }>
                    <TextField
                        name='username'
                        type='text'
                        register={ register }
                        label="Nom d'utilisateur"
                        placeholder='Ex: John DOE'
                        errors={ errors as DeepMap<EditAccountInformationsFormInputs, FieldError> }
                    />
                    <div className="mt-4 flex text-sm justify-end">
                        <Button
                            variant={ 'success' }
                            type='submit'
                        >
                            <FiSave />
                            <span>Enregistrer</span>
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );

};

export default AccountInformationsFormModal;
