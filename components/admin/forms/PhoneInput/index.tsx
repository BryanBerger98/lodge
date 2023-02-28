import { Form, Input } from 'antd';
import { AsYouType, CountryCode, PhoneNumber } from 'libphonenumber-js';
import { BaseSyntheticEvent, FC, useState } from 'react';

import PhonePrefixSelector from './PhonePrefixSelector';

type PhoneInputProperties = {
	onChangePhoneNumber: (phoneNumber: PhoneNumber | null) => void;
}

const PhoneInput: FC<PhoneInputProperties> = ({ onChangePhoneNumber }) => {

	const [ countrySelectValue, setCountrySelectValue ] = useState<CountryCode>('FR');
	const [ phoneNumberValue, setPhoneNumberValue ] = useState<string>('06 01 02 03 04');

	const handleChangeCountyValue = (value: CountryCode) => setCountrySelectValue(value);

	const handleChangePhoneNumber = (event: BaseSyntheticEvent) => {
		const { value } = event.target;
		if (value) {
			const asYouType = new AsYouType(countrySelectValue);
			const input = asYouType.input(value);
			setPhoneNumberValue(input);
			onChangePhoneNumber(asYouType.getNumber() ?? null);
		}
	};

	return (
		<Form.Item
			initialValue={ phoneNumberValue }
			label="Téléphone"
			name="phone_number"
			rules={ [ {
				required: true,
				message: 'Champ requis.',
			} ] }
		>
			<Input
				addonBefore={
					<PhonePrefixSelector
						value={ countrySelectValue }
						onChange={ handleChangeCountyValue }
					/>
				}
				style={ { width: '100%' } }
				value={ phoneNumberValue }
				onChange={ handleChangePhoneNumber }
			/>
		</Form.Item>
	);
};

export default PhoneInput;
