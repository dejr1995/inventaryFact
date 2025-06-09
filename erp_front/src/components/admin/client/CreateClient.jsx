import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PrimaryButton } from "../../styles/CommonStyled";
import { useNavigate } from "react-router-dom";
import { clientsCreate } from "../../../store/slices/ClientSlice";

const CreateClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataClients, setDataClients] = useState({
    names: "",
    lastnames: "",
    dni: "",
    email: "",
    direction: "",
  });

  const [errors, setErrors] = useState({});

  const validationRules = {
    names: (value) => (!value.trim() ? "Nombres requeridos" : ""),
    lastnames: (value) => (!value.trim() ? "Apellidos requeridos" : ""),
    dni: (value) => (!value.trim() ? "DNI requerido" : ""),
    email: (value) => (!value.trim() ? "Email requerido" : ""),
    direction: (value) => (!value.trim() ? "Dirección requerida" : ""),
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
    setDataClients((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataClients).every((field) =>
      validateField(field, dataClients[field])
    );

    if (isValid) {
      dispatch(
        clientsCreate({
          ...dataClients,
          names: String(dataClients.names),
          lastnames: String(dataClients.lastnames),
          dni: String(dataClients.dni),
          email: String(dataClients.email),
          direction: String(dataClients.direction),
        })
      )
        .unwrap()
        .then(() => {
          alert("Cliente registrado correctamente");
          navigate("/admin/clients");
        })
        .catch((error) => {
          alert("Error al registrar el cliente: " + error);
        });
    }
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <input
          type="text"
          required
          name="names"
          placeholder="nombres"
          value={dataClients.names}
          onChange={handleChange}
        />
        {errors.names && <ErrorText>{errors.names}</ErrorText>}
        <input
          type="text"
          required
          name="lastnames"
          placeholder="apellidos"
          value={dataClients.lastnames}
          onChange={handleChange}
        />
        {errors.lastnames && <ErrorText>{errors.lastnames}</ErrorText>}
        <input
          type="text"
          required
          name="dni"
          placeholder="dni"
          value={dataClients.dni}
          onChange={handleChange}
        />
        {errors.dni && <ErrorText>{errors.dni}</ErrorText>}
        <input
          type="email"
          required
          name="email"
          placeholder="email"
          value={dataClients.email}
          onChange={handleChange}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
        <input
          type="text"
          required
          name="direction"
          placeholder="direccion"
          value={dataClients.direction}
          onChange={handleChange}
        />
        {errors.direction && <ErrorText>{errors.direction}</ErrorText>}
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateClient;

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
