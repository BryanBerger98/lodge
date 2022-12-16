import { useState } from 'react';
import { FiLock, FiSave } from 'react-icons/fi';
import * as Yup from 'yup';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import TextField from '../forms/TextField';
import useAuthClientService from '../../../services/auth/auth.client.service';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';

type ChangePasswordFormInputs = {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
} & FieldValues;

const AccountChangePasswordForm = () => {

    const [ saving, setSaving ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState(null);

    const { updatePassword } = useAuthClientService();

    const changePasswordFormSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Champs requis'),
        newPassword: Yup.string().notOneOf([ Yup.ref('oldPassword') ], 'Doit être différent de votre ancien mot de passe').min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmNewPassword: Yup.string().oneOf([ Yup.ref('newPassword'), null ], 'Doit être identique au mot de passe').required('Champs requis'),
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ChangePasswordFormInputs>({
        resolver: yupResolver(changePasswordFormSchema),
        mode: 'onTouched',
    });

    const handleChangePasswordFormSubmit = async (values: ChangePasswordFormInputs) => {
        setSaving(true);
        setErrorCode(null);
        const { newPassword, oldPassword } = values;

        try {
            await updatePassword(oldPassword, newPassword);
            setSaving(false);
        } catch (error) {
            setSaving(false);
            if (error.response && error.response.data && error.response.data.code && error.response.data.code === 'auth/wrong-password') {
                setErrorCode(error.response.data.code);
                return;
            }
            console.error(error);
        }

        setValue('oldPassword', '');
        setValue('newPassword', '');
        setValue('confirmNewPassword', '');
    };

    return(
        <form onSubmit={ handleSubmit(handleChangePasswordFormSubmit) }>
			 <h3 className="flex items-center gap-2 text-lg mb-5">
                <FiLock />
                <span>Mot de passe</span>
            </h3>
            <div className="mb-5">
                <TextField
                    name="oldPassword"
                    type="password"
                    register={ register }
                    placeholder="********"
                    label="Mot de passe actuel"
                    errors={ errors as DeepMap<ChangePasswordFormInputs, FieldError> }
                />
                <TextField
                    name="newPassword"
                    type="password"
                    register={ register }
                    placeholder="********"
                    label="Nouveau mot de passe"
                    errors={ errors as DeepMap<ChangePasswordFormInputs, FieldError> }
                />
                <TextField
                    name="confirmNewPassword"
                    type="password"
                    placeholder="********"
                    label="Confirmer mot de passe"
                    register={ register }
                    errors={ errors as DeepMap<ChangePasswordFormInputs, FieldError> }
                />
            </div>
            <div className="mt-auto mr-auto">
                <ButtonWithLoader
                    variant='success'
                    type='submit'
                    saving={ saving }
                    loaderOrientation='right'
                    error={ errorCode }
                    displayErrorMessage={ true }
                >
                    <FiSave />
                    <span>Enregistrer</span>
                </ButtonWithLoader>
            </div>
        </form>
    );
};

export default AccountChangePasswordForm;
