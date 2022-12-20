import { useState } from 'react';
import * as yup from 'yup';
import { FiSave } from 'react-icons/fi';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import TextField from '../forms/TextField';
import SelectField from '../forms/SelectField';
import PhoneField from '../forms/PhoneField';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatPhoneNumber, parsePhoneNumber, PhoneNumber } from '../../../utils/phone-number.util';
import { IUser } from '../../../types/user.type';

export type EditUserFormInputs = {
	email: string;
	username: string;
	phone_number: string;
	role: 'admin' | 'user';
	disabled: boolean;
	emailVerified: boolean;
} & FieldValues;

type EditUserFormProperties = {
	user?: IUser | null;
	onSubmit: (values: EditUserFormInputs) => void;
	saving: boolean;
	errorCode: string | null;
};

const defaultUser = null;

const EditUserForm = ({ user = defaultUser, onSubmit, saving, errorCode }: EditUserFormProperties) => {

    const [ phoneNumberValues, setPhoneNumberValues ] = useState<PhoneNumber | null>(user && user.phone_number ? parsePhoneNumber(user.phone_number) : null);

    const userFormSchema = yup.object({
        username: yup.string().required('Ce champs est requis.'),
        email: yup.string().email('Merci de saisir une adresse valide.').required('Ce champs est requis.'),
        phone_number: yup.string(),
        role: yup.string(),
    }).required();

    const { register, handleSubmit, formState: { errors } } = useForm<EditUserFormInputs>({
        resolver: yupResolver(userFormSchema),
        mode: 'onTouched',
        defaultValues: {
            username: user ? user.username : '',
            email: user ? user.email : '',
            phone_number: user && user.phone_number ? formatPhoneNumber(user.phone_number) : '',
            role: user ? user.role : 'user',
        },
    });

    const handleSubmitEditUserForm = (values: EditUserFormInputs) => {
        const { number } = phoneNumberValues ?? { number: '' };
        console.log(values);
        onSubmit({
            ...values,
            phone_number: number as string,
            disabled: false,
            emailVerified: false,
        });
    };

    const onChangePhoneNumber = (values: PhoneNumber | null) => {
        setPhoneNumberValues(values);
    };

    return (
        <>
            <form
                className='text-sm'
                onSubmit={ handleSubmit(handleSubmitEditUserForm) }
            >
                <TextField
                    name='username'
                    type='text'
                    register={ register }
                    label="Nom d'utilisateur"
                    placeholder='Ex: John DOE'
                    errors={ errors as DeepMap<EditUserFormInputs, FieldError> }
                    required
                />
                <div className="flex gap-2 flex-wrap">
                    <div className='grow'>
                        <TextField
                            name='email'
                            type='email'
                            label={ 'Adresse email' }
                            placeholder={ 'example@example.com' }
                            required
                            register={ register }
                            errors={ errors as DeepMap<EditUserFormInputs, FieldError> }
                            inputStyle={ { default: { className: 'grow' } } }
                        />
                    </div>
                    <div className="grow">
                        <PhoneField
                            name='phone_number'
                            onChangePhoneNumber={ onChangePhoneNumber }
                            label={ 'Téléphone' }
                            placeholder={ '+33 6 01 02 03 04' }
                            register={ register }
                            errors={ errors as DeepMap<EditUserFormInputs, FieldError> }
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <SelectField
                        name='role'
                        label={ 'Role' }
                        required={ true }
                        errors={ errors as DeepMap<EditUserFormInputs, FieldError> }
                        options={ [ {
                            value: 'admin',
                            label: 'Administrateur',
                        }, {
                            value: 'user',
                            label: 'Utilisateur',
                        } ] }
                        register={ register }
                    />
                </div>
                <ButtonWithLoader
                    variant={ 'success' }
                    type='submit'
                    saving={ saving }
                    loaderOrientation={ 'right' }
                    error={ errorCode }
                    displayErrorMessage={ true }
                >
                    <FiSave />
                    <span>Enregistrer</span>
                </ButtonWithLoader>
            </form>
        </>
    );
};

export default EditUserForm;
