import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetRegisterStatus,
} from "../../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registerStatus, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
    };

    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        alert("Usuario registrado correctamente");
        dispatch(resetRegisterStatus());
        navigate("/admin/users");
      })
      .catch((error) => {
        alert("Error al registrar el usuario: " + error);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={registerStatus === "loading"}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {registerStatus === "loading" ? "Registrando..." : "Registrarse"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>Error: {error}</div>
        )}

        {registerStatus === "succeeded" && (
          <div style={{ color: "green", marginTop: "1rem" }}>
            ¡Registro exitoso! Revisa tu email para más instrucciones.
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
