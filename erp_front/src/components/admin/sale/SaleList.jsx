import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../../styles/Theme";
import { Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchSales,
  getSaleById,
  updateSaleStatus,
} from "../../../store/slices/SaleSlice";
import InvoiceSheet from "./InvoiceSheet";
import { AiFillPrinter } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import Amount from "./Amount";
import { fetchCompany } from "../../../store/slices/CompanySlice";

const SaleList = () => {
  const dispatch = useDispatch();
  const {
    list: sales,
    listStatus,
    error,
    saleDetail,
    saleDetailStatus,
  } = useSelector((state) => state.sales);
  const { data: company, status: companyStatus } = useSelector(
    (state) => state.company
  );
  const [filterText, setFilterText] = useState("");

  const [selectedSaleId, setSelectedSaleId] = useState(null);

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchCompany());
  }, [dispatch]);

  {
    companyStatus === "loading" && <p>Cargando datos de empresa...</p>;
  }
  {
    companyStatus === "failed" && <p>Error cargando datos de empresa</p>;
  }

  if (listStatus === "pending") return <p>Cargando facturas...</p>;
  if (listStatus === "failed") return <p>Error: {error}</p>;
  if (!sales || sales.length === 0) return <p>No se encontraron facturas.</p>;

  const handlePrint = (invoice) => {
    setSelectedSaleId(invoice.saleId);
    dispatch(getSaleById(invoice.saleId));
  };

  const handleUpdateStatus = (saleId, newEstado) => {
    console.log("Actualizar venta:", saleId, "a", newEstado);
    dispatch(updateSaleStatus({ saleId, estado: newEstado }));
  };

  const columns = [
    {
      field: "comprobante",
      headerName: "Comprobante",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "total",
      headerName: "Debe",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Imprimir",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.estado === "Anulado") {
          return;
        }
        return (
          <Cell>
            <Print onClick={() => handlePrint(params.row)}>
              <AiFillPrinter
                color="white"
                size={18}
                cursor={"pointer"}
                style={{ backgroundColor: "transparent" }}
              />
            </Print>
          </Cell>
        );
      },
    },
    {
      field: "actions1",
      headerName: "Abonar",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.estado === "Anulado") {
          return;
        }
        return (
          <Cell>
            <Amount amountId={params.row.id} />
          </Cell>
        );
      },
    },
    {
      field: "actions2",
      headerName: "Anular",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.estado === "Anulado" || params.row.estado === "Pagado") {
          return;
        }
        return (
          <Cell>
            <Canceled
              onClick={() => handleUpdateStatus(params.row.saleId, "Anulado")}
            >
              <MdCancel
                color="white"
                size={18}
                cursor={"pointer"}
                style={{ backgroundColor: "transparent" }}
              />
            </Canceled>
          </Cell>
        );
      },
    },
  ];

  const rows = sales.map((sale, index) => ({
    id: sale.saleId || index,
    saleId: sale.saleId,
    comprobante: sale.comprobante,
    total: sale.total,
    estado: sale.estado,
  }));

  const filteredRows = rows.filter((row) =>
    row.estado?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <FilterInput
          type="text"
          placeholder="Buscar por estado..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <StyledDataGrid
          rows={filteredRows}
          columns={columns}
          getRowClassName={(params) =>
            params.row.estado === "Anulada" ? "row-anulada" : ""
          }
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Container>

      {selectedSaleId && (
        <ModalOverlay onClick={() => setSelectedSaleId(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {saleDetailStatus === "pending" ? (
              <p>Cargando factura...</p>
            ) : saleDetail && saleDetail.saleId === selectedSaleId ? (
              <InvoiceSheet
                invoice={saleDetail}
                client={saleDetail.client}
                companyInfo={company}
              />
            ) : (
              <p>Error al cargar la factura.</p>
            )}
            <CloseButton onClick={() => setSelectedSaleId(null)}>
              Cerrar
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </ThemeProvider>
  );
};

export default SaleList;

const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px; /* Limita el ancho máximo */
  border-top: 1px solid #ddd;
  padding-top: 20px;
  height: 400px; /* Altura fija para el DataGrid */
`;

const FilterInput = styled.input`
  width: 100%;
  max-width: 900px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e24b4b;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #c0392b;
  }
`;

const Cell = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Print = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: #e27d4b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`;

const Canceled = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e24b4b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`;

const Paid = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3cb43c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`;

const Earning = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3c9de2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`;
