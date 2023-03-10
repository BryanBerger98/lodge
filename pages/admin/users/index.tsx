import { getSession } from 'next-auth/react';
import { FC, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

import UsersPageHeader from '@components/admin/users/UsersPageHeader';
import UsersTable from '@components/admin/users/UsersTable';
import { useCsrfContext } from '@context/csrf.context';
import { findMultipleFilesByUrl } from '@infrastructure/data-access/file.data-access';
import { findUsers, findUsersCount } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getMultipleFiles } from '@lib/bucket';
import { wrapper } from '@store/index';
import { selectUsersState, setUsersState } from '@store/users.slice';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { isUserAbleToWatch } from '@utils/permissions.util';
import { IUser } from 'types/user.type';

type UsersPageProperties = {
	csrfToken: string;
}

const UsersPage: FC<UsersPageProperties> = ({ csrfToken }) => {

	const { users, total } = useSelector(selectUsersState);
	const { dispatchCsrfToken } = useCsrfContext();

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ dispatchCsrfToken, csrfToken ]);

	return(
		<>
			<UsersPageHeader total={ total } />
			<div
				className="drop-shadow"
				style={ {
					borderRadius: '0.375rem',
					width: '100%',
					background: '#fff',
					padding: '0.75rem',
					minHeight: '24rem',
				} }
			>
				<UsersTable
					usersCount={ total }
					usersList={ users }
				/>
			</div>
		</>
	);
};

export default connect(selectUsersState)(UsersPage);

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {

	const request = req as CsrfRequest;
	const response = res as CsrfResponse;
	await csrf(request, response);

	const session = await getSession({ req });

	if (!session || session && !isUserAbleToWatch(session.user.role, [ 'admin' ])) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	await connectToDatabase();

	const skip = 0;
	const limit = 10;

	const usersData = await findUsers({}, { 'created_at': -1 }, skip, limit);
	const usersCount = await findUsersCount({});

	const serializedUsersData: IUser[] = JSON.parse(JSON.stringify(usersData));

	const usersPhotoUrls = serializedUsersData.map(user => user.photo_url);

	const files = await findMultipleFilesByUrl(usersPhotoUrls);

	const usersPhotos = files ? await getMultipleFiles(files) : null;

	const usersWithPhotos: IUser[] = serializedUsersData.map(user => {
		const userPhoto = usersPhotos ? usersPhotos.find(photoData => photoData && photoData.url === user.photo_url) : null;
		return {
			...user,
			photo_url: userPhoto ? userPhoto.fileString : null,
		} as IUser;
	});

	store.dispatch(setUsersState({
		users: usersWithPhotos,
		total: usersCount,
		count: usersData.length,
	}));

	return { props: { csrfToken: request.csrfToken() } };
});
