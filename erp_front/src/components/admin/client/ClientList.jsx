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
  clientsAllFetch,
  clientsDelete,
} from "../../../store/slices/ClientSlice";
import EditClient from "./EditClient";

const ClientList = () => {
  const dispatch = useDispatch();
  const { list: clients } = useSelector((state) => state.clients);

  const [filterText, setFilterText] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(clientsAllFetch());
  }, [dispatch]);

  if (!clients) {
    return <p>Cargando clientes...</p>;
  }

  const handleDelete = (id) => {
    setDeleteCandidate(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(clientsDelete(deleteCandidate));
    setShowDeleteDialog(false);
  };

  const columns = [
    {
      field: "names",
      headerName: "Nombres",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "lastnames",
      headerName: "Apellidos",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "dni",
      headerName: "dni",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "email",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "direction",
      headerName: "direccion",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditClient clientId={params.row.id} />;
      },
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

  const rows = clients.map((client, index) => ({
    id: client.id || index,
    names: client.nombres,
    lastnames: client.apellidos,
    dni: client.dni,
    email: client.email,
    direction: client.direccion,
  }));

  const filteredRows = rows.filter((row) =>
    row.names?.toLowerCase().includes(filterText.toLowerCase())
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

export default ClientList;

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
