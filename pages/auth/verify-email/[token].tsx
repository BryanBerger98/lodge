import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect, FC } from 'react';
import { FiArrowRight, FiCheckCircle, FiX } from 'react-icons/fi';

import Button from '@components/admin/ui/Button/Button';
import Loader from '@components/admin/ui/Loader';
import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { verifyEmail } from '@services/auth/auth.client.service';
import csrf from '@utils/csrf.util';
import { IApiError } from 'types/error.type';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

type VerifyEmailPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const VerifyEmailPage: FC<VerifyEmailPageProperties> = ({ csrfToken }) => {

	const router = useRouter();
	const { data: session, status } = useSession();

	if (status !== 'authenticated' || !session) {
		router.replace('/');
	}

	const [ loading, setLoading ] = useState(false);
	const [ success, setSuccess ] = useState(false);
	const [ error, setError ] = useState<string | null>(null);

	const { getCurrentUser } = useAuthContext();
	const { dispatchCsrfToken } = useCsrfContext();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });
	const { token } = router.query;

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ csrfToken, dispatchCsrfToken ]);

	useEffect(() => {
		if (token && typeof token === 'string') {
			verifyEmail(token)
				.then(() => {
					setLoading(false);
					setSuccess(true);
					getCurrentUser();
					setTimeout(() => {
						router.replace('/');
					}, 3000);
				}).catch(err => {
					setLoading(false);
					const apiError = err as IApiError;
					if (apiError.response && apiError.response.data) {
						const errorMessage = getTranslatedError(apiError.response.data.code);
						setError(errorMessage);
					}
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ token ]);


	return(
		<div className="flex justify-center items-center h-screen">
			<Loader isLoading={ loading } />
			{
				!error && !loading && success ?
					<div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
						<h1 className="text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3">{ appName }</h1>
						<h2 className="text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-5">Adresse email vérifiée</h2>
						<div className="flex items-center justify-center text-success-light-default dark:text-success-dark-default text-6xl mb-5">
							<FiCheckCircle />
						</div>
						<div className="flex flex-col justify-center items-center text-sm">
							<p className="mb-3">Vous allez être redirigé dans quelques secondes</p>
							<Button
								href="/"
								variant="primary"
							>
								<span>Retour à l&apos;application</span>
								<FiArrowRight />
							</Button>
						</div>
					</div>
					: null
			}
			{
				error && !loading && !success ?
					<div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
						<h1 className="text-secondary-dark-tint dark:text-secondary-light-default text-center text-3xl mb-3">{ appName }</h1>
						<h2 className="text-danger-light-default dark:text-danger-dark-default text-center text-2xl mb-5">Une erreur est survenue</h2>
						<div className="flex items-center justify-center text-danger-light-default dark:text-danger-dark-default text-6xl mb-5">
							<FiX />
						</div>
						<div className="flex flex-col justify-center items-center text-sm">
							<p className="mb-3 text-danger-light-default dark:text-danger-dark-default">{ error }</p>
							<Button
								href="/"
								variant="primary"
							>
								<span>Retour à l&apos;application</span>
								<FiArrowRight />
							</Button>
						</div>
					</div>
					: null
			}
		</div>
	);
};

export default VerifyEmailPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
