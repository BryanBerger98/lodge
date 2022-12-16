import { useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import useFieldErrorMesssage from '../../../hooks/useFieldErrorMessage';
import { SelectFieldProperties } from './types/field.type';

const DEFAULT_LABEL_STYLE = {
    className: 'text-light-600 dark:text-light-300 mb-1 ml-1',
    style: {},
};

const DEFAULT_INPUT_STYLE = {
    className: 'appearance-none p-2 rounded-md bg-light-100 dark:bg-light-700 shadow-inner',
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

const SelectField = <TFormValues extends Record<string, unknown>>({ name, options = [], inputStyle = defaultStyle, label, labelStyle = defaultStyle, placeholder, required = defaultRequired, disabled = defaultDisabled, errors, register }: SelectFieldProperties<TFormValues>) => {

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
        <div className='relative mb-3 flex flex-col text-sm'>
            { label &&
                <label
                	htmlFor={ `${ id }-${ name }` }
                	className={ mergedLabelStyle.className }
                	style={ mergedLabelStyle.style }
                >
                	{ label }
                	{ required && <span className="text-danger-light-default dark:text-danger-dark-default"> *</span> }
                </label>
            }
            <select
                id={ `${ id }-${ name }` }
                placeholder={ ` ${ placeholder } ${ required && !label ? '*' : '' }` }
                className={ mergedInputStyle.className }
                style={ mergedInputStyle.style }
                { ...register(name, {
                    required,
                    disabled,
                }) }
            >
                { options.map((op, index) => (
                    <option
                        key={ index }
                        value={ op.value }
                        disabled={ op.disabled }
                        selected={ op.selected }
                    >{ op.label }</option>
                )) }
            </select>
            <FiChevronDown className='absolute right-2 top-9' />
            <FieldErrorMessage />
        </div>
    );
};

export default SelectField;
