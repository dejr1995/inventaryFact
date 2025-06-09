import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../../styles/CommonStyled";
import { productsEdit } from "../../../store/slices/ProductSlice";

const EditProduct = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { list, editStatus } = useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.categories);

  const [dataProducts, setDataProducts] = useState({
    name: "",
    description: "",
    price: null,
    stock: null,
    categoryId: "",
  });

  const [errors, setErrors] = useState({});

  const validationRules = {
    name: (value) => (!value.trim() ? "Nombre requerido" : ""),
    description: (value) => (!value.trim() ? "Descripción requerida" : ""),
    price: (value) => {
      const numericValue = parseFloat(value);
      return isNaN(numericValue) || numericValue <= 0
        ? "Precio debe ser mayor a 0"
        : "";
    },
    stock: (value) => {
      const numericValue = parseInt(value);
      return isNaN(numericValue) || numericValue < 0
        ? "Stock debe ser un número entero positivo"
        : "";
    },
    categoria_id: (value) => (!value ? "Categoría requerida" : ""), // Cambio de categoryId a categoria_id
  };

  const validateField = (name, value) => {
    const errorMessage = validationRules[name]
      ? validationRules[name](value)
      : "";
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage || undefined,
    }));
    return !errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === "precio") {
      processedValue = value.replace(/[^0-9.]/g, ""); // Permite números y puntos
      const parts = processedValue.split(".");
      if (parts.length > 1) {
        // Limitar a 2 decimales
        processedValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    } else if (name === "stock") {
      processedValue = value.replace(/[^0-9]/g, ""); // Solo números enteros
    }

    setDataProducts((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    validateField(name, processedValue);
  };

  const handleClickOpen = () => setOpen(true);

  useEffect(() => {
    if (open && productId) {
      const selectedProduct = list.find((item) => item.id === productId);
      if (selectedProduct) {
        setDataProducts({
          name: selectedProduct.nombre,
          description: selectedProduct.descripcion,
          price: selectedProduct.precio,
          stock: selectedProduct.stock,
          categoria_id: selectedProduct.categoria_id,
        });
        setErrors({});
      }
    }
  }, [open, productId, list]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataProducts).every((field) =>
      validateField(field, dataProducts[field])
    );

    if (isValid) {
      dispatch(productsEdit({ id: productId, ...dataProducts }));
      handleClose();
    }
  };

  return (
    <div>
      <Actions2>
        <MdEdit
          color="white"
          size={18}
          cursor={"pointer"}
          style={{ backgroundColor: "transparent" }}
          onClick={handleClickOpen}
        />
      </Actions2>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
          Actualizar Datos de Producto
        </DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                name="name"
                placeholder="Producto"
                value={dataProducts.name}
                onChange={handleChange}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
              <input
                type="text"
                required
                name="description"
                placeholder="Descripción"
                value={dataProducts.description}
                onChange={handleChange}
              />
              {errors.description && (
                <ErrorText>{errors.description}</ErrorText>
              )}
              <input
                type="number"
                required
                name="price"
                placeholder="Precio unitario"
                value={dataProducts.price ?? ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              {errors.price && <ErrorText>{errors.price}</ErrorText>}

              <select
                name="categoria_id"
                value={dataProducts.categoria_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <ErrorText>{errors.categoria_id}</ErrorText>
              )}

              <PrimaryButton type="submit">
                {editStatus === "pendiente" ? "actualizando" : "Guardar"}
              </PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProduct;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: center;
`;

const Actions2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4b70e2;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.8rem;
`;
