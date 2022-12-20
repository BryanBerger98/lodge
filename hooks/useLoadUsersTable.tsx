import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TableSort } from '../components/admin/tables/Table';
import { TableConfig } from '../components/admin/users/UsersTable';
import useUsersClientService from '../services/users/users.client.service';
import { setUsersState } from '../store/users.slice';
import { IUser } from '../types/user.type';

const useLoadUsersTable = (usersList?: IUser[]) => {

    const { getUsers } = useUsersClientService();
    const dispatch = useDispatch();

    const LOCAL_USERS_TABLE_CONFIG = localStorage.getItem('usersTableConfig') ? JSON.parse(localStorage.getItem('usersTableConfig') as string) as TableConfig : null;

    const DEFAULT_LIMIT = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.limit ? LOCAL_USERS_TABLE_CONFIG.limit : 10;
    const DEFAULT_SKIP = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.skip ? LOCAL_USERS_TABLE_CONFIG.skip : 0;
    const DEFAULT_SORT: TableSort = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.sort && LOCAL_USERS_TABLE_CONFIG.sort.field ? LOCAL_USERS_TABLE_CONFIG.sort : {
        field: 'createdAt',
        direction: -1,
    };

    const [ dataLoading, setDataLoading ] = useState<boolean>(usersList ? false : true);

    const loadUsersTable = useCallback((tableConfig?: Partial<TableConfig> & { searchString?: string }) => {
        if (!usersList) {
            setDataLoading(true);
        }
        const sort = tableConfig?.sort ?? DEFAULT_SORT;
        const skip = tableConfig?.skip ?? DEFAULT_SKIP;
        const limit = tableConfig?.limit ?? DEFAULT_LIMIT;
        getUsers(sort, skip, limit, tableConfig?.searchString)
            .then(response => {
                dispatch(setUsersState(response));
            })
            .catch(console.error)
            .finally(() => setDataLoading(prevState => !prevState ? prevState : false));
    }, [ DEFAULT_SORT, DEFAULT_LIMIT, DEFAULT_SKIP, dispatch, getUsers, usersList ]);

    return {
        dataLoading,
        loadUsersTable,
        DEFAULT_LIMIT,
        DEFAULT_SORT,
        DEFAULT_SKIP,
    };

};

export default useLoadUsersTable;
