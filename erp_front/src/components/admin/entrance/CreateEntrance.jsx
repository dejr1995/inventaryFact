import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../../styles/CommonStyled";
import { useNavigate } from "react-router-dom";
import { productsAllFetch } from "../../../store/slices/ProductSlice";
import { providersAllFetch } from "../../../store/slices/ProviderSlice";
import { entranceEntryCreate } from "../../../store/slices/EntranceSlice";

const CreateEntrance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: products } = useSelector((state) => state.products);
  const { list: providers } = useSelector((state) => state.providers);

  const [dataEntry, setDataEntry] = useState({
    productId: "",
    providerId: "",
    quantity: "",
    precio_compra: "",
  });

  const [errors, setErrors] = useState({});

  const validationRules = {
    producto_id: (value) => (!value ? "Debe seleccionar un producto" : ""),
    proveedor_id: (value) => (!value ? "Debe seleccionar un proveedor" : ""),
    stock_entrada: (value) =>
      !value || isNaN(value) || Number(value) <= 0 ? "Cantidad inválida" : "",
    precio_compra: (value) =>
      !value || isNaN(value) || Number(value) <= 0
        ? "Precio de compra inválido"
        : "",
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
    setDataEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataEntry).every((field) =>
      validateField(field, dataEntry[field])
    );

    if (isValid) {
      dispatch(
        entranceEntryCreate({
          productId: dataEntry.productId,
          providerId: dataEntry.providerId,
          quantity: Number(dataEntry.quantity),
          precio_compra: Number(dataEntry.precio_compra),
        })
      )
        .unwrap()
        .then(() => {
          alert("Entrada registrada correctamente");
          navigate("/admin/entrances");
        })
        .catch((error) => {
          alert("Error al registrar la entrada: " + error);
        });
    }
  };

  useEffect(() => {
    if (products.length === 0) dispatch(productsAllFetch());
    if (providers.length === 0) dispatch(providersAllFetch());
  }, [dispatch, products.length, providers.length]);

  return (
    <StyledCreateEntry>
      <StyledForm onSubmit={handleSubmit}>
        <label>Producto:</label>
        <select
          name="productId"
          value={dataEntry.productId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Seleccione un producto
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nombre}
            </option>
          ))}
        </select>
        {errors.productId && <ErrorText>{errors.productId}</ErrorText>}

        <label>Proveedor:</label>
        <select
          name="providerId"
          value={dataEntry.providerId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Seleccione un proveedor
          </option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.nombre}
            </option>
          ))}
        </select>
        {errors.providerId && <ErrorText>{errors.providerId}</ErrorText>}

        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={dataEntry.quantity}
          onChange={handleChange}
          min="0"
          step="1"
          required
        />
        {errors.quantity && <ErrorText>{errors.quantity}</ErrorText>}

        <input
          type="number"
          name="precio_compra"
          placeholder="Precio de compra"
          value={dataEntry.precio_compra}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
        {errors.precio_compra && <ErrorText>{errors.precio_compra}</ErrorText>}

        <PrimaryButton type="submit">Registrar Entrada</PrimaryButton>
      </StyledForm>
    </StyledCreateEntry>
  );
};

export default CreateEntrance;

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

const StyledCreateEntry = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.8rem;
`;
