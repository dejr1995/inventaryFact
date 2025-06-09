import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../../styles/CommonStyled";
import { providersEdit } from "../../../store/slices/ProviderSlice";

const EditProvider = ({ providerId }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { list, editStatus } = useSelector((state) => state.providers);

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

  const handleClickOpen = () => setOpen(true);

  useEffect(() => {
    if (open && providerId) {
      const selectedProvider = list.find((item) => item.id === providerId);
      if (selectedProvider) {
        setDataProviders({
          name: selectedProvider.nombre,
          email: selectedProvider.email,
          phone: selectedProvider.telefono,
          address: selectedProvider.direccion,
        });
        setErrors({});
      }
    }
  }, [open, providerId, list]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataProviders).every((field) =>
      validateField(field, dataProviders[field])
    );

    if (isValid) {
      dispatch(providersEdit({ id: providerId, ...dataProviders }));
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
          Actualizar Datos de Proveedor
        </DialogTitle>
        <DialogContent>
          <StyledEditProduct>
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
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
              <input
                type="text"
                required
                name="phone"
                placeholder="Telefono"
                value={dataProviders.phone}
                onChange={handleChange}
              />
              {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              <input
                type="text"
                required
                name="address"
                placeholder="Direccion"
                value={dataProviders.address}
                onChange={handleChange}
              />
              {errors.address && <ErrorText>{errors.address}</ErrorText>}
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

export default EditProvider;

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
