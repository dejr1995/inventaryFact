// src/redux/slices/reportSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

// Reporte: Ventas por rango de fechas
export const fetchSalesByDate = createAsyncThunk(
  "reports/fetchSalesByDate",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${url.apisales}/reports/sales`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
);

// Reporte: Bajo stock
export const fetchLowStock = createAsyncThunk(
  "reports/fetchLowStock",
  async () => {
    const response = await axios.get(`${url.apiproducts}/reports/low-stock`);
    return response.data;
  }
);

// Reporte: Movimientos
export const fetchMovements = createAsyncThunk(
  "reports/fetchMovements",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${url.apiproducts}/reports/movements`,{
        params: { startDate, endDate },
      });
    return response.data;
  }
);

// Reporte: Top productos
export const fetchTopProducts = createAsyncThunk(
  "reports/fetchTopProducts",
  async () => {
    const response = await axios.get(`${url.apisales}/reports/top-products`);
    return response.data;
  }
);

// Reporte: Top clientes
export const fetchTopClients = createAsyncThunk(
  "reports/fetchTopClients",
  async () => {
    const response = await axios.get(`${url.apiclients}/reports/top-clients`);
    return response.data;
  }
);

// Reporte: Ventas por categoría
export const fetchSalesByCategory = createAsyncThunk(
  "reports/fetchSalesByCategory",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${url.apisales}/reports/sales-by-category`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
);


// Slice
export const ReportSlice = createSlice({
  name: "reports",
  initialState: {
    sales: [],
    lowStock: [],
    movements: [],
    topProducts: [],
    topClients: [],
    salesByCategory: [],
    status: {
      sales: "idle",
      lowStock: "idle",
      movements: "idle",
      topProducts: "idle",
      topClients: "idle",
      salesByCategory: "idle",
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Ventas
      .addCase(fetchSalesByDate.pending, (state) => {
        state.status.sales = "loading";
      })
      .addCase(fetchSalesByDate.fulfilled, (state, action) => {
        state.sales = action.payload;
        state.status.sales = "succeeded";
      })
      .addCase(fetchSalesByDate.rejected, (state, action) => {
        state.status.sales = "failed";
        state.error = action.error.message;
      })

      // Bajo Stock
      .addCase(fetchLowStock.pending, (state) => {
        state.status.lowStock = "loading";
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStock = action.payload;
        state.status.lowStock = "succeeded";
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.status.lowStock = "failed";
        state.error = action.error.message;
      })

      // Movimientos
      .addCase(fetchMovements.pending, (state) => {
        state.status.movements = "loading";
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.movements = action.payload;
        state.status.movements = "succeeded";
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        state.status.movements = "failed";
        state.error = action.error.message;
      })

      // Top Productos
      .addCase(fetchTopProducts.pending, (state) => {
        state.status.topProducts = "loading";
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
        state.status.topProducts = "succeeded";
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.status.topProducts = "failed";
        state.error = action.error.message;
      })

      // Top Clientes
      .addCase(fetchTopClients.pending, (state) => {
        state.status.topClients = "loading";
      })
      .addCase(fetchTopClients.fulfilled, (state, action) => {
        state.topClients = action.payload;
        state.status.topClients = "succeeded";
      })
      .addCase(fetchTopClients.rejected, (state, action) => {
        state.status.topClients = "failed";
        state.error = action.error.message;
      })

      // Ventas por categoría
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.status.salesByCategory = "loading";
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.salesByCategory = action.payload;
        state.status.salesByCategory = "succeeded";
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.status.salesByCategory = "failed";
        state.error = action.error.message;
      })

  },
});

