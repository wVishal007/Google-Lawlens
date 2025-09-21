import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Lawyer {
  _id?: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  location: string;
  hourlyRate: number;
  bio?: string;
  phone?: string;
  profilePic?: string;
  documentUrl?: string;
}


interface LawyerState {
  lawyers: Lawyer[];
  loading: boolean;
  error: string | null;
}

const initialState: LawyerState = {
  lawyers: [],
  loading: false,
  error: null,
};

// Fetch all lawyers
export const fetchLawyers = createAsyncThunk(
  'lawyers/fetchLawyers',
  async (filters: { search?: string, specialization?: string, location?: string } = {}) => {
    const query = new URLSearchParams(filters as any).toString();
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/lawyer/?${query}`);
    return response.data;
  }
);

const lawyerSlice = createSlice({
  name: 'lawyers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLawyers.pending, (state) => {
        state.loading = true;
      })
     .addCase(fetchLawyers.fulfilled, (state, action) => {
  state.loading = false;
  state.lawyers = Array.isArray(action.payload)
    ? action.payload
    : action.payload.lawyers || []; // fallback if payload has lawyers key
})

      .addCase(fetchLawyers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lawyers';
      });
  }
});

export default lawyerSlice.reducer;
