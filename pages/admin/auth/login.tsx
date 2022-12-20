import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginForm, { LoginFormInputs } from '../../../components/admin/auth/LoginForm';
import Loader from '../../../components/admin/ui/Loader';
import ThemeToggleSwitch from '../../../components/admin/ui/ThemeToggleSwitch';
import csrf from '../../../utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from '../../../types/ssr.type';
import { useCsrfContext } from '../../../context/csrf.context';
import { signIn } from 'next-auth/react';

type LoginPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const LoginPage = ({ csrfToken }: LoginPageProperties) => {

    const router = useRouter();
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);

    const { dispatchCsrfToken } = useCsrfContext();

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ dispatchCsrfToken, csrfToken ]);

    const handleSubmitLoginForm = (values: LoginFormInputs) => {
        setLoading(true);
        setError(null);
        const { email, password } = values;
        signIn('credentials', {
            redirect: false,
            email,
            password,
        })
            .then(() => {
                router.replace('/admin/dashboard');
            })
            .catch(() => {
                setLoading(false);
                setError('Identifiant ou mot de passe incorrects');
                return;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return <div className='flex justify-center items-center h-full'>
        <Loader isLoading={ loading } />
        <>
            <div className='absolute top-5 right-5'>
                <ThemeToggleSwitch />
            </div>
            <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6 relative">
                <h1 className='text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3'>{ appName }</h1>
                <h2 className='text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-5'>Connexion</h2>
                <LoginForm
                    onSubmit={ handleSubmitLoginForm }
                    requestError={ error }
                />
            </div>
        </>
    </div>;
};

export default LoginPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf ) => {
    await csrf(req, res);

    return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
