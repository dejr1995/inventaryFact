import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { fetchReport } from "../../../store/slices/ReportSlice";

const ReportForm = () => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    reportType: "sales",
    startDate: null,
    endDate: null,
    minStock: 10,
  });

  const reportConfig = {
    sales: {
      fields: ["startDate", "endDate"],
      label: "Reporte de Ventas",
    },
    "low-stock": {
      fields: ["minStock"],
      label: "Stock Crítico",
    },
    movements: {
      fields: ["startDate", "endDate"],
      label: "Movimientos",
    },
    "top-clients": {
      fields: [],
      label: "Mejores Clientes",
    },
    "top-products": {
      fields: [],
      label: "Productos Más Vendidos",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      startDate: formState.startDate?.toISOString(),
      endDate: formState.endDate?.toISOString(),
      minStock: formState.minStock,
    };

    dispatch(
      fetchReport({
        type: formState.reportType,
        params,
      })
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Reporte</InputLabel>
              <Select
                value={formState.reportType}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    reportType: e.target.value,
                  }))
                }
              >
                {Object.entries(reportConfig).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {reportConfig[formState.reportType].fields.includes("startDate") && (
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha Inicio"
                value={formState.startDate}
                onChange={(newValue) =>
                  setFormState((prev) => ({
                    ...prev,
                    startDate: newValue,
                  }))
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          )}

          {reportConfig[formState.reportType].fields.includes("endDate") && (
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha Fin"
                value={formState.endDate}
                onChange={(newValue) =>
                  setFormState((prev) => ({
                    ...prev,
                    endDate: newValue,
                  }))
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          )}

          {reportConfig[formState.reportType].fields.includes("minStock") && (
            <Grid item xs={12} md={4}>
              <TextField
                label="Stock Mínimo"
                type="number"
                fullWidth
                value={formState.minStock}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    minStock: e.target.value,
                  }))
                }
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2 }}
            >
              Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ReportForm;
