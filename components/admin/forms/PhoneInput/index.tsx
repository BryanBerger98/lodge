import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import { AsYouType, CountryCode, PhoneNumber } from 'libphonenumber-js';
import { BaseSyntheticEvent, FC, ReactNode, useState } from 'react';

import PhonePrefixSelector from './PhonePrefixSelector';

type PhoneInputProperties = {
	name: string;
	label?: ReactNode;
	onChangePhoneNumber: (phoneNumber: PhoneNumber | null) => void;
	rules?: Rule[]
}

const PhoneInput: FC<PhoneInputProperties> = ({ name, label, onChangePhoneNumber, rules = [] }) => {

	const [ countrySelectValue, setCountrySelectValue ] = useState<CountryCode>('FR');

	const form = Form.useFormInstance();

	const handleChangeCountyValue = (value: CountryCode) => setCountrySelectValue(value);

	const handleChangePhoneNumber = (event: BaseSyntheticEvent) => {
		const { value } = event.target;
		if (value) {
			const asYouType = new AsYouType(countrySelectValue);
			const input = asYouType.input(value);
			form.setFieldValue(name, input);
			onChangePhoneNumber(asYouType.getNumber() ?? null);
		}
	};

	return (
		<Form.Item
			label={ label }
			name={ name }
			rules={ rules }
		>
			<Input
				addonBefore={
					<PhonePrefixSelector
						value={ countrySelectValue }
						onChange={ handleChangeCountyValue }
					/>
				}
				style={ { width: '100%' } }
				onChange={ handleChangePhoneNumber }
			/>
		</Form.Item>
	);
};

export default PhoneInput;
