import { ArrowLeftOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { string } from 'prop-types';
import { useState } from 'react';

import type { EditUserFormInputs } from '@components/admin/users/EditUserForm';
import UsersContextProvider from '@context/users/users.context';
import { createUser } from '@services/users/users.client.service';
import csrf from '@utils/csrf.util';
import type { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';
import type { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

const PageTitle = dynamic(() => import('@components/admin/ui/PageTitle'));
const EditUserForm = dynamic(() => import('@components/admin/users/EditUserForm'));

type NewUserPage = {
	csrfToken: string;
}

const NewUserPage = ({ csrfToken }: NewUserPage) => {

	const [ saving, setSaving ] = useState<boolean>(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);

	const router = useRouter();

	const handleGoBack = () => {
		router.push('/admin/users');
	};

	const handleSubmit = (values: EditUserFormInputs) => {
		setSaving(true);

		createUser({
			...values,
			provider_data: 'email',
		}, csrfToken)
			.then(createdUser => {
				router.replace(`/admin/users/edit/${ createdUser._id }`);
			})
			.catch(error => {
				const apiError = error as IApiError;
				if (apiError.response && apiError.response.data && apiError.response.data.code) {
					setErrorCode(apiError.response.data.code);
					return;
				}
			})
			.finally(() => {
				setSaving(false);
			});
	};

	return(
		<UsersContextProvider>
			<Button
				style={ { width: 'fit-content' } }
				type="link"
				onClick={ handleGoBack }
			>
				<ArrowLeftOutlined />
				<span>Retour</span>
			</Button>
			<Row>
				<Col span={ 12 }>
					<PageTitle><UserAddOutlined /><span>Nouvel utilisateur</span></PageTitle>
					<EditUserForm
						errorCode={ errorCode }
						isSaving={ saving }
						onSubmit={ handleSubmit }
					/>
				</Col>
			</Row>
		</UsersContextProvider>
	);
};

export default NewUserPage;

NewUserPage.propTypes = { csrfToken: string };

NewUserPage.defaultProps = { csrfToken: null };

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf ) => {
	await csrf(req, res);

	return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
