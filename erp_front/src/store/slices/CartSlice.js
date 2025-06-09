import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const checkoutCart = createAsyncThunk(
  "cart/checkout",
  async (cliente_id, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const productos = cart.items.map(item => ({
        producto_id: item.productId,
        cantidad: item.quantity
      }));

      console.log("Datos enviados:", { productos, cliente_id }); // Debug

      const response = await axios.post(
        `${url.apisales}/sales/createFromCart`,
        { productos, cliente_id },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Respuesta:", response.data); // Debug
      return response.data;
    } catch (error) {
      console.error("Error:", error.response.data); // Debug
      return rejectWithValue(error.response.data);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
    checkoutStatus: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
      
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(checkoutCart.pending, (state) => {
      state.checkoutStatus = "loading";
    })
    .addCase(checkoutCart.fulfilled, (state) => {
      state.checkoutStatus = "succeeded";
      state.items = [];
      localStorage.removeItem("cart");
    })
    .addCase(checkoutCart.rejected, (state, action) => {
      state.checkoutStatus = "failed";
      state.error = action.payload?.message || "Error al procesar la compra";
    });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
