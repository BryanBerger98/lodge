import { CSSProperties } from 'react';
import { DeepMap, FieldError } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';

type FieldMessageHookProperties<TFormValues> = {
	errors?: DeepMap<TFormValues, FieldError>;
	name: string;
	inputErrorStyle?: {
		className?: string;
		style?: CSSProperties;
	} | null;
	labelErrorStyle?: {
		className?: string;
		style?: CSSProperties;
	} | null;
};

const DEFAULT_STYLE = {
    className: 'mt-2 text-sm flex items-center text-red-500 dark:text-red-400',
    style: {},
};

export type FieldErrorMessageProperties = {
	message?: string;
	messageStyle?: {
		className: string;
		style: CSSProperties;
	},
	iconOnly?: boolean;
};

const defaultMessageStyle = {
    className: '',
    style: {},
};
const defaultIconOnly = false;

const useFieldErrorMesssage = <TFormValues extends Record<string, unknown>>({ errors, name, inputErrorStyle, labelErrorStyle }: FieldMessageHookProperties<TFormValues>) => {

    const errorMessage = errors && errors[ name as string ] && errors[ name as string ].message;
    const hasError = !!( errors && errorMessage );

    const mergedInputErrorStyle = {
        className: `ring-inset ring-2 ring-danger-light-default/50 dark:ring-danger-dark-default/50 border-danger-light-default dark:border-danger-dark-default ${ inputErrorStyle?.className ?? '' }`,
        style: { ...inputErrorStyle?.style ?? {} },
    };

    const mergedLabelErrorStyle = {
        className: `${ labelErrorStyle?.className ?? '' }`,
        style: { ...labelErrorStyle?.style ?? {} },
    };

    const FieldErrorMessage = ({ message = errorMessage, messageStyle = defaultMessageStyle, iconOnly = defaultIconOnly }: FieldErrorMessageProperties) => {
        const mergedMessageStyle = messageStyle ? {
            className: `${ DEFAULT_STYLE.className } ${ messageStyle.className }`,
            style: {
                ...DEFAULT_STYLE.style,
                ...messageStyle.style,
            },
        } : DEFAULT_STYLE;

        return (
            hasError ?
                <span
                    className={ mergedMessageStyle.className }
                    style={ mergedMessageStyle.style }
                    title={ message }
                >
                    <FiAlertCircle className='mr-1' />
                    {!iconOnly && <span>{ message }</span>}
                </span>
                : null
        );
    };

    return {
        hasError,
        FieldErrorMessage,
        inputErrorStyle: hasError ? mergedInputErrorStyle : null,
        labelErrorStyle: hasError ? mergedLabelErrorStyle : null,
    };
};

export default useFieldErrorMesssage;
