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
import {
  productsAllFetch,
  productsDelete,
} from "../../../store/slices/ProductSlice";
import { MdDelete } from "react-icons/md";
import EditProduct from "./EditProduct";

const ProductList = () => {
  const dispatch = useDispatch();
  const { list: products } = useSelector((state) => state.products);

  const [filterText, setFilterText] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(productsAllFetch());
  }, [dispatch]);

  if (!products) {
    return <p>Cargando productos...</p>;
  }

  const handleDelete = (id) => {
    setDeleteCandidate(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(productsDelete(deleteCandidate));
    setShowDeleteDialog(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "description",
      headerName: "Descripcion",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "price",
      headerName: "Precio",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditProduct productId={params.row.id} />;
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

  const rows = products.map((product, index) => ({
    id: product.id || index,
    name: product.nombre,
    description: product.descripcion,
    price: product.precio,
    stock: product.stock,
  }));

  const filteredRows = rows.filter((row) =>
    row.name?.toLowerCase().includes(filterText.toLowerCase())
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

export default ProductList;

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
