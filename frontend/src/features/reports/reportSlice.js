import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../../services/reportService';
import toast from 'react-hot-toast';

const initialState = {
  items: [],
  selectedItem: null,
  pagination: {
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
};

// ============================================
// Async Thunks
// ============================================

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reportService.getAll(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reports');
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'reports/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await reportService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch report');
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/create',
  async (data, { rejectWithValue }) => {
    try {
      const result = await reportService.create(data);
      toast.success('Felt report submitted successfully');
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create report');
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await reportService.update(id, data);
      toast.success('Report updated successfully');
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (id, { rejectWithValue }) => {
    try {
      await reportService.delete(id);
      toast.success('Report deleted successfully');
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete report');
    }
  }
);

// ============================================
// Slice
// ============================================

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearSelectedItem: (state) => { state.selectedItem = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    builder
      .addCase(fetchReportById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchReportById.fulfilled, (state, action) => { state.isLoading = false; state.selectedItem = action.payload; })
      .addCase(fetchReportById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    builder
      .addCase(createReport.pending, (state) => { state.isLoading = true; })
      .addCase(createReport.fulfilled, (state, action) => { state.isLoading = false; state.items.unshift(action.payload); })
      .addCase(createReport.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    builder
      .addCase(updateReport.pending, (state) => { state.isLoading = true; })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateReport.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    builder
      .addCase(deleteReport.pending, (state) => { state.isLoading = true; })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearSelectedItem, clearError } = reportSlice.actions;
export default reportSlice.reducer;
