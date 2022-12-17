import * as Yup from 'yup';
import { useState, Fragment, FC } from 'react';
import { useAuthContext } from '../../../context/auth.context';
import { FiAtSign, FiSave } from 'react-icons/fi';
import PasswordFormModal from './PasswordFormModal';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import TextField from '../forms/TextField';
import PhoneField from '../forms/PhoneField';
import { IUser } from '../../../types/user.type';
import useAuthClientService from '../../../services/auth/auth.client.service';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { formatPhoneNumber, parsePhoneNumber, PhoneNumber } from '../../../utils/phone-number.util';

type ContactInfosFormInputs = {
	phoneNumber: string;
	email: string;
} & FieldValues;

type AccountContactInformationsFormProperties = {
	currentUser: IUser
}

const AccountContactInformationsForm: FC<AccountContactInformationsFormProperties> = ({ currentUser }) => {

    const { dispatchCurrentUser } = useAuthContext();
    const { updateEmail, updateAccount } = useAuthClientService();

    const updateUser = async ({ email, password, phone_number }: { email?: string | null, phone_number?: string | null, password?: string | null }) => {
        try {
            if (email && password) {
                await updateEmail(email, password);
            }

            if (phone_number) {
                await updateAccount({ phone_number });
            }

            return;
        } catch (error) {
            throw error;
        }
    };

    const [ isPasswordFormModalOpen, setIsPasswordFormModalOpen ] = useState(false);
    const [ passwordError, setPasswordError ] = useState(null);
    const [ saving, setSaving ] = useState(false);
    const [ phoneNumberValues, setPhoneNumberValues ] = useState<PhoneNumber | null>(currentUser.phone_number ? parsePhoneNumber(currentUser.phone_number) : null);

    const contactInfosFormSchema = Yup.object().shape({
        phoneNumber: Yup.string(),
        email: Yup.string().email('Email invalide').required('Champs requis'),
    });

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<ContactInfosFormInputs>({
        resolver: yupResolver(contactInfosFormSchema),
        mode: 'onTouched',
        defaultValues: {
            email: currentUser.email,
            phoneNumber: currentUser.phone_number ? formatPhoneNumber(currentUser.phone_number) : '',
        },
    });

    const handleContactInfosFormSubmit = async (values: ContactInfosFormInputs) => {
        const { phoneNumber, email } = values;
        // const formattedNumber = formatPhoneNumber(phoneNumberValues?.number ?? '');

        if (currentUser.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
            setIsPasswordFormModalOpen(true);
            return;
        }

        setSaving(true);

        try {
            const { number } = phoneNumberValues ?? { number: '' };
            await updateUser({ phone_number: number });
            currentUser.phone_number = number;
            dispatchCurrentUser(currentUser);
            setSaving(false);
        } catch (error) {
            setSaving(false);
            console.error(error);
        }
    };

    const handlePasswordFormSubmit = async (password: string) => {
        setSaving(true);
        setPasswordError(null);
        const { email } = getValues();
        const { number } = phoneNumberValues ?? { number: '' };
        const updateObject = {
            email: email && email.length > 0 ? email : null,
            phone_number: number && number.length > 0 ? number : null,
        };

        try {
            await updateUser({
                ...updateObject,
                password: password && password.length >= 8 ? password : null,
            });

            if (updateObject.email) {
                currentUser.email = updateObject.email;
            }

            if (updateObject.phone_number) {
                currentUser.phone_number = updateObject.phone_number;
            }

            dispatchCurrentUser(currentUser);
            setIsPasswordFormModalOpen(false);
            setSaving(false);
        } catch (error) {
            setSaving(false);
            if (error.response && error.response.data && error.response.data.code && error.response.data.code === 'auth/wrong-password') {
                setPasswordError(error.response.data.code);
                return;
            }
            console.error(error);
        }
    };

    const onChangePhoneNumber = (values: PhoneNumber | null) => {
        setPhoneNumberValues(values);
    };

    return(
        <Fragment>
            <form onSubmit={ handleSubmit(handleContactInfosFormSubmit) }>
                <h3 className="flex items-center gap-2 text-lg mb-5">
                    <FiAtSign />
                    <span>Contact</span>
                </h3>
                <div className='mb-5'>
                    <PhoneField
                        name='phoneNumber'
                        onChangePhoneNumber={ onChangePhoneNumber }
                        placeholder='Ex: 06 01 02 03 04'
                        label='Téléphone'
                        register={ register }
                        errors={ errors as DeepMap<ContactInfosFormInputs, FieldError> }
                    />
                    <TextField
                        type='email'
                        name='email'
                        placeholder='example@example.com'
                        label='Adresse email'
                        required={ true }
                        register={ register }
                        errors={ errors as DeepMap<ContactInfosFormInputs, FieldError> }
                    />
                </div>
                <div className="mt-auto mr-auto">
                    <ButtonWithLoader
                        variant='success'
                        type='submit'
                        saving={ saving }
                        displayErrorMessage={ false }
                        loaderOrientation='right'
                        error={ passwordError }
                    >
                        <FiSave />
                        <span>Enregistrer</span>
                    </ButtonWithLoader>
                </div>
            </form>
            <PasswordFormModal
                isOpen={ isPasswordFormModalOpen }
                setIsOpen={ setIsPasswordFormModalOpen }
                submitFunction={ handlePasswordFormSubmit }
                error={ passwordError }
            />
        </Fragment>
    );
};

export default AccountContactInformationsForm;