import { createSlice } from '@reduxjs/toolkit';
import { getTheme, setTheme } from '../../utils/storage';

const initialState = {
  theme: getTheme(),
  sidebarOpen: true,
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      setTheme(state.theme);
      // Apply class to document for Tailwind dark mode
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setThemeMode: (state, action) => {
      state.theme = action.payload;
      setTheme(action.payload);
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode, toggleSidebar, setSidebarOpen, setGlobalLoading } =
  uiSlice.actions;
export default uiSlice.reducer;
