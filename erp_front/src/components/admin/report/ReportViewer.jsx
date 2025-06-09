import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const getColumns = (reportType) => {
  switch (reportType) {
    case "sales":
      return [
        { field: "fecha", headerName: "Fecha", width: 120 },
        { field: "comprobante", headerName: "Comprobante", width: 150 },
        { field: "cliente", headerName: "Cliente", width: 200 },
        { field: "items", headerName: "Artículos", width: 100 },
        {
          field: "total",
          headerName: "Total",
          width: 120,
          valueFormatter: (params) => `$${params.value.toFixed(2)}`,
        },
      ];

    case "low-stock":
      return [
        { field: "nombre", headerName: "Producto", width: 200 },
        { field: "stock", headerName: "Stock Actual", width: 120 },
        { field: "stock_minimo", headerName: "Stock Mínimo", width: 120 },
      ];

    case "movements":
      return [
        { field: "tipo", headerName: "Tipo", width: 100 },
        { field: "producto", headerName: "Producto", width: 200 },
        { field: "proveedor", headerName: "Proveedor/Cliente", width: 200 },
        { field: "cantidad", headerName: "Cantidad", width: 100 },
        { field: "fecha", headerName: "Fecha", width: 120 },
      ];

    case "top-clients":
      return [
        { field: "cliente", headerName: "Cliente", width: 250 },
        { field: "total_compras", headerName: "Compras", width: 100 },
        {
          field: "gasto_total",
          headerName: "Gasto Total",
          width: 120,
          valueFormatter: (params) => `$${params.value?.toFixed(2) || "0.00"}`,
        },
      ];

    case "top-products":
      return [
        { field: "producto", headerName: "Producto", width: 250 },
        { field: "unidades_vendidas", headerName: "Unidades", width: 100 },
        {
          field: "ingresos",
          headerName: "Ingresos",
          width: 120,
          valueFormatter: (params) => `$${params.value.toFixed(2)}`,
        },
      ];

    default:
      return [];
  }
};

const ReportViewer = () => {
  const { data, currentReport, loading, error } = useSelector(
    (state) => state.reports
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error en {error.type}: {error.message}
        </Alert>
      )}

      {currentReport && (
        <div className="h-[600px]">
          <DataGrid
            rows={data}
            columns={getColumns(currentReport)}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
