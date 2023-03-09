import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { TableConfig, TableSort } from '../types/table.type';
import { getUsers } from '../services/users/users.client.service';
import { LoadingState } from '../types/loading.type';
import { IUser } from '../types/user.type';

import { AppState } from './index';

export type UsersState = {
	users: IUser[];
	count: number;
	total: number;
	tableConfig: TableConfig & {
		search?: string
	},
	loading: LoadingState;
}

const LOCAL_USERS_TABLE_CONFIG = typeof localStorage !== 'undefined' && localStorage.getItem('usersTableConfig') ? JSON.parse(localStorage.getItem('usersTableConfig') as string) as TableConfig : null;

const DEFAULT_LIMIT = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.limit ? LOCAL_USERS_TABLE_CONFIG.limit : 10;
const DEFAULT_SKIP = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.skip ? LOCAL_USERS_TABLE_CONFIG.skip : 0;
const DEFAULT_SORT: TableSort = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.sort && LOCAL_USERS_TABLE_CONFIG.sort.field ? LOCAL_USERS_TABLE_CONFIG.sort : {
	field: 'created_on',
	direction: -1,
};

type FetchUsersParams = {
	sort: {
		field: string;
		direction: -1 | 1;
	};
	skip: number;
	limit: number;
	searchString?: string;
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params: FetchUsersParams, { rejectWithValue }) => {
	try {
		const { sort, skip, limit, searchString } = params;
		return await getUsers(sort, skip, limit, searchString);
	} catch (error) {
		rejectWithValue(error);
	}
});

const initialState: UsersState = {
	users: [],
	count: 0,
	total: 0,
	tableConfig: {
		limit: DEFAULT_LIMIT,
		skip: DEFAULT_SKIP,
		sort: DEFAULT_SORT,
		search: '',
	},
	loading: 'idle',
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsersState: (state, action: PayloadAction<Partial<UsersState>>) => {
			return {
				...state,
				...action.payload,
			};
		},
		setUsersTableConfig: (state, action: PayloadAction<TableConfig & { search?: string }>) => {
			return {
				...state,
				tableConfig: action.payload,
			};
		},
		updateUser: (state, action: PayloadAction<IUser>) => {
			const users = [ ...state.users ];
			const userToUpdateIndex = users.findIndex(user => user._id === action.payload._id);
			users[ userToUpdateIndex ] = {
				...[ userToUpdateIndex ],
				...action.payload,
			};
			state.users = users;
			return state;
		},
	},
	extraReducers(builder) {
		builder.addCase(HYDRATE, (state, action: Action<'__NEXT_REDUX_WRAPPER_HYDRATE__'> & PayloadAction<UsersState>) => {
			return {
				...state,
				...action.payload.users,
			};
		});
		builder.addCase(fetchUsers.pending, (state) => {
			return {
				...state,
				loading: 'pending',
			};
		});
		builder.addCase(fetchUsers.rejected, (state) => {
			return {
				...state,
				loading: 'failed',
			};
		});
		builder.addCase(fetchUsers.fulfilled, (state, action) => {
			return {
				...state,
				...action.payload,
				loading: 'succeded',
			};
		});
	},
});

export const { setUsersState, updateUser, setUsersTableConfig } = usersSlice.actions;

export const selectUsersState = (state: AppState) => state.users as UsersState;

export default usersSlice.reducer;
