import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiX } from 'react-icons/fi';
import { useAuthContext } from '../../../context/auth.context';
import useTranslate from '../../../hooks/useTranslate';
import { verifyEmail } from '../../../services/auth/auth.client.service';
import { IApiError } from '../../../types/error.type';
import Button from '../ui/Button/Button';
import Loader from '../ui/Loader';

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const VerifyEmailBlock = () => {
    const router = useRouter();

    const [ loading, setLoading ] = useState(true);
    const [ success, setSuccess ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const { getCurrentUser } = useAuthContext();
    const { getTranslatedError } = useTranslate({ locale: 'fr' });
    const { token } = router.query;

    useEffect(() => {
        if (token && typeof token === 'string') {
            verifyEmail(token)
                .then(() => {
                    setSuccess(true);
                    getCurrentUser();
                    setTimeout(() => {
                        router.replace('/');
                    }, 3000);
                }).catch((err: IApiError) => {
                    if (err.response && err.response.data) {
                        const errorMessage = getTranslatedError(err.response.data.code);
                        return setError(errorMessage);
                    }
                }).finally(() => {
                    setLoading(false);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return(
        <div className='flex justify-center items-center h-screen'>
            <Loader isLoading={ loading } />
            {
                !error && !loading && success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
                    <h1 className='text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3'>{ appName }</h1>
                    <h2 className='text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-5'>Adresse email vérifiée</h2>
                    <div className="flex items-center justify-center text-success-light-default dark:text-success-dark-default text-6xl mb-5">
                        <FiCheckCircle />
                    </div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <p className="mb-3">Vous allez être redirigé dans quelques secondes</p>
                        <Button
                            variant='primary'
                            href='/'
                        >
                            <span>Retour à l'application</span>
                            <FiArrowRight />
                        </Button>
                    </div>
                </div>
            }
            {
                error && !loading && !success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
                    <h1 className='text-secondary-dark-tint dark:text-secondary-light-default text-center text-3xl mb-3'>{ appName }</h1>
                    <h2 className='text-danger-light-default dark:text-danger-dark-default text-center text-2xl mb-5'>Une erreur est survenue</h2>
                    <div className="flex items-center justify-center text-danger-light-default dark:text-danger-dark-default text-6xl mb-5">
                        <FiX />
                    </div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <p className="mb-3 text-danger-light-default dark:text-danger-dark-default">{error}</p>
                        <Button
                            variant='primary'
                            href='/'
                        >
                            <span>Retour à l'application</span>
                            <FiArrowRight />
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
};

export default memo(VerifyEmailBlock);
