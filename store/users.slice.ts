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
        updateUser: (state, action) => {
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
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.users,
            };
        });
    },
});

export const { setUsersState, updateUser } = usersSlice.actions;

export const selectUsersState = (state: AppState) => state.users;

export default usersSlice.reducer;
