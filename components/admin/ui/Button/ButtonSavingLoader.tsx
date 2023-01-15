import { Fragment, useState, useEffect, useCallback, memo } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCheck, FiX } from 'react-icons/fi';
import useTranslate from '../../../../hooks/useTranslate';
import type { ErrorCode, ErrorDomain } from '../../../../types/error.type';
import Toast from '../Toast';

export type ButtonSavingLoaderProperties = {
	saving: boolean;
	saved: boolean;
	loaderOrientation: 'left' | 'right';
	errorCode: ErrorCode<ErrorDomain> | null;
	displayErrorMessage: 'aside' | 'toast' | 'none';
};

const defaultSaving = false;
const defaultSaved = false;
const defaultError = null;
const defaultLoaderOrientation = 'right';
const defaultDisplayErrorMessage = 'none';

const ButtonSavingLoader = ({
    saving = defaultSaving,
    saved = defaultSaved,
    errorCode = defaultError,
    loaderOrientation = defaultLoaderOrientation,
    displayErrorMessage = defaultDisplayErrorMessage,
}: ButtonSavingLoaderProperties) => {

    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const triggerGetError = useCallback(() => {
        if (errorCode && displayErrorMessage) {
            const errMsg = getTranslatedError(errorCode);
            if (displayErrorMessage === 'aside') {
                setErrorMessage(errMsg);
            }
            return errMsg;
        }
    }, [ errorCode, displayErrorMessage, getTranslatedError ]);

    useEffect(() => {
        const errMsg = triggerGetError();
        if (displayErrorMessage === 'toast' && errorCode) {
            toast.custom(<Toast variant='danger'><FiX /><span>{ errMsg }</span></Toast>);
        }
    }, [ errorCode, triggerGetError, displayErrorMessage ]);
    return(
        <Fragment>
            <div className={ `flex items-center transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ saving && !saved && loaderOrientation === 'left' ? '-translate-x-9' : saving && !saved ? 'translate-x-9' : '' }` }>
                <AiOutlineLoading3Quarters className={ `text-2xl text-primary-light-default dark:text-primary-dark-default ${ saving && 'animate-spin' }` } />
            </div>
            <div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !saving && saved && loaderOrientation === 'left' ? '-translate-x-9' : !saving && saved ? 'translate-x-9' : '' }` }>
                <FiCheck className={ 'text-2xl text-success-light-default dark:text-success-dark-default' } />
            </div>
            <div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !saving && !saved && errorCode && loaderOrientation === 'left' ? '-translate-x-9' : !saving && !saved && errorCode ? 'translate-x-9' : '' }` }>
                <FiX className={ 'text-2xl text-danger-light-default dark:text-danger-dark-default' } />
                { displayErrorMessage === 'aside' && errorCode && errorMessage && <span className='text-danger-light-default dark:text-danger-dark-default text-sm absolute left-7 whitespace-nowrap'>{errorMessage}</span> }
            </div>
        </Fragment>
    );
};

export default memo(ButtonSavingLoader);
