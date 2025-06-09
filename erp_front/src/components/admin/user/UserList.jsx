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
import { authDelete, fetchUsersByRole } from "../../../store/slices/AuthSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const { usersByRole, fetchStatus, error } = useSelector(
    (state) => state.auth
  );
  const USER_ROLE_ID = "ae59fd8d-0f7f-11f0-9fae-3c7c3f24f0df";

  const [filterText, setFilterText] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersByRole(USER_ROLE_ID));
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteCandidate(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(authDelete(deleteCandidate));
    setShowDeleteDialog(false);
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "empresa",
      headerName: "Empresa",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>
          {params.row.razon_social || "Sin empresa"}
        </span>
      ),
    },
    {
      field: "fecha_registro",
      headerName: "Registro",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 70,
      renderCell: (params) => (
        <Actions1>
          <MdDelete
            color="white"
            size={18}
            cursor={"pointer"}
            style={{ backgroundColor: "transparent" }}
            onClick={() => handleDelete(params.row.id)}
          />
        </Actions1>
      ),
    },
  ];

  const rows = usersByRole.map((user) => ({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    razon_social: user.razon_social,
    fecha_registro: user.created_at,
  }));

  const filteredRows = rows.filter(
    (row) =>
      row.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.email?.toLowerCase().includes(filterText.toLowerCase())
  );

  if (fetchStatus === "loading") return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <FilterInput
          type="text"
          placeholder="Buscar por nombre o email..."
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

export default UserList;

// Estilos (manteniendo tu estructura)
const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px;
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
