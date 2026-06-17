import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import earthquakeReducer from '../features/earthquakes/earthquakeSlice';
import reportReducer from '../features/reports/reportSlice';
import uiReducer from '../features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    earthquakes: earthquakeReducer,
    reports: reportReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable date values in filter state
        ignoredPaths: ['earthquakes.filters.startDate', 'earthquakes.filters.endDate'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
