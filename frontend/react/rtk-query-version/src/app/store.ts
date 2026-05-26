import { configureStore } from '@reduxjs/toolkit';
import { expenseApiSlice } from '../api/expenseApiSlice';

export const store = configureStore({
  reducer: {
    // Ajoute le reducer de l'API au store
    [expenseApiSlice.reducerPath]: expenseApiSlice.reducer,
  },
  // Le middleware gère le cache et la synchronisation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expenseApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;