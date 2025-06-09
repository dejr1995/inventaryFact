import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const clientsAllFetch = createAsyncThunk(
  "clients/clientsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url.apiclients}/clients`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const clientsCreate = createAsyncThunk(
  "clients/clientsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url.apiclients}/clients/create`,
        values
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const clientsEdit = createAsyncThunk(
  "clients/clientsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url.apiclients}/clients/${values.id}`,
        values,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const clientsDelete = createAsyncThunk(
  "clients/clientsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url.apiclients}/clients/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const ClientSlice = createSlice({
  name: "clients",
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
      .addCase(clientsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clientsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(clientsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(clientsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(clientsCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(clientsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(clientsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(clientsEdit.fulfilled, (state, action) => {
        const updatedClient = state.list.map((client) =>
          client.id === action.payload.id ? action.payload : client
        );
        state.list = updatedClient;
        state.editStatus = "success";
      })
      .addCase(clientsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(clientsDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(clientsDelete.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.meta.arg);
        state.deleteStatus = "success";
      })
      .addCase(clientsDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
