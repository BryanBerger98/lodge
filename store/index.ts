import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { usersSlice } from './users.slice';
import { createWrapper } from 'next-redux-wrapper';

export const store = configureStore({
    reducer: { [ usersSlice.name ]: usersSlice.reducer },
    devTools: true,
});

const makeStore = () => store;

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
