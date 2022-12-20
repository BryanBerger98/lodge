import { default as Axios } from 'axios';
import { useMemo } from 'react';
import { useCsrfContext } from '../context/csrf.context';

const useAxios = () => {

    const { csrfToken } = useCsrfContext();

    const axios = useMemo(() => (
        Axios.create({
            baseURL: '/api',
            timeout: 10000,
            headers: { 'CSRF-Token': csrfToken },
        })
    ), [ csrfToken ]);

    return useMemo(() => ({ axios }), [ axios ]);

};

export default useAxios;
