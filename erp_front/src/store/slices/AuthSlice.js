import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setHeaders, url } from "../api";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    try {
      const response = await axios.post(
        `${url.apiauth}/auth/login`,
        credentials,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData) => {
    try {
      const response = await axios.post(
        `${url.apiauth}/auth/users`,
        userData,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const response = await axios.get(
        `${url.apiauth}/me`,
        setHeaders()
      );
      
      return { user: response.data, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error de autenticación"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url.apiauth}/auth/me`,
        updatedData,
        setHeaders()
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al actualizar"
      );
    }
  }
);

export const fetchUsersByRole = createAsyncThunk(
  "auth/fetchByRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url.apiauth}/auth/users/role/${roleId}`,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al cargar usuarios"
      );
    }
  }
);

export const authDelete = createAsyncThunk(
  "auth/authDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url.apiauth}/auth/${id}`,setHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    list: [],
    status: "idle",
    loginStatus: "idle",
    registerStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",
    error: null,
    token: null,
    empresa: null,
    usersByRole: [],
    fetchStatus: 'idle',
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');

      return {
        ...state,
        list: [],
        status: "idle",
        loginStatus: "idle",
        registerStatus: "idle",
        updateStatus: "idle",
        error: null,
        token: null,
        empresa: null,
      }
    },
    resetRegisterStatus: (state) => {
      state.registerStatus = "idle";
      state.error = null;
    },
    updateProfileOptimistic: (state, action) => {
      state.list[0] = { ...state.list[0], ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.list = [action.payload.user];
        state.token = action.payload.token;
        state.empresa = action.payload.user.empresa;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      })
      
      // Registro
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.list = [action.payload.user];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload;
      })
      
      // Verificación de autenticación
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = [action.payload.user];
        state.token = action.payload.token;
        state.empresa = action.payload.user.empresa;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
        state.token = null;
        state.empresa = null;
      })
      //
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.list = [action.payload.user];
        if (action.payload.token) {
          state.token = action.payload.token;
        }
        state.empresa = action.payload.user.empresa;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUsersByRole.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.usersByRole = action.payload;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(authDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(authDelete.fulfilled, (state, action) => {
        state.usersByRole = state.usersByRole.filter(item => item.id !== action.meta.arg);
        state.deleteStatus = "success";
      })
      .addCase(authDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});

export const { logout, resetRegisterStatus } = AuthSlice.actions;