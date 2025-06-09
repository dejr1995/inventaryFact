import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setHeaders, url } from '../api';
import axios from 'axios';

export const fetchCompany = createAsyncThunk(
  'company/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url.apiauth}/auth/me`,
        setHeaders()  // Usa headers centralizados (token desde localStorage)
      );

      // Asume que la respuesta del backend tiene empresa_id
      return response.data.empresa_id ? response.data : null;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al obtener empresa"
      );
    }
  }
);

export const createOrUpdateCompany = createAsyncThunk(
  'company/update',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url.apiauth}/auth/company`,
        companyData,
        setHeaders()  // Incluye Content-Type y Authorization
      );

      // Asume que el backend retorna { empresa: ... }
      return response.data.empresa;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Error de conexión con el servidor'
      );
    }
  }
);

export const CompanySlice = createSlice({
  name: 'company',
  initialState: {
    data: null,
    status: 'idle',
    error: null
  },
  reducers: {
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.data = action.payload?.empresa_id ? {
          razon_social: action.payload.razon_social,
          numero_ruc: action.payload.numero_ruc,
          domicilio_fiscal: action.payload.domicilio_fiscal,
          datos_contacto: action.payload.datos_contacto
        } : null;
      })
      .addCase(createOrUpdateCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrUpdateCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(createOrUpdateCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setEditMode } = CompanySlice.actions;