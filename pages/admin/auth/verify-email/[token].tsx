import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, FC, memo } from 'react';

import VerifyEmailBlock from '@components/admin/auth/VerifyEmailBlock';
import { useCsrfContext } from '@context/csrf.context';
import csrf from '@utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

type VerifyEmailPageProperties = {
	csrfToken: string;
}
const VerifyEmailPage: FC<VerifyEmailPageProperties> = ({ csrfToken }) => {

	const router = useRouter();
	const { data: session, status } = useSession();

	console.log(status, session);


	const { dispatchCsrfToken } = useCsrfContext();

	useEffect(() => {
		if (status !== 'loading' && (status !== 'authenticated' || !session)) {
			router.replace('/');
		}
	}, [ status, router, session ]);

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ csrfToken, dispatchCsrfToken ]);

	return(
		<VerifyEmailBlock />
	);
};

export default memo(VerifyEmailPage);

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
