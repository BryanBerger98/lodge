import { default as Axios } from 'axios';

const fetcher = (csrfToken?: string | null) => {
	return Axios.create({
		baseURL: '/api',
		timeout: 10000,
		headers: { 'CSRF-Token': csrfToken },
	});
};

export default fetcher;
