import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  activeModal: string | null
  notifications: Notification[]
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timestamp: string
}

const initialState: UiState = {
  theme: 'light',
  sidebarOpen: false,
  activeModal: null,
  notifications: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal: (state, action) => {
      state.activeModal = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload
      }
      state.notifications.unshift(notification)
      // Keep only last 5 notifications
      state.notifications = state.notifications.slice(0, 5)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    }
  }
})

export const { 
  toggleTheme, 
  toggleSidebar, 
  openModal, 
  closeModal, 
  addNotification, 
  removeNotification 
} = uiSlice.actions
export default uiSlice.reducer