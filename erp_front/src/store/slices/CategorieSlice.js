import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axios.get(`${url.apiproducts}/categories`); // Ajusta la URL según tu API
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const CategorieSlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
});


