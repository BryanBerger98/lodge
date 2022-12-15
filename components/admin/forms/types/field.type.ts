import { PhoneNumber } from 'libphonenumber-js';
import { CSSProperties, HTMLInputTypeAttribute } from 'react';
import { DeepMap, FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type FieldProperties<TFormValues> = {
	name: Path<TFormValues>;
	label: string;
	inputStyle?: {
		default?: {
			className?: string;
			style?: CSSProperties;
		},
		error?: {
			className?: string;
			style?: CSSProperties;
		}
	};
	labelStyle?: {
		default?: {
			className?: string;
			style?: CSSProperties;
		},
		error?: {
			className?: string;
			style?: CSSProperties;
		}
	};
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	errors?: DeepMap<TFormValues, FieldError>;
	register: UseFormRegister<TFormValues & FieldValues>
}

export type TextFieldProperties<TFormValues> = FieldProperties<TFormValues> & {
	type?: HTMLInputTypeAttribute;
}

export type SelectFieldOption = {
	label: string;
	value: string;
	disabled?: boolean;
	selected?: boolean;
}

export type SelectFieldOptions = SelectFieldOption[];

export type SelectFieldProperties<TFormValues> = FieldProperties<TFormValues> & {
	options: SelectFieldOption[];
}

export type PhoneFieldProperties<TFormValues> = FieldProperties<TFormValues> & {
	onChangePhoneNumber: (phoneNumber: PhoneNumber | null) => void;
}
