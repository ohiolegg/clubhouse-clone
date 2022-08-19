import { combineReducers, Store, configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { roomsReducer } from './slices/roomSlice';
import { userReducer } from './slices/userSlice';
import { RootState } from './types';

export const rootReducer = combineReducers({
  rooms: roomsReducer,
  user: userReducer,
});

export const makeStore = (): Store<RootState> =>
  configureStore({
    reducer: rootReducer,
  });

export type AppDispatch = Store['dispatch'];

export const wrapper = createWrapper(makeStore, { debug: true });
