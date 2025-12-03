import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// Types
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  modals: {
    [key: string]: boolean;
  };
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }[];
  loading: {
    [key: string]: boolean;
  };
  searchQuery: string;
  filters: {
    [key: string]: any;
  };
}

// Initial state
const initialState: UIState = {
  theme: 'system',
  sidebarOpen: false,
  mobileMenuOpen: false,
  modals: {},
  notifications: [],
  loading: {},
  searchQuery: '',
  filters: {},
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleMobileMenu: state => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },

    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: state => {
      state.modals = {};
    },

    addNotification: (
      state,
      action: PayloadAction<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
      }>
    ) => {
      state.notifications.push(action.payload);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    clearNotifications: state => {
      state.notifications = [];
    },

    setLoading: (
      state,
      action: PayloadAction<{ key: string; loading: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.loading;
    },

    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },

    clearFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload];
    },

    clearAllFilters: state => {
      state.filters = {};
    },

    resetUI: state => {
      state.sidebarOpen = false;
      state.mobileMenuOpen = false;
      state.modals = {};
      state.notifications = [];
      state.loading = {};
      state.searchQuery = '';
      state.filters = {};
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  clearLoading,
  setSearchQuery,
  setFilter,
  clearFilter,
  clearAllFilters,
  resetUI,
} = uiSlice.actions;

// Export selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectMobileMenuOpen = (state: { ui: UIState }) =>
  state.ui.mobileMenuOpen;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectNotifications = (state: { ui: UIState }) =>
  state.ui.notifications;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectSearchQuery = (state: { ui: UIState }) =>
  state.ui.searchQuery;
export const selectFilters = (state: { ui: UIState }) => state.ui.filters;

// Helper selectors
export const selectIsModalOpen =
  (modalName: string) => (state: { ui: UIState }) =>
    state.ui.modals[modalName] || false;

export const selectIsLoading = (key: string) => (state: { ui: UIState }) =>
  state.ui.loading[key] || false;

export const selectFilterValue = (key: string) => (state: { ui: UIState }) =>
  state.ui.filters[key];

// Export reducer
export default uiSlice.reducer;
