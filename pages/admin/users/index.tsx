import { FiPlus, FiUsers } from 'react-icons/fi';
import { FC, useEffect } from 'react';
import UsersTable from '../../../components/admin/users/UsersTable';
import Button from '../../../components/admin/ui/Button/Button';
import { getSession } from 'next-auth/react';
import SearchField from '../../../components/admin/forms/SearchField';
import PageTitle from '../../../components/admin/ui/PageTitle';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { useCsrfContext } from '../../../context/csrf.context';
import { isUserAbleToWatch } from '../../../utils/permissions.util';
import { useRouter } from 'next/router';
import { connect, useSelector } from 'react-redux';
import { selectUsersState, setUsersState } from '../../../store/users.slice';
import { wrapper } from '../../../store';
import useLoadUsersTable from '../../../hooks/useLoadUsersTable';
import { IUser } from '../../../types/user.type';
import { getMultipleFiles } from '../../../lib/bucket';
import { fileDataAccess, userDataAccess } from '../../../infrastructure/data-access';

type UsersPageProperties = {
	csrfToken: string;
}

const UsersPage: FC<UsersPageProperties> = ({ csrfToken }) => {

    const { users, total } = useSelector(selectUsersState);
    const { dispatchCsrfToken } = useCsrfContext();
    const { loadUsersTable } = useLoadUsersTable();
    const router = useRouter();

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ dispatchCsrfToken, csrfToken ]);

    const onSearchUsers = (value: string) => {
        loadUsersTable({ searchString: value });
    };

    const onCreateNewUser = () => {
        router.push('/admin/users/edit');
    };

    return(
        <div className="container mx-auto my-10 px-5">
            <PageTitle><FiUsers /><span>{total} Utilisateur{ total > 1 ? 's' : '' }</span></PageTitle>
            <div className="grid grid-cols-12 mb-5">
                <div className="col-span-6">
                    <SearchField onSearchElements={ onSearchUsers } />
                </div>
                <div className="col-span-6 flex justify-end text-sm">
                    <Button
                        onClick={ onCreateNewUser }
                        variant={ 'primary' }
                    >
                        <FiPlus />
                        <span>Nouveau</span>
                    </Button>
                </div>
            </div>
            <div className="w-full min-h-96 bg-white dark:bg-secondary-dark-shade drop-shadow rounded-md p-3 text-sm">
                <UsersTable
                    usersList={ users }
                    usersCount={ total }
                />
            </div>
        </div>
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

    const usersData = await userDataAccess.findUsers({}, { 'created_at': -1 }, 0, 10);
    const usersCount = await userDataAccess.findUsersCount({});

    const serializedUsersData: IUser[] = JSON.parse(JSON.stringify(usersData));

    const usersPhotoUrls = serializedUsersData.map(user => user.photo_url);

    const files = await fileDataAccess.findMultipleFilesByUrl(usersPhotoUrls);

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
