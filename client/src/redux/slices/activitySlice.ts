import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  repeatFrequency: "none" | "daily" | "weekly" | "monthly";
}

interface ActivitiesState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  isLoading: false,
  error: null,
};

// Fetch activities for logged-in user
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/activity/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

// Add a new activity
export const addActivity = createAsyncThunk(
  "activities/addActivity",
  async (activityData: Partial<Activity>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/activity/add`, activityData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.activity;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activities.push(action.payload);
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default activitiesSlice.reducer;
