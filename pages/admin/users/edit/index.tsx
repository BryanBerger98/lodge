import { ArrowLeftOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { string } from 'prop-types';
import { useState } from 'react';

import PageTitle from '@components/admin/ui/PageTitle';
import EditUserForm, { EditUserFormInputs } from '@components/admin/users/EditUserForm';
import { createUser } from '@services/users/users.client.service';
import csrf from '@utils/csrf.util';
import { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';

type NewUserPage = {
	csrfToken: string;
}

const NewUserPage = ({ csrfToken }: NewUserPage) => {

	const [ saving, setSaving ] = useState<boolean>(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);

	const router = useRouter();

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
		<>
			<Button
				href="/admin/users"
				style={ { width: 'fit-content' } }
				type="link"
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
		</>
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
