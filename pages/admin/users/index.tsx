import { getSession } from 'next-auth/react';
import { FC, useEffect } from 'react';

import UsersPageHeader from '@components/admin/users/UsersPageHeader';
import UsersTable from '@components/admin/users/UsersTable';
import { useCsrfContext } from '@context/csrf.context';
import { UsersState } from '@context/users/users-context.type';
import UsersContextProvider from '@context/users/users.context';
import { findMultipleFilesByUrl } from '@infrastructure/data-access/file.data-access';
import { findUsers, findUsersCount } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getMultipleFiles } from '@lib/bucket';
import csrf from '@utils/csrf.util';
import { isUserAbleToWatch } from '@utils/permissions.util';
import { GetServerSidePropsContextWithCsrf } from 'types/ssr.type';
import { IUser } from 'types/user.type';

type UsersPageProperties = {
	csrfToken: string;
	usersData: {
		users: IUser[];
		total: number;
	}
}

const UsersPage: FC<UsersPageProperties> = ({ csrfToken, usersData }) => {

	const { dispatchCsrfToken } = useCsrfContext();

	const initialUsersState: Partial<UsersState> = {
		users: usersData.users,
		total: usersData.total,
	};

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ dispatchCsrfToken, csrfToken ]);

	return(
		<UsersContextProvider initialState={ initialUsersState }>
			<UsersPageHeader />
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
				<UsersTable />
			</div>
		</UsersContextProvider>
	);
};

export default UsersPage;

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {

	await csrf(req, res);

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

	return {
		props: {
			csrfToken: req.csrfToken(),
			usersData: {
				users: usersWithPhotos,
				total: usersCount,
			},
		},
	};
};
