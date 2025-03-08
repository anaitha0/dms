import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import documentReducer from './documentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    documents: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});