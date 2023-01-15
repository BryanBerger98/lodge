import { FiSave, FiUser } from 'react-icons/fi';
import Modal from '../ui/Modal';
import * as Yup from 'yup';
import TextField from '../forms/TextField';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { IUser } from '../../../types/user.type';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateAccount } from '../../../services/auth/auth.client.service';
import { useCsrfContext } from '../../../context/csrf.context';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import { ErrorCode, ErrorDomain, IApiError } from '../../../types/error.type';

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

    const [ saving, setSaving ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);

    const accountInfosFormSchema = Yup.object().shape({ username: Yup.string().required('Champs requis') });

    const { register, handleSubmit, formState: { errors } } = useForm<EditAccountInformationsFormInputs>({
        resolver: yupResolver(accountInfosFormSchema),
        mode: 'onTouched',
        defaultValues: { username: user ? user.username : '' },
    });

    const handleAccountInfosFormSubmit = async (values: EditAccountInformationsFormInputs) => {
        const { username } = values;
        try {
            setSaving(true);
            await updateAccount({ username }, csrfToken);
            dispatchUser({
                ...user,
                username,
            });
            setSaving(false);
            setIsOpen(false);
        } catch (error) {
            setSaving(false);
            const apiError = error as IApiError;
            if (apiError.response && apiError.response.data && apiError.response.data.code) {
                setErrorCode(apiError.response.data.code);
                return;
            }
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
                        <ButtonWithLoader
                            variant='success'
                            type='submit'
                            saving={ saving }
                            loaderOrientation='left'
                            errorCode={ errorCode }
                            displayErrorMessage={ 'toast' }
                        >
                            <FiSave />
                            <span>Enregistrer</span>
                        </ButtonWithLoader>
                    </div>
                </form>
            </div>
        </Modal>
    );

};

export default AccountInformationsFormModal;
