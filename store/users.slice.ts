import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IUser } from '../types/user.type';
import { AppState } from './index';

type UsersState = {
	users: IUser[];
	count: number;
	total: number;
}

const initialState: UsersState = {
    users: [],
    count: 0,
    total: 0,
};

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsersState: (state, action) => {
            return action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.users,
            };
        });
    },
});

export const { setUsersState } = usersSlice.actions;

export const selectUsersState = (state: AppState) => state.users;

export default usersSlice.reducer;
