import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../../styles/CommonStyled";
import { productsCreate } from "../../../store/slices/ProductSlice";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: categories } = useSelector((state) => state.categories);

  const [dataProducts, setDataProducts] = useState({
    name: "",
    description: "",
    price: null,
    stock: null,
    categoria_id: "",
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

    if (name === "price") {
      processedValue = value.replace(/[^0-9.]/g, "");
      const parts = processedValue.split(".");
      if (parts.length > 1) {
        processedValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    } else if (name === "stock") {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setDataProducts((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    validateField(name, processedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataProducts).every((field) =>
      validateField(field, dataProducts[field])
    );

    if (isValid) {
      console.log("Datos enviados:", dataProducts);
      dispatch(
        productsCreate({
          ...dataProducts,
          name: String(dataProducts.name),
          description: String(dataProducts.description),
          price: Number(dataProducts.price),
          stock: Number(dataProducts.stock),
        })
      )
        .unwrap()
        .then(() => {
          alert("Producto registrado correctamente");
          navigate("/admin/products");
        })
        .catch((error) => {
          alert("Error al registrar el producto: " + error);
        });
    }
  };

  return (
    <StyledCreateProduct>
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
        {errors.description && <ErrorText>{errors.description}</ErrorText>}
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
        <input
          type="number"
          required
          name="stock"
          placeholder="Stock"
          value={dataProducts.stock ?? ""}
          onChange={handleChange}
          min="0"
          step="1"
        />
        {errors.stock && <ErrorText>{errors.stock}</ErrorText>}

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
        {errors.categoria_id && <ErrorText>{errors.categoria_id}</ErrorText>}

        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

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

const StyledCreateProduct = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.8rem;
`;
