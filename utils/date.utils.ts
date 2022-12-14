export const getStringSlashedDateFromDate = (date: number | string | Date | null , locale: 'fr' | 'en'): string => {
    if (!date) {
        return '';
    }
    const convertedDate = new Date(date);
    const d = convertedDate.getDate() < 10 ? '0' + convertedDate.getDate() : convertedDate.getDate();
    const m = convertedDate.getMonth() + 1 < 10 ? '0' + (convertedDate.getMonth() + 1) : convertedDate.getMonth() + 1;
    const y = convertedDate.getFullYear();
    return locale === 'fr' ? `${ d }/${ m }/${ y }` : locale === 'en' ? `${ m }/${ d }/${ y }` : '';
};
