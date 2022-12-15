import React, { useId } from 'react';
import useFieldErrorMesssage from '../../../hooks/useFieldErrorMessage';
import { TextFieldProperties } from './types/field.type';

const DEFAULT_LABEL_STYLE = {
    className: 'text-gray-600 dark:text-gray-300 mb-1 ml-1',
    style: {},
};

const DEFAULT_INPUT_STYLE = {
    className: 'p-2 rounded-md bg-gray-100 dark:bg-gray-700 shadow-inner dark:text-gray-50 focus:outline outline-primary-light-default dark:outline-primary-dark-default',
    style: {},
};

const defaultRequired = false;
const defaultDisabled = false;
const defaultStyle = {
    default: {
        className: '',
    	style: {},
    },
    error: {
        className: '',
    	style: {},
    },
};

const TextField = <TFormValues extends Record<string, unknown>>({ name, type, label, inputStyle = defaultStyle, labelStyle = defaultStyle, placeholder, required = defaultRequired, disabled = defaultDisabled, register, errors = undefined }: TextFieldProperties<TFormValues>) => {

    const id = useId();

    const { FieldErrorMessage, labelErrorStyle, inputErrorStyle } = useFieldErrorMesssage<TFormValues>({
        errors,
        name,
        inputErrorStyle: inputStyle?.error ?? null,
        labelErrorStyle: inputStyle?.error ?? null,
    });

    const mergedInputStyle = {
        className: `${ DEFAULT_INPUT_STYLE.className } ${ inputStyle?.default?.className ?? '' } ${ inputErrorStyle?.className ?? '' }`,
        style: {
            ...DEFAULT_INPUT_STYLE.style,
            ...inputStyle?.default?.style ?? {},
            ...inputErrorStyle?.style ?? {},
        },
    };

    const mergedLabelStyle = {
        className: `${ DEFAULT_LABEL_STYLE.className } ${ labelStyle?.default?.className ?? '' } ${ labelErrorStyle?.className ?? '' }`,
        style: {
            ...DEFAULT_LABEL_STYLE.style,
            ...labelStyle?.default?.style ?? {},
            ...labelErrorStyle?.style ?? {},
        },
    };

    return (
        <div className='mb-3 flex flex-col text-sm'>
            { label &&
                <label
                	htmlFor={ `${ id }-${ name }` }
                	className={ mergedLabelStyle.className }
                	style={ mergedLabelStyle.style }
                >
                	{label}
                	{required && <span className="text-red-500 dark:text-red-400"> *</span>}
                </label>
            }
            <input
                type={ type }
                id={ `${ id }-${ name }` }
                placeholder={ `${ placeholder } ${ required && !label ? '*' : '' }` }
                className={ mergedInputStyle.className }
                disabled={ disabled }
                style={ mergedInputStyle.style }
                { ...register(name, {
                    required,
                    disabled,
                }) }
            />
            <FieldErrorMessage />
        </div>
    );
};

export default TextField;
