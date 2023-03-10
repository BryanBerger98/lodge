import { notification } from 'antd';
import { ReactNode } from 'react';

import { IApiError } from '../types/error.type';

import useTranslate, { TranslateHookOptions } from './useTranslate';

type ToastHookOptions = TranslateHookOptions;

const useToast = (options: ToastHookOptions) => {

	const { getTranslatedError } = useTranslate({ ...options });

	const triggerErrorToast = (error: IApiError | string) => {
		if (typeof error === 'string') {
			notification.error({
				message: 'Erreur',
				description: error,
				placement: 'bottomRight',
			});
		}
		if (typeof error !== 'string' && error.response && error.response.data && error.response.data.code) {
			const errorMessage = getTranslatedError(error.response.data.code);
			notification.error({
				message: 'Erreur',
				description: errorMessage || 'Une erreur est survenue' ,
				placement: 'bottomRight',
			});
		}
	};

	const triggerSuccessToast = (title: ReactNode, description?: ReactNode) => {
		notification.success({
			message: title,
			description,
			placement: 'bottomRight',
		  });
	};

	return {
		triggerErrorToast,
		triggerSuccessToast, 
	};

};

export default useToast;
