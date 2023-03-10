import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useReducer } from 'react';

import { getUsers } from '@services/users/users.client.service';
import { IApiError } from 'types/error.type';
import { FetchParameters } from 'types/query.type';
import { TableSort } from 'types/table.type';
import { IUser } from 'types/user.type';

import { UsersState } from './users-context.type';
import usersReducer from './users.reducer';

const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;
const DEFAULT_SORT: TableSort = {
	field: 'created_on',
	direction: -1,
};

const INITIAL_STATE: UsersState = {
	users: [],
	total: 0,
	tableConfig: {
		limit: DEFAULT_LIMIT,
		skip: DEFAULT_SKIP,
		sort: DEFAULT_SORT,
		search: '',
	},
	loading: 'idle',
};

export type ThemeValue = 'dark' | 'light';

type UsersContextValue = {
	state: UsersState;
	fetchUsers: (params?: Partial<FetchParameters>) => void;
	updateUser: (user: IUser) => void;
};

const UsersContext = createContext<UsersContextValue | null>(null);
export { UsersContext };

export const useUsersContext = () => {
	const context = useContext(UsersContext);
	if (context === null) {
		throw new Error('useUsersContext is null');
	}
	if (context === undefined) {
		throw new Error('useUsersContext was used outside of its Provider');
	}
	return context;
};

type UsersContextProviderProperties = {
	initialState?: Partial<UsersState>;
	children: ReactNode;
}

const UsersContextProvider: FC<UsersContextProviderProperties> = ({ initialState = INITIAL_STATE, children }) => {
	const [ state, dispatch ] = useReducer(usersReducer, {
		...INITIAL_STATE,
		...initialState,
	});

	const fetchUsers = useCallback( (params?: Partial<FetchParameters>) => {
		const { sort, skip, limit, searchString } = {
			...state.tableConfig,
			...params,
		};
		dispatch({
			type: 'users/table',
			payload: {
				sort,
				skip,
				limit,
				search: searchString,
			},
		});
		dispatch({ type: 'users/pending' });
		getUsers(sort, skip, limit, searchString)
			.then(({ users, total }) => {
				dispatch({
					type: 'users/success',
					payload: {
						users,
						total,
					},
				});
			}).catch((error) => {
				const apiError = error as IApiError;
				dispatch({
					type: 'users/error',
					payload: apiError.response ? apiError.response.data.code : 'default/default',
				});
			});
	}, [ dispatch, state ]);

	const updateUser = useCallback((user: IUser) => {
		dispatch({
			type: 'users/update',
			payload: user,
		});
	}, []);

	const contextValues = useMemo(
		() => ({
			state,
			fetchUsers,
			updateUser,
		}),
		[ state, fetchUsers, updateUser ]
	);

	return <UsersContext.Provider value={ contextValues }>{ children }</UsersContext.Provider>;
};

export default UsersContextProvider;
