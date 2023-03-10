import { useState, useEffect, useCallback, memo } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCheck, FiX } from 'react-icons/fi';

import useTranslate from '../../../../hooks/useTranslate';
import type { ErrorCode, ErrorDomain } from '../../../../types/error.type';
import Toast from '../Toast';

export type ButtonSavingLoaderProperties = {
	isSaving: boolean;
	isSaved: boolean;
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
	isSaving = defaultSaving,
	isSaved = defaultSaved,
	errorCode = defaultError,
	loaderOrientation = defaultLoaderOrientation,
	displayErrorMessage = defaultDisplayErrorMessage,
}: ButtonSavingLoaderProperties) => {

	const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const triggerGetError = useCallback(() => {
		if (errorCode) {
			const errMsg = getTranslatedError(errorCode);
			if (displayErrorMessage === 'aside') {
				setErrorMessage(errMsg);
			}
			if (displayErrorMessage === 'toast') {
				toast.custom(<Toast variant="danger"><FiX /><span>{ errMsg }</span></Toast>);
			}
		}
	}, [ errorCode, displayErrorMessage, getTranslatedError ]);

	useEffect(() => {
		triggerGetError();
	}, [ errorCode, triggerGetError ]);

	return(
		<>
			<div className={ `flex items-center transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ isSaving && !isSaved && loaderOrientation === 'left' ? '-translate-x-9' : isSaving && !isSaved ? 'translate-x-9' : '' }` }>
				<AiOutlineLoading3Quarters className={ `text-2xl text-primary-light-default dark:text-primary-dark-default ${ isSaving && 'animate-spin' }` } />
			</div>
			<div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !isSaving && isSaved && loaderOrientation === 'left' ? '-translate-x-9' : !isSaving && isSaved ? 'translate-x-9' : '' }` }>
				<FiCheck className="text-2xl text-success-light-default dark:text-success-dark-default" />
			</div>
			<div className={ `flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${ loaderOrientation === 'left' ? 'left-0' : 'right-0' } ${ !isSaving && !isSaved && errorCode && loaderOrientation === 'left' ? '-translate-x-9' : !isSaving && !isSaved && errorCode ? 'translate-x-9' : '' }` }>
				<FiX className="text-2xl text-danger-light-default dark:text-danger-dark-default" />
				{ displayErrorMessage === 'aside' && errorCode && errorMessage ? <span className="text-danger-light-default dark:text-danger-dark-default text-sm absolute left-7 whitespace-nowrap">{ errorMessage }</span> : null }
			</div>
		</>
	);
};

export default memo(ButtonSavingLoader);
