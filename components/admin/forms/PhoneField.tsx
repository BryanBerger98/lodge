import { AsYouType, CountryCode, getCountries } from 'libphonenumber-js';
import { BaseSyntheticEvent, ChangeEventHandler, useId, useState } from 'react';

import useFieldErrorMesssage from '../../../hooks/useFieldErrorMessage';

import { PhoneFieldProperties } from './types/field.type';

const DEFAULT_LABEL_STYLE = {
	className: 'text-gray-600 dark:text-gray-300 mb-1 ml-1',
	style: {},
};

const DEFAULT_INPUT_STYLE = {
	className: 'p-2 rounded-r-md bg-gray-100 dark:bg-gray-700 dark:text-gray-50 grow shadow-inner',
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

const PhoneField = <TFormValues extends Record<string, unknown>>({ name, label, inputStyle = defaultStyle, labelStyle = defaultStyle, onChangePhoneNumber, placeholder, required = defaultRequired, disabled = defaultDisabled, errors, register }: PhoneFieldProperties<TFormValues>) => {

	const id = useId();

	const { FieldErrorMessage, labelErrorStyle, inputErrorStyle } = useFieldErrorMesssage<TFormValues>({
		errors,
		name,
		inputErrorStyle: inputStyle?.error ?? null,
		labelErrorStyle: inputStyle?.error ?? null,
	});

	const [ countrySelectValue, setCountrySelectValue ] = useState<CountryCode>('FR');

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

	const handleChange = (event: BaseSyntheticEvent) => {
		const { value } = event.target;
		if (value) {
			const asYouType = new AsYouType(countrySelectValue);
			const input = asYouType.input(value);
			event.target.value = input;
			onChangePhoneNumber(asYouType.getNumber() ?? null);
		}
	};

	const handleSelectCountry: ChangeEventHandler<HTMLSelectElement> = ({ target }) => setCountrySelectValue(target.value as CountryCode);

	return (
		<div className="relative mb-3 flex flex-col text-sm">
			{
				label ?
					<label
						className={ mergedLabelStyle.className }
						htmlFor={ `${ id }-${ name }` }
						style={ mergedLabelStyle.style }
					>
						{ label }
						{ required ? <span className="text-red-500 dark:text-red-400"> *</span> : null }
					</label>
					: null
			}
			<div className="flex w-full gap-0">
				<select
					className="appearance-none p-2 px-3 rounded-none rounded-l-md shadow-inner bg-light-100 dark:bg-light-800"
					value={ countrySelectValue }
					onChange={ handleSelectCountry }
				>
					{
						getCountries().map(countryCode => (
							<option
								key={ countryCode }
								value={ countryCode }
							>
								{ countryCode }
							</option>
						))
					}
				</select>
				<input
					className={ mergedInputStyle.className }
					disabled={ disabled }
					id={ `${ id }-${ name }` }
					placeholder={ `${ placeholder } ${ required && !label ? '*' : '' }` }
					style={ mergedInputStyle.style }
					type="tel"
					{ ...register(name, {
						required,
						disabled,
						onChange: handleChange,
					}) }
				/>
			</div>
			<FieldErrorMessage />
		</div>
	);
};

export default PhoneField;
