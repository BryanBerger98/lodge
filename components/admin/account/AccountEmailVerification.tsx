import { FiAlertTriangle, FiCheck, FiSend, FiX } from 'react-icons/fi';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthClientService from '../../../services/auth/auth.client.service';
import useTranslate from '../../../hooks/useTranslate';

const AccountEmailVerification = () => {

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ emailSent, setEmailSent ] = useState(false);
    const [ counter, setCounter ] = useState(60);

    const { sendVerifyAccountEmailToUser } = useAuthClientService();
    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const startCountDown = (delay: number) => {
        setCounter(delay);
        let newDelay = delay;
        const timer = setInterval(() => {
            newDelay--;
            setCounter(newDelay);
            if (newDelay === 0) {
                clearInterval(timer);
                setEmailSent(false);
            }
        }, 1000);
    };

    const handleSendVerificationEmail = async () => {
        setLoading(true);
        setError(null);
        try {
            await sendVerifyAccountEmailToUser();
            toast.custom(
                <div className='flex items-center gap-4 bg-primary-light-default text-light-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                    <FiSend /><span>Email envoyé !</span>
                </div>
            );
            setLoading(false);
            startCountDown(60);
            setEmailSent(true);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.code) {
                const errorMessage = getTranslatedError(err.response.data.code);
                setError(errorMessage);
                toast.custom(
                    <div className='flex items-center gap-4 bg-danger-light-default text-light-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                        <FiX /><span>{errorMessage}</span>
                    </div>
                );
            } else {
                console.error(error);
                toast.custom(
                    <div className='flex items-center gap-4 bg-danger-light-default text-light-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                        <FiX /><span>Une erreur est survenue</span>
                    </div>
                );
            }
        }
    };

    return(
        <div className="p-5 bg-white dark:bg-light-900 drop-shadow mb-5 rounded-md flex items-center justify-between">
            <div>
                <h3 className="flex items-center gap-2 text-lg text-danger-light-default dark:text-danger-dark-default">
                    <FiAlertTriangle />
                    <span>Votre adresse email n'est pas vérifiée</span>
                </h3>
            </div>
            {
                emailSent && !error &&
                <div className="px-3 py-2 bg-light-300 dark:bg-light-700 dark:text-light-200 rounded-md">
                    Renvoyer un email dans {counter} secondes
                </div>
            }
            {
                !emailSent &&
                <ButtonWithLoader
                    loaderOrientation={ 'left' }
                    type={ 'button' }
                    variant={ 'primary' }
                    saving={ loading }
                    error={ error }
                    onClick={ handleSendVerificationEmail }
                    displayErrorMessage={ false }
                >
                    <FiCheck/>
                    <span>Vérifier mon adresse email</span>
                </ButtonWithLoader>
            }
        </div>
    );
};

export default AccountEmailVerification;
