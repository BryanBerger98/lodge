import { AsyncThunk } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FetchParameters } from 'types/query.type';
import { TableConfig, TableConfigWithSearch } from 'types/table.type';

import { AppDispatch, AppState, AsyncThunkConfig } from '../store/index';

type Payload = {
    payload: TableConfigWithSearch;
    type: string;
}

interface SelectedWithTableConfig {
	tableConfig: TableConfigWithSearch;
}

type LoadTableHookConfig<TData, ReturnedData> = {
	dataList: TData;
	stateSelector: (state: AppState) => unknown & SelectedWithTableConfig;
	tableConfigSetter: (payload: TableConfigWithSearch) => Payload;
	dataFetcher: AsyncThunk<ReturnedData | undefined, FetchParameters, AsyncThunkConfig>
};

const useLoadReduxTable = <TData extends unknown[], TReturnedData>({
	dataList,
	stateSelector,
	tableConfigSetter,
	dataFetcher,
}: LoadTableHookConfig<TData, TReturnedData>) => {

	const dispatch = useDispatch<AppDispatch>();
	const { tableConfig: tableConfigState } = useSelector<AppState, SelectedWithTableConfig>(stateSelector);

	// const LOCAL_USERS_TABLE_CONFIG = localStorage.getItem('usersTableConfig') ? JSON.parse(localStorage.getItem('usersTableConfig') as string) as TableConfig : null;

	// const DEFAULT_LIMIT = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.limit ? LOCAL_USERS_TABLE_CONFIG.limit : 10;
	// const DEFAULT_SKIP = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.skip ? LOCAL_USERS_TABLE_CONFIG.skip : 0;
	// const DEFAULT_SORT: TableSort = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.sort && LOCAL_USERS_TABLE_CONFIG.sort.field ? LOCAL_USERS_TABLE_CONFIG.sort : {
	//     field: 'createdAt',
	//     direction: -1,
	// };

	const loadTable = useCallback((tableConfig?: Partial<TableConfig> & { searchString?: string }) => {

		if (tableConfig) {
			dispatch(tableConfigSetter({
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
		dispatch(dataFetcher({
			sort,
			skip,
			limit,
			searchString: search,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ dispatch, dataList ]);

	return {
		loadTable,
		DEFAULT_LIMIT: tableConfigState.limit,
		DEFAULT_SORT: tableConfigState.sort,
		DEFAULT_SKIP: tableConfigState.skip,
	};

};

export default useLoadReduxTable;
