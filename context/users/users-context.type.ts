import { ErrorCode, ErrorDomain } from 'types/error.type';
import { LoadingState } from 'types/loading.type';
import { TableConfigWithSearch } from 'types/table.type';
import { IUser } from 'types/user.type';

export type UsersState = {
	users: IUser[];
	total: number;
	tableConfig: TableConfigWithSearch;
	loading: LoadingState;
	error?: string;
}

type SetUsersStateAction = {
	type: 'users/setState';
	payload: UsersState;
}

type UpdateUserAction = {
	type: 'users/update';
	payload: Partial<IUser>;
}
type PendingUsersAction = {
	type: 'users/pending';
}

type ErrorUsersAction = {
	type: 'users/error';
	payload: ErrorCode<ErrorDomain>;
}

type IdleUsersAction = {
	type: 'users/idle';
}

type SuccessUsersAction = {
	type: 'users/success';
	payload: {
		users: IUser[];
		total: number;
	};
}

type SetTableConfigAction = {
	type: 'users/table';
	payload: Partial<TableConfigWithSearch>
}

export type UsersReducerAction = SetUsersStateAction | UpdateUserAction | PendingUsersAction | ErrorUsersAction | IdleUsersAction | SuccessUsersAction | SetTableConfigAction;
