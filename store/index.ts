import { configureStore, ThunkAction, Action, Dispatch } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { usersSlice } from './users.slice';

export const store = configureStore({
	reducer: { [ usersSlice.name ]: usersSlice.reducer },
	devTools: true,
});

const makeStore = () => store;

export type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

export const wrapper = createWrapper<AppStore>(makeStore);
