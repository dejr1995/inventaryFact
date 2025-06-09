import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../../styles/CommonStyled";
import { clientsEdit } from "../../../store/slices/ClientSlice";

const EditClient = ({ clientId }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { list, editStatus } = useSelector((state) => state.clients);

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
    let processedValue = value;

    setDataClients((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    validateField(name, processedValue);
  };

  const handleClickOpen = () => setOpen(true);

  useEffect(() => {
    if (open && clientId) {
      const selectedClients = list.find((item) => item.id === clientId);
      if (selectedClients) {
        setDataClients({
          names: selectedClients.nombres,
          lastnames: selectedClients.apellidos,
          dni: selectedClients.dni,
          email: selectedClients.email,
          direction: selectedClients.direccion,
        });
        setErrors({});
      }
    }
  }, [open, clientId, list]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.keys(dataClients).every((field) =>
      validateField(field, dataClients[field])
    );

    if (isValid) {
      dispatch(clientsEdit({ id: clientId, ...dataClients }));
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
                name="names"
                placeholder="Nombres"
                value={dataClients.names}
                onChange={handleChange}
              />
              {errors.names && <ErrorText>{errors.names}</ErrorText>}
              <input
                type="text"
                required
                name="lastnames"
                placeholder="Apellidos"
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
                type="text"
                required
                name="email"
                placeholder="Email"
                value={dataClients.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
              <input
                type="text"
                required
                name="direction"
                placeholder="Direccion"
                value={dataClients.direction}
                onChange={handleChange}
              />
              {errors.direction && <ErrorText>{errors.direction}</ErrorText>}

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

export default EditClient;

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
