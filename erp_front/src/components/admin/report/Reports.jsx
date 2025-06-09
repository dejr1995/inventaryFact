import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLowStock,
  fetchMovements,
  fetchSalesByCategory,
  fetchSalesByDate,
  fetchTopClients,
  fetchTopProducts,
} from "../../../store/slices/ReportSlice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { TableReport } from "../../styles/Table";

registerLocale("es", es);

const Reports = () => {
  const dispatch = useDispatch();

  const today = new Date();

  const [range, setRange] = useState({
    startDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    ),
    endDate: today,
  });
  const [selectedReport, setSelectedReport] = useState("ventas");
  const [filter, setFilter] = useState("");

  const {
    sales,
    lowStock,
    movements,
    topProducts,
    topClients,
    salesByCategory,
    status,
  } = useSelector((state) => state.reports);

  useEffect(() => {
    const formattedRange = {
      startDate: range.startDate.toISOString().slice(0, 10),
      endDate: range.endDate.toISOString().slice(0, 10),
    };

    dispatch(fetchSalesByDate(formattedRange));
    dispatch(fetchLowStock());
    dispatch(fetchMovements(formattedRange));
    dispatch(fetchTopProducts());
    dispatch(fetchTopClients());
    dispatch(fetchSalesByCategory(formattedRange));
  }, [dispatch, range]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const filteredUsers = sales.filter(
    (user) =>
      user.comprobante.toLowerCase().includes(filter.toLowerCase()) ||
      user.cliente.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredMovements = movements.filter((movement) =>
    movement.tipo.toLowerCase().includes(filter.toLowerCase())
  );

  const exportToExcel = () => {
    let dataToExport = [];

    switch (selectedReport) {
      case "ventas":
        dataToExport = filteredUsers.map((s) => ({
          Comprobante: s.comprobante,
          Cliente: s.cliente,
          Items: s.items,
          Total: s.total,
          Fecha: new Date(s.fecha).toLocaleDateString("es-PE"),
        }));
        break;
      case "bajoStock":
        dataToExport = lowStock.map((p) => ({
          Producto: p.nombre,
          Stock: p.stock,
          "Stock mínimo": p.stock_minimo,
        }));
        break;
      case "movimientos":
        dataToExport = movements.map((m) => ({
          Tipo: m.tipo,
          Producto: m.producto,
          Persona: m.proveedor || m.cliente,
          Cantidad: m.cantidad,
          Fecha: new Date(m.fecha).toLocaleDateString("es-PE"),
        }));
        break;
      case "topProductos":
        dataToExport = topProducts.map((p) => ({
          Producto: p.producto,
          "Unidades vendidas": p.unidades_vendidas,
          Ingresos: p.ingresos,
        }));
        break;
      case "topClientes":
        dataToExport = topClients.map((c) => ({
          Cliente: c.cliente,
          Compras: c.total_compras,
          "Gasto total": c.gasto_total,
        }));
        break;
      case "ventasPorCategoria":
        dataToExport = salesByCategory.map((cat) => ({
          Categoría: cat.categoria,
          "Items vendidos": cat.total_items,
          "Total ventas": cat.total_ventas,
        }));
        break;
      default:
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Reporte_${selectedReport}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <PageContainer>
      <Title>📊 Reportes Generales</Title>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Label>Selecciona un reporte: </Label>
          <StyledSelect
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="ventas">🧾 Ventas</option>
            <option value="bajoStock">📉 Bajo stock</option>
            <option value="movimientos">🔄 Movimientos</option>
            <option value="topProductos">🏆 Top productos</option>
            <option value="topClientes">👑 Mejores clientes</option>
            <option value="ventasPorCategoria">🗂️ Ventas por categoría</option>
          </StyledSelect>
        </div>

        {/* Filtro por fecha con react-datepicker */}

        <div style={{ display: "flex", gap: "1rem" }}>
          <div>
            <Label>Desde: </Label>
            <DatePicker
              selected={range.startDate}
              onChange={(date) =>
                setRange((prev) => ({ ...prev, startDate: date }))
              }
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="border p-2 rounded"
            />
          </div>
          <div>
            <Label>Hasta: </Label>
            <DatePicker
              selected={range.endDate}
              onChange={(date) =>
                setRange((prev) => ({ ...prev, endDate: date }))
              }
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div>
            <Label>Filtro 1: </Label>
            <input
              placeholder="Comprobante o cliente ..."
              value={filter}
              onChange={handleFilterChange}
              disabled={selectedReport !== "ventas"}
              className={`border p-2 rounded w-full ${
                selectedReport !== "ventas"
                  ? "bg-gray-200 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
          <div>
            <Label>Filtro 2: </Label>
            <input
              placeholder="Tipo ..."
              value={filter}
              onChange={handleFilterChange}
              disabled={selectedReport !== "movimientos"}
              className={`border p-2 rounded w-full ${
                selectedReport !== "ventas"
                  ? "bg-gray-200 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
        </div>
        <StyledButton onClick={exportToExcel}>📤 Exportar a Excel</StyledButton>
      </div>
      {selectedReport === "ventas" && (
        <TableSection>
          <SubTitle>🧾 Ventas</SubTitle>
          <TableReport>
            <thead>
              <tr>
                <th className="">Comprobante</th>
                <th className="">Cliente</th>
                <th className="text-center">Items</th>
                <th className="text-right">Total</th>
                <th className="">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((s, i) => (
                <tr key={i}>
                  <td className="">{s.comprobante}</td>
                  <td className="">{s.cliente}</td>
                  <td className="text-center">{s.items}</td>
                  <td className="text-right text-success">
                    S/ {s.total.toFixed(2)}
                  </td>
                  <td className="">
                    {new Date(s.fecha).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}

      {selectedReport === "bajoStock" && (
        <TableSection>
          <SubTitle>📉 Productos con bajo stock</SubTitle>
          <TableReport className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Producto</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Stock mínimo</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.nombre}</td>
                  <td className="text-center">{p.stock}</td>
                  <td className="text-center">{p.stock_minimo}</td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}

      {selectedReport === "movimientos" && (
        <TableSection>
          <SubTitle>🔄 Movimientos</SubTitle>
          <TableReport className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Producto</th>
                <th className="p-2 border">Cliente</th>
                <th className="text-center">Cantidad</th>
                <th className="p-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m, i) => (
                <tr key={i}>
                  <td className="p-2 border capitalize">{m.tipo}</td>
                  <td className="p-2 border">{m.producto}</td>
                  <td className="p-2 border">{m.proveedor || m.cliente}</td>
                  <td className="text-center">{m.cantidad}</td>
                  <td className="p-2 border">
                    {new Date(m.fecha).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}

      {selectedReport === "topProductos" && (
        <TableSection>
          <SubTitle>🏆 Productos más vendidos</SubTitle>
          <TableReport className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border capitalize">{p.producto}</td>
                  <td className="text-center">{p.unidades_vendidas} uds</td>
                  <td className="text-right text-success">
                    S/ {(Number(p.ingresos) || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}

      {selectedReport === "topClientes" && (
        <TableSection>
          <SubTitle>👑 Mejores clientes</SubTitle>
          <TableReport className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Cliente</th>
                <th className="text-center">Total_compras</th>
                <th className="text-right">Gasto_total</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((c, i) => (
                <tr key={i}>
                  <td className="p-2 border capitalize">{c.cliente}</td>
                  <td className="text-center">{c.total_compras}</td>
                  <td className="text-right text-success">
                    S/ {(Number(c.gasto_total) || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}

      {selectedReport === "ventasPorCategoria" && (
        <TableSection>
          <SubTitle>🗂️ Ventas por categoría</SubTitle>
          <TableReport className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Categoría</th>
                <th className="text-center">Items vendidos</th>
                <th className="text-right">Total ventas</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory.map((cat, i) => (
                <tr key={i}>
                  <td className="p-2 border">{cat.categoria}</td>
                  <td className="text-center">{cat.total_items}</td>
                  <td className="text-right text-success">
                    S/ {cat.total_ventas.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableReport>
        </TableSection>
      )}
    </PageContainer>
  );
};

export default Reports;

import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
`;

export const SubTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
`;

export const Label = styled.label`
  font-weight: 600;
  margin-right: 0.5rem;
  font-size: 0.95rem;
`;

export const StyledSelect = styled.select`
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background-color: #fff;
  }
`;

export const StyledInput = styled.input`
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 100%;
  background-color: ${({ disabled }) => (disabled ? "#e5e7eb" : "#fff")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "auto")};
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

export const StyledButton = styled.button`
  margin-top: 0.5rem;
  background-color: #16a34a;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  &:hover {
    background-color: #15803d;
  }
`;

export const TableSection = styled.section`
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  padding: 1rem;
`;

export const StyledTable = styled.table`
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
  thead {
    background-color: #f3f4f6;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;
  }

  tr:hover {
    background-color: #f9fafb;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-success {
    color: #16a34a;
    font-weight: 500;
  }
`;
