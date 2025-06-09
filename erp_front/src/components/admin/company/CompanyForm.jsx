import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createOrUpdateCompany,
  fetchCompany,
} from "../../../store/slices/CompanySlice";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "../../styles/CommonStyled";

const CompanyForm = () => {
  const dispatch = useDispatch();
  const {
    data: company,
    status,
    error,
  } = useSelector((state) => state.company);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    razon_social: "",
    numero_ruc: "",
    domicilio_fiscal: "",
    datos_contacto: "",
  });

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setFormData({
        razon_social: company.razon_social,
        numero_ruc: company.numero_ruc,
        domicilio_fiscal: company.domicilio_fiscal,
        datos_contacto: company.datos_contacto,
      });
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createOrUpdateCompany(formData));
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchCompany());
      setEditMode(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (status === "loading") return <p>Cargando datos de la empresa...</p>;

  return (
    <StyledCreateProduct className="company-form">
      {!company ? (
        <div className="create-company">
          <StyledForm onSubmit={handleSubmit}>
            <SubTitle>Registrar Nueva Empresa</SubTitle>
            <FormGroup>
              <label>Razón Social:</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>RUC:</label>
              <input
                type="text"
                name="numero_ruc"
                value={formData.numero_ruc}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Domicilio Fiscal:</label>
              <input
                type="text"
                name="domicilio_fiscal"
                value={formData.domicilio_fiscal}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Datos de Contacto:</label>
              <input
                name="datos_contacto"
                value={formData.datos_contacto}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <PrimaryButton type="submit" className="btn-primary">
              Crear Empresa
            </PrimaryButton>
          </StyledForm>
        </div>
      ) : editMode ? (
        <div className="edit-company">
          <StyledForm onSubmit={handleSubmit}>
            <SubTitle>Editar Datos de la Empresa</SubTitle>
            <FormGroup>
              <label>Razón Social:</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>RUC:</label>
              <input
                type="text"
                name="numero_ruc"
                value={formData.numero_ruc}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Domicilio Fiscal:</label>
              <input
                type="text"
                name="domicilio_fiscal"
                value={formData.domicilio_fiscal}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Datos de Contacto:</label>
              <input
                name="datos_contacto"
                value={formData.datos_contacto}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <PrimaryButton type="submit">Guardar Cambios</PrimaryButton>
              <SecondaryButton type="button" onClick={() => setEditMode(false)}>
                Cancelar
              </SecondaryButton>
            </div>
          </StyledForm>
        </div>
      ) : (
        <div className="company-info">
          <SubTitle>Datos de la Empresa</SubTitle>
          <p>
            <strong>Razón Social:</strong> {company.razon_social}
          </p>
          <p>
            <strong>RUC:</strong> {company.numero_ruc}
          </p>
          <p>
            <strong>Domicilio Fiscal:</strong> {company.domicilio_fiscal}
          </p>
          <p>
            <strong>Contacto:</strong> {company.datos_contacto}
          </p>
          <PrimaryButton className="btn-edit" onClick={() => setEditMode(true)}>
            Editar
          </PrimaryButton>
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginTop: "1rem" }}
        >
          <p>¡Error!</p>
          <p>{error}</p>
        </div>
      )}
    </StyledCreateProduct>
  );
};

export default CompanyForm;

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
  height: 460px;
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
