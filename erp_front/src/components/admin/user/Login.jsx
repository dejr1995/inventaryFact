import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../store/slices/AuthSlice";
import styled from "styled-components";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (loginStatus === "succeeded") {
      navigate("/admin/sales");
    }
  }, [loginStatus, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email es requerido";
    if (!formData.password) errors.password = "Contraseña es requerida";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      dispatch(loginUser(formData));
    } else {
      setFormErrors(errors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  return (
    <StyledContainer>
      <h2>Iniciar Sesión</h2>
      <StyledForm onSubmit={handleSubmit}>
        <div>
          <StyledLabel>Email</StyledLabel>
          <StyledInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            hasError={formErrors.email}
          />
          {formErrors.email && <StyledError>{formErrors.email}</StyledError>}
        </div>

        <div>
          <StyledLabel>Contraseña</StyledLabel>
          <StyledInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            hasError={formErrors.password}
          />
          {formErrors.password && (
            <StyledError>{formErrors.password}</StyledError>
          )}
        </div>

        {error && <StyledMessage>{error}</StyledMessage>}

        <StyledButton type="submit" disabled={loginStatus === "loading"}>
          {loginStatus === "loading" ? "Procesando..." : "Ingresar"}
        </StyledButton>

        <p>
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </StyledForm>
    </StyledContainer>
  );
};

export default Login;

const StyledContainer = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Arial", sans-serif;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  text-align: left;
  display: block;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  padding: 12px;
  border: 1px solid ${({ hasError }) => (hasError ? "#e63946" : "#ccc")};
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease-in-out;
  &:focus {
    border-color: ${({ hasError }) => (hasError ? "#e63946" : "#007bff")};
    box-shadow: 0 0 5px ${({ hasError }) => (hasError ? "#e63946" : "#007bff")};
  }
`;

const StyledButton = styled.button`
  padding: 12px;
  background: ${({ disabled }) => (disabled ? "#ccc" : "#007bff")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease-in-out;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background: ${({ disabled }) => (disabled ? "#ccc" : "#0056b3")};
  }
`;

const StyledError = styled.p`
  color: #e63946;
  font-size: 14px;
  text-align: left;
  margin-top: 5px;
`;

const StyledMessage = styled.div`
  background: #ffe5e5;
  color: #e63946;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: bold;
`;
