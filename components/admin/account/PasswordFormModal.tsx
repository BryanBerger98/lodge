import Modal from '../ui/Modal';
import * as Yup from 'yup';
import { FiAlertCircle, FiLock, FiUnlock } from 'react-icons/fi';
import { Dispatch, FC, SetStateAction } from 'react';
import Button from '../ui/Button/Button';
import TextField from '../forms/TextField';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorCode, ErrorDomain } from '../../../types/error.type';

export type PasswordFormInputs = {
	password: string;
} & FieldValues;

type PasswordFormModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	submitFunction: (password: string) => void;
	errorCode: ErrorCode<ErrorDomain> | null;
}

const PasswordFormModal: FC<PasswordFormModalProperties> = ({ isOpen, setIsOpen, submitFunction, errorCode }) => {

    const passwordFormSchema = Yup.object().shape({ password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis') });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PasswordFormInputs>({
        resolver: yupResolver(passwordFormSchema),
        mode: 'onTouched',
    });

    const handlePasswordFormSubmit = (values: PasswordFormInputs) => {
        const { password } = values;
        submitFunction(password);
        setValue('password', '');
    };

    return(
        <Modal
            isOpen={ isOpen }
            closeModal={ () => setIsOpen(false) }
            title={ {
                text: <span className='flex items-center gap-2'><FiLock /><span>Mot de passe</span></span>,
                color: 'text-primary-light-default dark:text-primary-dark-default',
            } }
        >
            <div className="my-5">
                <form onSubmit={ handleSubmit(handlePasswordFormSubmit) }>
                    <TextField
                        name='password'
                        type='password'
                        register={ register }
                        label="Mot de passe"
                        placeholder='Tapez votre mot de passe'
                        errors={ errors as DeepMap<PasswordFormInputs, FieldError> }
                        required
                    />
                    <div className="mt-4 flex flex-row text-sm justify-end items-center gap-2">
                        {errorCode && errorCode === 'auth/wrong-password' && <span className='flex items-center text-danger-light-default dark:text-danger-dark-default'><span className='mr-1'>Mot de passe incorrect</span><FiAlertCircle /></span>}
                        <Button
                            variant='success'
                            type='submit'
                        >
                            <FiUnlock />
                            <span>Valider</span>
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PasswordFormModal;
