import { useForm, FieldValues, DeepMap, FieldError } from 'react-hook-form';
import TextField from '../forms/TextField';
// import Button from '../ui/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
// import { FiLogIn } from 'react-icons/fi';

export type LoginFormInputs = {
	email: string;
	password: string;
} & FieldValues;

export type LoginFormProperties = {
	onSubmit: (values: LoginFormInputs) => void;
	requestError: string | null;
}

const LoginForm = ({ onSubmit, requestError = null }: LoginFormProperties) => {

    const loginFormSchema = yup.object({
        email: yup.string().email('Merci de saisir une adresse valide.').required('Ce champs est requis.'),
        password: yup.string().min(8, 'Au moins 8 caractères.').required('Ce champs est requis.'),
    }).required();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginFormSchema),
        mode: 'onTouched',
    });

    return (
        <form onSubmit={ handleSubmit(onSubmit) }>
            <TextField
                name='email'
                type='email'
                register={ register }
                label='Adresse email'
                placeholder='example@example.com'
                errors={ errors as DeepMap<LoginFormInputs, FieldError> }
                required
            />
            <TextField
                name='password'
                type='password'
                register={ register }
                label='Mot de passe'
                placeholder='Au moins 8 caractères'
                errors={ errors as DeepMap<LoginFormInputs, FieldError> }
                required
            />
            <div className="flex flex-col justify-center items-center text-sm">
                { requestError && <p className='text-sm text-danger-light-default dark:text-danger-dark-default mb-5'>{ requestError }</p> }
                <Button
                    type='primary'
                    htmlType='submit'
                    icon={ <LoginOutlined /> }
                >
					Connexion
                </Button>
                {/* <Button
                    variant={ 'primary-gradient' }
                    type='submit'
                >
                    <FiLogIn />
                    <span>Connexion</span>
                </Button> */}

                {/* <Button
                    variant={ 'link' }
                    href='/admin/auth/signup'
                >
					Pas de compte ? S'inscrire ici
                </Button> */}
                {/* <Button
                    variant={ 'link' }
                    href='/admin/auth/forgot-password'
                >
					Mot de passe oublié ?
                </Button> */}
            </div>
        </form>
    );
};

export default LoginForm;
