import { Form, Select } from 'antd';
import { CountryCode, getCountries } from 'libphonenumber-js';

const PhonePrefixSelector = ({ onChange: handleChange, value }: { onChange: (value: CountryCode) => void, value: CountryCode }) => {

	return (
		<Form.Item
			initialValue={ value }
			name="prefix"
			noStyle
		>
			<Select
				filterOption={ (input, option) =>
					(option?.label as string ?? '').toLowerCase().includes(input.toLowerCase()) }
				options={ getCountries().map(countryCode => ({
					value: countryCode,
					label: countryCode,
				})) }
				style={ { width: 70 } }
				value={ value }
				showSearch
				onChange={ handleChange }
			/>
		</Form.Item>
	);
};

export default PhonePrefixSelector;
