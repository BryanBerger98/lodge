import { FiSend } from 'react-icons/fi';
import * as Yup from 'yup';
import Button from '../../../components/admin/ui/Button/Button';
import { FC, useEffect, useState } from 'react';
import ThemeToggleSwitch from '../../../components/admin/ui/ThemeToggleSwitch';
import TextField from '../../../components/admin/forms/TextField';
import csrf from '../../../utils/csrf.util';
import { useCsrfContext } from '../../../context/csrf.context';
import Loader from '../../../components/admin/ui/Loader';
import { GetServerSidePropsContextWithCsrf } from '../../../types/ssr.type';
import useTranslate from '../../../hooks/useTranslate';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IApiError } from '../../../types/error.type';
import { sendResetPasswordEmailToUserByEmail } from '../../../services/auth/auth.client.service';

type ForgotPasswordFormValues = {
	email: string;
} & FieldValues;

type ForgotPasswordPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const ForgotPasswordPage: FC<ForgotPasswordPageProperties> = ({ csrfToken }) => {

    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ emailSent, setEmailSent ] = useState<boolean>(false);
    const [ counter, setCounter ] = useState<number>(60);

    const { dispatchCsrfToken } = useCsrfContext();
    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const forgotPasswordFormSchema = Yup.object().shape({ email: Yup.string().email('Email invalide').required('Champs requis') });

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: yupResolver(forgotPasswordFormSchema),
        mode: 'onTouched',
    });

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ csrfToken, dispatchCsrfToken ]);

    const startCountDown = (delay: number) => {
        setCounter(delay);
        let t = delay;
        const timer = setInterval(() => {
            t--;
            setCounter(t);
            if (t === 0) {
                clearInterval(timer);
                setEmailSent(false);
            }
        }, 1000);
    };

    const handleForgotPasswordFormSubmit = async (values: ForgotPasswordFormValues) => {
        const { email } = values;
        setLoading(true);
        try {
            await sendResetPasswordEmailToUserByEmail(email, csrfToken);
            setLoading(false);
            setEmailSent(true);
            startCountDown(60);
        } catch (err) {
            const apiError = err as IApiError;
            setLoading(false);
            if (apiError.response && apiError.response.data && apiError.response.data.code) {
                const errorMessage = getTranslatedError(apiError.response.data.code);
                setError(errorMessage);
                return;
            }
            console.error(apiError);
        }
    };


    return(
        <div className='flex justify-center items-center h-full'>
            <Loader isLoading={ loading } />
            <>
                <div className='absolute top-5 right-5'>
                    <ThemeToggleSwitch />
                </div>
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
                    <h1 className='text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3'>{ appName }</h1>
                    <h2 className='text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-6'>Mot de passe oublié</h2>
                    <form onSubmit={ handleSubmit(handleForgotPasswordFormSubmit) }>
                        <TextField
                            name="email"
                            type="email"
                            label="Adresse email"
                            required={ true }
                            placeholder="example@example.com"
                            register={ register }
                            errors={ errors as DeepMap<ForgotPasswordFormValues, FieldError> }
                        />
                        <div className="flex flex-col justify-center items-center text-sm mt-5">
                            {error && <p className='text-sm text-danger-light-default dark:text-danger-dark-default mb-5'>{error}</p>}
                            { !emailSent &&
                                        <>
                                            <Button
                                                variant={ 'primary-gradient' }
                                                type='submit'
                                            >
                                                <FiSend />
                                                <span>Envoyer</span>
                                            </Button>
                                            <Button
                                                variant={ 'link' }
                                                href='/admin/auth/signin'
                                            >
                                                Retour
                                            </Button>
                                        </>
                            }
                            {
                                emailSent &&
                                        <>
                                            <p className='mb-3 text-success-light-default dark:text-success-dark-default'>Email envoyé !</p>
                                            <div className="px-3 py-2 bg-secondary-light-shade text-secondary-dark-default dark:bg-secondary-dark-default dark:text-secondary-light-shade rounded-md">
                                                Renvoyer un email dans {counter} secondes
                                            </div>
                                        </>
                            }
                        </div>
                    </form>
                </div>
            </>
        </div>
    );
};

export default ForgotPasswordPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
    await csrf(req, res);

    return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
