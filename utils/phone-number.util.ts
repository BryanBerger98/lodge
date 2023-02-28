import { AsYouType, format, NumberFormat, parsePhoneNumber as parse, PhoneNumber as PhoneNumberType } from 'libphonenumber-js';

export type PhoneNumber = PhoneNumberType;

export const formatPhoneNumber = (nationalPhoneNumber: string, numberFormat: NumberFormat = 'INTERNATIONAL'): string => {
	return format(nationalPhoneNumber, numberFormat);
};

export const parsePhoneNumber = (phoneNumber: string): PhoneNumber => {
	const asYouType = new AsYouType();
	asYouType.input(phoneNumber);
	const country = asYouType.getCountry();
	return parse(phoneNumber, country);
};
