import { AsYouType, format, parsePhoneNumber as parse, PhoneNumber as PhoneNumberType } from 'libphonenumber-js';

export type PhoneNumber = PhoneNumberType;

export const formatPhoneNumber = (nationalPhoneNumber: string): string => {
    return format(nationalPhoneNumber, 'NATIONAL');
};

export const parsePhoneNumber = (phoneNumber: string): PhoneNumber => {
    const asYouType = new AsYouType();
    asYouType.input(phoneNumber);
    const country = asYouType.getCountry();
    console.log(phoneNumber, country);
    return parse(phoneNumber, country);
};
