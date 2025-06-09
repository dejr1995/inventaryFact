import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../../store/slices/AuthSlice";
import styled from "styled-components";
import { PrimaryButton } from "../../styles/CommonStyled";

const UpdateProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.list[0] || {});
  const { updateStatus, error } = useSelector((state) => state.auth);

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Precargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Crear payload solo con campos modificados
    const payload = {
      ...(formData.nombre !== user.nombre && { nombre: formData.nombre }),
      ...(formData.email !== user.email && { email: formData.email }),
      ...(formData.password && { password: formData.password }),
    };

    // Si no hay cambios
    if (Object.keys(payload).length === 0) {
      alert("No hay cambios para guardar");
      return;
    }

    dispatch(updateUserProfile(payload));
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <SubTitle>Actualizar Perfil</SubTitle>
        <FormGroup>
          <label>Administrador</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            readOnly
            disabled
          />
        </FormGroup>

        <FormGroup>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />
        </FormGroup>

        <FormGroup>
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la nueva contraseña"
          />
        </FormGroup>

        {error && <div>Error: {error}</div>}

        <PrimaryButton type="submit" disabled={updateStatus === "loading"}>
          {updateStatus === "loading" ? "Guardando..." : "Actualizar Perfil"}
        </PrimaryButton>

        {updateStatus === "succeeded" && (
          <div>¡Perfil actualizado exitosamente!</div>
        )}
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default UpdateProfileForm;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 350px;
  width: 100%;
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
  height: 560px;
  justify-content: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SubTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;
