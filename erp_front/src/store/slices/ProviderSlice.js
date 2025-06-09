import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const providersAllFetch = createAsyncThunk(
  "providers/providersAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url.apiproviders}/providers`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const providersCreate = createAsyncThunk(
  "providers/providersCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url.apiproviders}/providers/create`,
        values
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const providersEdit = createAsyncThunk(
  "providers/providersEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url.apiproviders}/providers/${values.id}`,
        values,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const providersDelete = createAsyncThunk(
  "providers/providersDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url.apiproviders}/providers/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const ProviderSlice = createSlice({
  name: "providers",
  initialState: {
    list: [],
    status: "idle",
    createStatus: "idle",
    editStatus: "idle",
    deleteStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(providersAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(providersAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(providersAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(providersCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(providersCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(providersCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(providersEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(providersEdit.fulfilled, (state, action) => {
        const updatedProvider = state.list.map((provider) =>
            provider.id === action.payload.id ? action.payload : provider
        );
        state.list = updatedProvider;
        state.editStatus = "success";
      })
      .addCase(providersEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(providersDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(providersDelete.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.meta.arg);
        state.deleteStatus = "success";
      })
      .addCase(providersDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
