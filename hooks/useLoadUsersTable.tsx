import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableConfig } from '../components/admin/tables/table.type';
import { AppDispatch } from '../store';
import { fetchUsers, selectUsersState, setUsersTableConfig } from '../store/users.slice';
import { IUser } from '../types/user.type';

const useLoadUsersTable = (usersList?: IUser[]) => {

    const dispatch = useDispatch<AppDispatch>();
    const { tableConfig: tableConfigState } = useSelector(selectUsersState);

    // const LOCAL_USERS_TABLE_CONFIG = localStorage.getItem('usersTableConfig') ? JSON.parse(localStorage.getItem('usersTableConfig') as string) as TableConfig : null;

    // const DEFAULT_LIMIT = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.limit ? LOCAL_USERS_TABLE_CONFIG.limit : 10;
    // const DEFAULT_SKIP = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.skip ? LOCAL_USERS_TABLE_CONFIG.skip : 0;
    // const DEFAULT_SORT: TableSort = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.sort && LOCAL_USERS_TABLE_CONFIG.sort.field ? LOCAL_USERS_TABLE_CONFIG.sort : {
    //     field: 'createdAt',
    //     direction: -1,
    // };

    const loadUsersTable = useCallback((tableConfig?: Partial<TableConfig> & { searchString?: string }) => {

        if (tableConfig) {
            dispatch(setUsersTableConfig({
                sort: tableConfig?.sort ?? tableConfigState.sort,
                limit: tableConfig?.limit ?? tableConfigState.limit,
                skip: tableConfig?.skip ?? tableConfigState.skip,
                search: tableConfig?.searchString ?? tableConfigState.search,
            }));
        }

        const sort = tableConfig?.sort ?? tableConfigState.sort;
        const skip = tableConfig?.skip ?? tableConfigState.skip;
        const limit = tableConfig?.limit ?? tableConfigState.limit;
        const search = tableConfig?.searchString ?? tableConfigState.search;
        dispatch(fetchUsers({
            sort,
            skip,
            limit,
            searchString: search,
        }));
    }, [ dispatch, usersList ]);

    return {
        loadUsersTable,
        DEFAULT_LIMIT: tableConfigState.limit,
        DEFAULT_SORT: tableConfigState.sort,
        DEFAULT_SKIP: tableConfigState.skip,
    };

};

export default useLoadUsersTable;
