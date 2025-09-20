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
  userContext: UserContext | null;
  riskHistory: { date: string; score: number }[];
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  analysisLoading: false,
  uploadLoading: false,
  userContext: null,
  riskHistory: [],
  error: null,
};

// Helper to get token
const getToken = () => localStorage.getItem("token") || "";

// Upload document
export const uploadDocument = createAsyncThunk(
  "document/upload",
  async ({ file, context }: { file: File; context: UserContext }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "contract");

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/document/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.document;
  }
);

// Analyze document
export const analyzeDocument = createAsyncThunk(
  "document/analyze",
  async (documentId: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/document/check-safety`,
      { documentId }, // ✅ correct
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        console.log("✅ Upload done", action.payload);
        state.uploadLoading = false;
        state.documents.push(action.payload);
        state.currentDocument = action.payload;
      })

      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.error.message || "Upload failed";
      })
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
      });
  },
});

export const { setCurrentDocument, setUserContext, clearError } =
  documentSlice.actions;
export default documentSlice.reducer;
