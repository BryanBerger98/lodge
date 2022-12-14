import { Fragment, useState, useEffect, useCallback } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCheck, FiX } from 'react-icons/fi';
import useTranslate from '../../../../hooks/useTranslate';

export type ButtonSavingLoaderProperties = {
	saving: boolean;
	saved: boolean;
	loaderOrientation: 'left' | 'right';
	error: string | null;
	displayErrorMessage: boolean;
};

const defaultSaving = false;
const defaultSaved = false;
const defaultError = null;
const defaultLoaderOrientation = 'right';
const defaultDisplayErrorMessage = false;

const ButtonSavingLoader = ({
    saving = defaultSaving,
    saved = defaultSaved,
    error = defaultError,
    loaderOrientation = defaultLoaderOrientation,
    displayErrorMessage = defaultDisplayErrorMessage,
}: ButtonSavingLoaderProperties) => {

    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const triggerGetError = useCallback(() => {
        if (error && displayErrorMessage) {
            const errMsg = getTranslatedError(error);
            setErrorMessage(errMsg);
        }
    }, [ error, displayErrorMessage, getTranslatedError ]);

    useEffect(() => {
        triggerGetError();
    }, [ error, triggerGetError ]);

    return(
        <Fragment>
            <div className={ `flex items-center transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ saving && !saved && loaderOrientation === 'left' ? '-translate-x-9' : saving && !saved ? 'translate-x-9' : '' }` }>
                <AiOutlineLoading3Quarters className={ `text-2xl text-primary-light-default dark:text-primary-dark-default ${ saving && 'animate-spin' }` } />
            </div>
            <div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !saving && saved && loaderOrientation === 'left' ? '-translate-x-9' : !saving && saved ? 'translate-x-9' : '' }` }>
                <FiCheck className={ 'text-2xl text-success-light-default dark:text-success-dark-default' } />
            </div>
            <div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !saving && !saved && error && loaderOrientation === 'left' ? '-translate-x-9' : !saving && !saved && error ? 'translate-x-9' : '' }` }>
                <FiX className={ 'text-2xl text-danger-light-default dark:text-danger-dark-default' } />
                { displayErrorMessage && error && errorMessage && <span className='text-danger-light-default dark:text-danger-dark-default text-sm absolute left-7 whitespace-nowrap'>{errorMessage}</span> }
            </div>
        </Fragment>
    );
};

export default ButtonSavingLoader;
