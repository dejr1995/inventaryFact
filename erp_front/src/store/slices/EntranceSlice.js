import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../api";

export const entranceEntryCreate = createAsyncThunk(
  "entrance/entranceEntryCreate",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url.apientrances}/entrances/create`,
        values,
        setHeaders() // Headers con token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al crear la entrada"
      );
    }
  }
);

export const entranceEntriesFetch = createAsyncThunk(
  "entrance/entranceEntriesFetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url.apientrances}/entrances`,
        setHeaders() // Headers para autenticación
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al cargar entradas"
      );
    }
  }
);

export const entranceEntryDelete = createAsyncThunk(
  'entrance/entranceEntryDelete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url.apientrances}/entrances/${id}`,
        setHeaders() // Incluye token
      );
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al eliminar la entrada"
      );
    }
  }
);

export const entranceSlice = createSlice({
  name: "entrances",
  initialState: {
    list: [],
    status: "idle",
    deleteStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(entranceEntryCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(entranceEntryCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(entranceEntryCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(entranceEntriesFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(entranceEntriesFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(entranceEntriesFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(entranceEntryDelete.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(entranceEntryDelete.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.meta.arg);
        state.deleteStatus = 'succeeded';
      })
      .addCase(entranceEntryDelete.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export default entranceSlice.reducer;
