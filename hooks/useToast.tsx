import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import Toast from '../components/admin/ui/Toast';
import { IApiError } from '../types/error.type';
import useTranslate, { TranslateHookOptions } from './useTranslate';

type ToastHookOptions = TranslateHookOptions;

const useToast = (options: ToastHookOptions) => {

    const { getTranslatedError } = useTranslate({ ...options });

    const triggerErrorToast = (error: IApiError | string) => {
        if (typeof error === 'string') {
            toast.custom(<Toast variant='danger'><FiX /><span>{ error }</span></Toast>);
        }
        if (typeof error !== 'string' && error.response && error.response.data && error.response.data.code) {
            const errorMessage = getTranslatedError(error.response.data.code);
            toast.custom(<Toast variant='danger'><FiX /><span>{ errorMessage ?? 'Une erreur est survenue' }</span></Toast>);
        }
    };

    return { triggerErrorToast };

};

export default useToast;
