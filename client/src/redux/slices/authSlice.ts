import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { log } from 'console'

interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// ---------------- Login ----------------
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, { email, password })
      localStorage.setItem("token", data.token) // Save JWT
      return data.user
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed")
    }
  }
)

// ---------------- Signup ----------------
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password, gender }: { name: string; email: string; password: string; gender?: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/register`, { name, email, password, gender })
      localStorage.setItem("token", data.token) // Save JWT like login
      return data.user
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed")
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
