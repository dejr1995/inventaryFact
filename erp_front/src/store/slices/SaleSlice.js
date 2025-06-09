import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const fetchSales = createAsyncThunk(
  "sales/fetchSales",
  async () => {
    try {
      const response = await axios.get(`${url.apisales}/sales`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const saleCreate = createAsyncThunk(
  "sales/saleCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url.apisales}/sales/create`,
        values
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const getSaleById = createAsyncThunk(
  "sales/getSaleById",
  async (saleId) => {
    try {
      const response = await axios.get(`${url.apisales}/sales/${saleId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const updateSaleStatus = createAsyncThunk(
  "sales/updateSaleStatus",
  async ({ saleId, estado }) => {
    try {
      const response = await axios.patch(
        `${url.apisales}/sales/update-status/${saleId}`,
        { estado }
      );
      return { saleId, estado: response.data.estado };
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const adjustTotal = createAsyncThunk(
  "sales/adjustTotal",
  async ({ saleId, amountToSubtract }) => {
    try {
      const response = await axios.patch(
        `${url.apisales}/sales/adjust-total/${saleId}`,
        { amountToSubtract }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const SaleSlice = createSlice({
  name: "sales",
  initialState: {
    list: [],
    status: "idle",
    createStatus: "idle",
    editStatus: "idle",
    deleteStatus: "idle",
    saleDetail: null,
    saleDetailStatus: "idle",
  },
  reducers: {
    resetSaleStatus: (state) => {
      state.createStatus = "idle";
      state.error = null;
      state.sale = null;
    },
    resetSaleDetail: (state) => {
      state.saleDetail = null;
      state.saleDetailStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchSales.pending, (state) => {
      state.status = "pending";
    })
    .addCase(fetchSales.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = "success";
    })
    .addCase(fetchSales.rejected, (state) => {
      state.status = "rejected";
    })
    .addCase(saleCreate.pending, (state) => {
      state.createStatus = "pending";
    })
    .addCase(saleCreate.fulfilled, (state, action) => {
      state.list.push(action.payload);
      state.createStatus = "success";
    })
    .addCase(saleCreate.rejected, (state) => {
      state.createStatus = "rejected";
    })
    .addCase(getSaleById.pending, (state) => {
      state.saleDetailStatus = "pending";
    })
    .addCase(getSaleById.fulfilled, (state, action) => {
      state.saleDetail = action.payload;
      state.saleDetailStatus = "success";
    })
    .addCase(getSaleById.rejected, (state) => {
      state.saleDetailStatus = "rejected";
    })
    .addCase(updateSaleStatus.pending, (state, action) => {
      const { saleId, estado } = action.meta.arg;
      const index = state.list.findIndex(sale => sale.saleId === saleId);
      if (index !== -1) {
        state.list[index].estado = estado; 
      }
      state.editStatus = "pending";
    })
    .addCase(updateSaleStatus.fulfilled, (state, action) => {
      const { saleId, estado } = action.payload;
      state.list = state.list.map((sale) =>
        sale.saleId === saleId ? { ...sale, estado } : sale
      );
      state.editStatus = "success";
    })
    .addCase(updateSaleStatus.rejected, (state) => {
      state.editStatus = "rejected";
    })
    .addCase(adjustTotal.pending, (state) => {
      state.loading = true;
    })
    .addCase(adjustTotal.fulfilled, (state, action) => {
      const index = state.list.findIndex(s => s.saleId === action.payload.saleId);
      if (index !== -1) {
        state.list[index].total = action.payload.newTotal;
        
        // Si el total se vuelve 0, actualiza el estado a "Pagado"
        if (action.payload.newTotal === 0) {
          state.list[index].estado = "Pagado";
        }
      }
      state.loading = false;
    })
    
    .addCase(adjustTotal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetSaleStatus, resetSaleDetail  } = SaleSlice.actions;
