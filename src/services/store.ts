import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorSlice from './slices/constructorSlice';
import orderSlice from './slices/orderSlice';
import feedSlice from './slices/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorSlice,
  order: orderSlice,
  feed: feedSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
