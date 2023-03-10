import { Reducer } from 'react';

import type { UsersState, UsersReducerAction } from './users-context.type';

const usersReducer: Reducer<UsersState, UsersReducerAction> = (state, action) => {
	switch (action.type) {
		case 'users/setState':
			return { ...action.payload };
		case 'users/table':
			return {
				...state,
				tableConfig: {
					...state.tableConfig,
					...action.payload,
				},
			};
		case 'users/idle':
			return {
				...state,
				loading: 'idle',
			};
		case 'users/pending':
			return {
				...state,
				loading: 'pending',
			};
		case 'users/error':
			return {
				...state,
				loading: 'failed',
				error: action.payload,
			};
		case 'users/success':
			return {
				...state,
				loading: 'succeded',
				users: action.payload.users,
				total: action.payload.total,
			};
		case 'users/update':
			return {
				...state,
				users: state.users.map(user => user._id === action.payload._id ? {
					...user,
					...action.payload,
				} : user),
			};
		default:
			return state;
	}
};

export default usersReducer;
