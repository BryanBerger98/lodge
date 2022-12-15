import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import Button from '../../components/admin/ui/Button/Button';
import PageTitle from '../../components/admin/ui/PageTitle';
import UsersTable from '../../components/admin/users/UsersTable';
import { AppDispatch, wrapper } from '../../store';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectUsersState, setUsersState } from '../../store/users.slice';
import SearchField from '../../components/admin/forms/SearchField';
import { userDataAccess } from '../../infrastructure/data-access';

const UsersPage = () => {

    const [ searchString, setSearchString ] = useState('');
    const router = useRouter();

    // const dispatch = useDispatch<AppDispatch>();
    const { users, total, count } = useSelector(selectUsersState);

    const onSearchUsers = (value: string) => {
        setSearchString(value);
    };

    const onCreateNewUser = () => {
        router.push('/admin/users/edit');
    };

    return (
        <div className="container mx-auto my-10 px-5">
            <PageTitle><FiUsers /><span>{total} Utilisateur{ total > 1 ? 's' : '' }</span></PageTitle>
            <div className="grid grid-cols-12 mb-5">
                <div className="col-span-6">
                    <SearchField
                        onSearchElements={ onSearchUsers }
                        placeholder="Rechercher par nom d'utilisateur"
                    />
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
                    searchString={ searchString }
                    usersList={ users }
                    usersCount={ total }
                />
            </div>
        </div>
    );
};

export default connect(selectUsersState)(UsersPage);

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {

    const usersData = await userDataAccess.findUsers({}, { 'created_on': -1 }, 0, 10);

    store.dispatch(setUsersState({ ...usersData }));

    return { props: { ...usersData } };
});
