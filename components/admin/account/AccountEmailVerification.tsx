import { FiAlertTriangle, FiCheck, FiSend } from 'react-icons/fi';
import ButtonWithLoader from '../ui/Button/ButtonWithLoader';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorCode, ErrorDomain, IApiError } from '../../../types/error.type';
import { sendVerifyAccountEmailToUser } from '../../../services/auth/auth.client.service';

const AccountEmailVerification = () => {

    const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ emailSent, setEmailSent ] = useState(false);
    const [ counter, setCounter ] = useState(60);

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
        setErrorCode(null);
        try {
            await sendVerifyAccountEmailToUser();
            toast.custom(
                <div className='flex items-center gap-4 bg-primary-light-default text-light-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                    <FiSend /><span>Email envoyé !</span>
                </div>
            );
            startCountDown(60);
            setEmailSent(true);
        } catch (error) {
            const { response } = error as IApiError;
            if (response && response.data && response.data.code) {
                setErrorCode(response.data.code);
            }
        } finally {
            setLoading(false);
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
                emailSent && !errorCode &&
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
                    errorCode={ errorCode }
                    onClick={ handleSendVerificationEmail }
                    displayErrorMessage={ 'toast' }
                >
                    <FiCheck/>
                    <span>Vérifier mon adresse email</span>
                </ButtonWithLoader>
            }
        </div>
    );
};

export default AccountEmailVerification;
