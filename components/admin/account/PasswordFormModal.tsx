import Modal from '../ui/Modal';
import * as Yup from 'yup';
import { FiAlertCircle, FiLock, FiUnlock } from 'react-icons/fi';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Button from '../ui/Button/Button';
import { bool, func, string } from 'prop-types';
import TextField from '../forms/TextField';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export type PasswordFormInputs = {
	password: string;
} & FieldValues;

type PasswordFormModalProperties = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	submitFunction: (password: string) => void;
	error: any;
}

const PasswordFormModal: FC<PasswordFormModalProperties> = ({ isOpen, setIsOpen, submitFunction, error }) => {

    const [ formValues, setFormValues ] = useState({ password: '' });

    const passwordFormSchema = Yup.object().shape({ password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis') });

    const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormInputs>({
        resolver: yupResolver(passwordFormSchema),
        mode: 'onTouched',
    });

    const handlePasswordFormSubmit = (values: PasswordFormInputs) => {
        const { password } = values;
        submitFunction(password);
        setFormValues({ password: '' });
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
                        {error && error === 'auth/wrong-password' && <span className='flex items-center text-danger-light-default dark:text-danger-dark-default'><span className='mr-1'>Mot de passe incorrect</span><FiAlertCircle /></span>}
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

PasswordFormModal.propTypes = {
    isOpen: bool.isRequired,
    setIsOpen: func.isRequired,
    submitFunction: func.isRequired,
    error: string,
};

PasswordFormModal.defaultProps = { error: null };
