import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../../styles/Theme";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdDelete } from "react-icons/md";
import {
  entranceEntriesFetch,
  entranceEntryDelete,
} from "../../../store/slices/EntranceSlice";

const EntranceList = () => {
  const dispatch = useDispatch();
  const { list: entrances } = useSelector((state) => state.entrances);

  const [filterText, setFilterText] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(entranceEntriesFetch());
  }, [dispatch]);

  if (!entrances) {
    return <p>Cargando entradas...</p>;
  }

  const handleDelete = (id) => {
    setDeleteCandidate(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(entranceEntryDelete(deleteCandidate));
    setShowDeleteDialog(false);
  };

  const columns = [
    {
      field: "productId",
      headerName: "Producto",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "providerId",
      headerName: "Proveedor",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "precio_compra",
      headerName: "Precio",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 70,
      renderCell: (params) => {
        return (
          <Actions1>
            <MdDelete
              color="white"
              size={18}
              cursor={"pointer"}
              style={{ backgroundColor: "transparent" }}
              onClick={() => handleDelete(params.row.id)}
            />
          </Actions1>
        );
      },
    },
  ];

  const rows = entrances.map((entrance, index) => ({
    id: entrance.id || index,
    productId: entrance.producto_nombre,
    providerId: entrance.proveedor_nombre,
    quantity: entrance.stock_entrada,
    precio_compra: entrance.precio_compra,
  }));

  const filteredRows = rows.filter((row) =>
    row.productId?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <FilterInput
          type="text"
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <StyledDataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Container>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        keepMounted
      >
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas eliminar este cliente?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EntranceList;

const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px; /* Limita el ancho máximo */
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

const Actions1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e24b4b;
`;

const FilterInput = styled.input`
  width: 100%;
  max-width: 900px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
