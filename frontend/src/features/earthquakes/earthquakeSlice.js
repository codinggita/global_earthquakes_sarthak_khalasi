import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import earthquakeService from '../../services/earthquakeService';
import toast from 'react-hot-toast';

const initialState = {
  items: [],
  selectedItem: null,
  stats: null,
  pagination: {
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    minMag: '',
    maxMag: '',
    status: '',
    alert: '',
    tsunami: '',
    startDate: '',
    endDate: '',
    sort: '-time',
  },
  isLoading: false,
  statsLoading: false,
  error: null,
};

// ============================================
// Async Thunks
// ============================================

export const fetchEarthquakes = createAsyncThunk(
  'earthquakes/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await earthquakeService.getAll(params);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch earthquakes');
    }
  }
);

export const fetchEarthquakeById = createAsyncThunk(
  'earthquakes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await earthquakeService.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch earthquake');
    }
  }
);

export const fetchEarthquakeStats = createAsyncThunk(
  'earthquakes/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await earthquakeService.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  }
);

export const createEarthquake = createAsyncThunk(
  'earthquakes/create',
  async (data, { rejectWithValue }) => {
    try {
      const result = await earthquakeService.create(data);
      toast.success('Earthquake event created successfully');
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create earthquake');
    }
  }
);

export const updateEarthquake = createAsyncThunk(
  'earthquakes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await earthquakeService.update(id, data);
      toast.success('Earthquake event updated successfully');
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update earthquake');
    }
  }
);

export const deleteEarthquake = createAsyncThunk(
  'earthquakes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await earthquakeService.delete(id);
      toast.success('Earthquake event deleted successfully');
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete earthquake');
    }
  }
);

// ============================================
// Slice
// ============================================

const earthquakeSlice = createSlice({
  name: 'earthquakes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchEarthquakes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch By ID
    builder
      .addCase(fetchEarthquakeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEarthquakeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Stats
    builder
      .addCase(fetchEarthquakeStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchEarthquakeStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEarthquakeStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // Create
    builder
      .addCase(createEarthquake.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEarthquake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createEarthquake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateEarthquake.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEarthquake.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateEarthquake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteEarthquake.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEarthquake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteEarthquake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedItem, clearError } = earthquakeSlice.actions;
export default earthquakeSlice.reducer;
