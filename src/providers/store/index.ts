import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/reducer/authSlice';
import groupReducer from '@/context/group/groupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    group: groupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
