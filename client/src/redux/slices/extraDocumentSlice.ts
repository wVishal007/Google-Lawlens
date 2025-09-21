import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserContext {
  age: number;
  location: string;
  purpose: string;
}

interface RedFlag {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  clause: string;
}

interface Clause {
  id: string;
  text: string;
  risk: "low" | "medium" | "high";
  explanation: string;
}

interface AnalysisResult {
  riskScore: number;
  redFlags: RedFlag[];
  summary: string;
  clauses: Clause[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  analysisResult?: AnalysisResult;
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  analysisLoading: boolean;
  uploadLoading: boolean;
  chatLoading: boolean;
  userContext: UserContext | null;
  riskHistory: { date: string; score: number }[];
  error: string | null;
  chatResponse: string | null;
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  analysisLoading: false,
  uploadLoading: false,
  chatLoading: false,
  userContext: null,
  riskHistory: [],
  error: null,
  chatResponse: null,
};

// Helper for token
const getToken = () => localStorage.getItem("token") || "";

// Upload document
export const uploadDocument = createAsyncThunk(
  "document/upload",
  async ({ file, user_id }: { file: File; user_id: string }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user_id);

    const response = await axios.post(
      `${import.meta.env.VITE_GAPI_URL}/api/upload`,
      formData,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    console.log(response.data)
    return response.data;
  }
);

// Analyze document
export const analyzeDocument = createAsyncThunk(
  "document/analyze",
  async (doc_id: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_GAPI_URL}/api/analyze/${doc_id}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    console.log(response.data);
    return response.data;
  }
);

// Chat with document
export const chatWithDocument = createAsyncThunk(
  "document/chat",
  async ({ doc_id, question }: { doc_id: string; question: string }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_GAPI_URL}/api/chat/${doc_id}`,
      { question },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    console.log(response.data.answer);
    
    return response.data.answer;
    
  }
);

// Get lawyer recommendations
export const getLawyerRecommendations = createAsyncThunk(
  "document/lawyers",
  async (doc_id: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_GAPI_URL}/api/lawyers/recommend/${doc_id}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    console.log(response.data.lawyers);
    
    return response.data.lawyers;
  }
);

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    setUserContext: (state, action) => {
      state.userContext = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearChatResponse: (state) => {
      state.chatResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadDocument.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.documents.push(action.payload);
        state.currentDocument = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.error.message || "Upload failed";
      })

      // Analyze
      .addCase(analyzeDocument.pending, (state) => {
        state.analysisLoading = true;
        state.error = null;
      })
      .addCase(analyzeDocument.fulfilled, (state, action) => {
        state.analysisLoading = false;
        if (state.currentDocument) {
          state.currentDocument.analysisResult = action.payload;
          state.documents = state.documents.map((d) =>
            d.id === state.currentDocument!.id ? state.currentDocument! : d
          );
        }
      })
      .addCase(analyzeDocument.rejected, (state, action) => {
        state.analysisLoading = false;
        state.error = action.error.message || "Analysis failed";
      })

      // Chat
      .addCase(chatWithDocument.pending, (state) => {
        state.chatLoading = true;
        state.error = null;
        state.chatResponse = null;
      })
      .addCase(chatWithDocument.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.chatResponse = action.payload;
      })
      .addCase(chatWithDocument.rejected, (state, action) => {
        state.chatLoading = false;
        state.error = action.error.message || "Chat failed";
      });
  },
});

export const { setCurrentDocument, setUserContext, clearError, clearChatResponse } =
  documentSlice.actions;
export default documentSlice.reducer;
