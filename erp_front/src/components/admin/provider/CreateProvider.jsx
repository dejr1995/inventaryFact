import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PrimaryButton } from "../../styles/CommonStyled";
import { providersCreate } from "../../../store/slices/ProviderSlice";
import { useNavigate } from "react-router-dom";

const CreateProvider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataProviders, setDataProviders] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const validationRules = {
    name: (value) => (!value.trim() ? "Nombre requerido" : ""),
    email: (value) => (!value.trim() ? "Descripción requerida" : ""),
    phone: (value) => (!value.trim() ? "Descripción requerida" : ""),
    address: (value) => (!value.trim() ? "Descripción requerida" : ""),
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
    setDataProviders((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataProviders).every((field) =>
      validateField(field, dataProviders[field])
    );

    if (isValid) {
      dispatch(
        providersCreate({
          ...dataProviders,
          name: String(dataProviders.name),
          email: String(dataProviders.email),
          phone: String(dataProviders.phone),
          address: String(dataProviders.address),
        })
      )
        .unwrap()
        .then(() => {
          alert("Proveedor registrado correctamente");
          navigate("/admin/providers");
        })
        .catch((error) => {
          alert("Error al registrar el proveedor: " + error);
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
          placeholder="Entidad"
          value={dataProviders.name}
          onChange={handleChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
        <input
          type="text"
          required
          name="email"
          placeholder="Email"
          value={dataProviders.email}
          onChange={handleChange}
        />
        {errors.description && <ErrorText>{errors.description}</ErrorText>}
        <input
          type="text"
          required
          name="phone"
          placeholder="Telefono"
          value={dataProviders.phone}
          onChange={handleChange}
        />
        {errors.price && <ErrorText>{errors.price}</ErrorText>}
        <input
          type="text"
          required
          name="address"
          placeholder="Direccion"
          value={dataProviders.address}
          onChange={handleChange}
        />
        {errors.stock && <ErrorText>{errors.stock}</ErrorText>}
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateProvider;

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
