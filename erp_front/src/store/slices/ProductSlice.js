import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const productsAllFetch = createAsyncThunk(
  "products/productsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url.apiproducts}/products`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url.apiproducts}/products/create`,
        values
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url.apiproducts}/products/${values.id}`,
        values,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url.apiproducts}/products/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const ProductSlice = createSlice({
  name: "products",
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
      .addCase(productsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(productsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(productsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(productsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(productsCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(productsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(productsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(productsEdit.fulfilled, (state, action) => {
        const updatedProduct = state.list.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        state.list = updatedProduct;
        state.editStatus = "success";
      })
      .addCase(productsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(productsDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(productsDelete.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.meta.arg);
        state.deleteStatus = "success";
      })
      .addCase(productsDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
