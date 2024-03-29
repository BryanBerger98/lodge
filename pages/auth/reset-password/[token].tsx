import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { DeepMap, FieldError, FieldValues, useForm } from 'react-hook-form';
import { FiCheckCircle, FiLogIn, FiSave } from 'react-icons/fi';
import * as Yup from 'yup';

import TextField from '@components/admin/forms/TextField';
import Button from '@components/admin/ui/Button/Button';
import Loader from '@components/admin/ui/Loader';
import { useCsrfContext } from '@context/csrf.context';
import useTranslate from '@hooks/useTranslate';
import { resetPassword } from '@services/auth/auth.client.service';
import csrf from '@utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

type ResetPasswordInputs = {
	password: string;
	confirmPassword: string;
} & FieldValues;

type ResetPasswordPageProperties = {
	csrfToken: string;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const ResetPasswordPage: FC<ResetPasswordPageProperties> = ({ csrfToken }) => {

	const router = useRouter();
	const [ loading, setLoading ] = useState(false);
	const [ success, setSuccess ] = useState(false);
	const [ error, setError ] = useState<string | null>(null);

	const { dispatchCsrfToken } = useCsrfContext();
	const { getTranslatedError } = useTranslate({ locale: 'fr' });

	const { token } = router.query;

	const resetPasswordFormSchema = Yup.object().shape({
		password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis'),
		confirmPassword: Yup.string().oneOf([ Yup.ref('password'), null ], 'Doit être identique au mot de passe').required('Champs requis'),
	});

	const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInputs>({
		resolver: yupResolver(resetPasswordFormSchema),
		mode: 'onTouched',
	});

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ csrfToken, dispatchCsrfToken ]);

	const handleResetPasswordFormSubmit = (values: ResetPasswordInputs) => {
		if (!token || token && typeof token !== 'string') {
			return;
		}
		const { password } = values;
		setLoading(true);

		resetPassword(token, password, csrfToken).then(() => {
			setSuccess(true);
			setTimeout(() => {
				router.replace('/auth/signin');
			}, 3000);
		}).catch(err => {
			if (err.response && err.response.data) {
				const errorMessage = getTranslatedError(err.response.data.code);
				return setError(errorMessage);
			}
		}).finally(() => {
			setLoading(false);
		});
	};
	return(
		<div className="flex justify-center items-center h-screen">
			<Loader isLoading={ loading } />
			{
				!success &&
					<div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
						<h1 className="text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3">{ appName }</h1>
						<h2 className="text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-5">Nouveau mot de passe</h2>
						<form onSubmit={ handleSubmit(handleResetPasswordFormSubmit) }>
							<TextField
								errors={ errors as DeepMap<ResetPasswordInputs, FieldError> }
								label="Mot de passe"
								name="password"
								placeholder="********"
								register={ register }
								type="password"
								required
							/>
							<TextField
								errors={ errors as DeepMap<ResetPasswordInputs, FieldError> }
								label="Confirmer le mot de passe"
								name="confirmPassword"
								placeholder="********"
								register={ register }
								type="password"
								required
							/>
							<div className="flex flex-col justify-center items-center text-sm mt-5">
								{ error ? <p className="text-sm text-danger-light-default dark:text-danger-dark-default mb-5">{ error }</p> : null }
								<Button
									type="submit"
									variant="primary-gradient"
								>
									<FiSave />
									<span>Enregistrer</span>
								</Button>
							</div>
						</form>
					</div>
			}
			{
				success ?
					<div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-secondary-dark-shade dark:text-secondary-light-shade drop-shadow rounded-md p-6">
						<h1 className="text-primary-light-default dark:text-primary-dark-tint text-center text-3xl mb-3">{ appName }</h1>
						<h2 className="text-secondary-dark-tint dark:text-secondary-light-default text-center text-2xl mb-5">Nouveau mot de passe</h2>
						<div className="flex items-center justify-center text-success-light-default dark:text-success-dark-default text-6xl mb-5">
							<FiCheckCircle />
						</div>
						<div className="flex flex-col justify-center items-center text-sm">
							<p className="mb-3">Vous allez être redirigé dans quelques secondes</p>
							<Button
								href="/auth/signin"
								variant="primary"
							>
								<span>Se connecter</span>
								<FiLogIn />
							</Button>
						</div>
					</div>
					: null
			}
		</div>
	);
};

export default ResetPasswordPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
