import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import EditUserForm, { EditUserFormInputs } from '@components/admin/users/EditUserForm';
import EditUserInformationsSection from '@components/admin/users/EditUserInformationsSection';
import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import { findFileByUrl } from '@infrastructure/data-access/file.data-access';
import { findUserById } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getFileFromKey } from '@lib/bucket';
import { updateUser } from '@services/users/users.client.service';
import { wrapper } from '@store/index';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { isUserAbleToWatch } from '@utils/permissions.util';
import { ErrorCode, ErrorDomain, IApiError } from 'types/error.type';
import { IUser } from 'types/user.type';

type EditUserPageProperties = {
	csrfToken: string;
	userToEdit: IUser;
}

const EditUserPage = ({ csrfToken, userToEdit }: EditUserPageProperties) => {

	const [ user, setUser ] = useState<IUser | null>(userToEdit);
	const [ saving, setSaving ] = useState<boolean>(false);
	const [ errorCode, setErrorCode ] = useState<ErrorCode<ErrorDomain> | null>(null);
	const { dispatchCsrfToken } = useCsrfContext();

	const { currentUser } = useAuthContext();

	const router = useRouter();

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ dispatchCsrfToken, csrfToken ]);

	const handleGoBack = () => {
		router.push('/admin/users');
	};

	const handleSubmit = (values: EditUserFormInputs) => {
		if (user) {
			setSaving(true);
			updateUser({
				...user,
				...values,
			}, csrfToken)
				.then(userData => {
					userData.photo_url = user.photo_url;
					setUser(userData);
				})
				.catch(error => {
					const apiError = error as IApiError;
					if (apiError.response && apiError.response.data && apiError.response.data.code) {
						setErrorCode(apiError.response.data.code);
					}
				})
				.finally(() => {
					setSaving(false);
				});
		}
	};

	return(
		<>
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
					<EditUserInformationsSection
						currentUser={ currentUser as IUser }
						setUser={ setUser }
						user={ user }
					/>
					<EditUserForm
						errorCode={ errorCode }
						isSaving={ saving }
						user={ user }
						onSubmit={ handleSubmit }
					/>
				</Col>
			</Row>
		</>
	);
};

export default EditUserPage;

const getServerSideProps = wrapper.getServerSideProps(() => async ({ req, res, params }) => {
	const request = req as CsrfRequest;
	const response = res as CsrfResponse;
	await csrf(request, response);

	const session = await getSession({ req });

	await connectToDatabase();

	if (!session || session && !isUserAbleToWatch(session.user.role, [ 'admin' ])) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const { userId } = params as { userId: string };

	const user = await findUserById(userId);
	if (user && user.photo_url) {
		const userPhotoData = await findFileByUrl(user.photo_url);
		if (userPhotoData) {
			const userPhotoUrl = await getFileFromKey(userPhotoData);
			user.photo_url = userPhotoUrl ? userPhotoUrl : '';
		}
	}

	return {
		props: {
			userToEdit: JSON.parse(JSON.stringify(user)),
			session,
			csrfToken: request.csrfToken(),
		},
	};

});

export { getServerSideProps };
