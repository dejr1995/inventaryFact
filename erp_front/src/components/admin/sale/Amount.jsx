import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { MdPaid } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../../styles/CommonStyled";
import { adjustTotal } from "../../../store/slices/SaleSlice";

const Amount = ({ amountId }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { adjustStatus } = useSelector((state) => state.sales);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setAmount("");
    setError("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!/^[0-9]+(\.[0-9]{0,2})?$/.test(value) && value !== "") {
      setError("Ingrese un número válido con hasta 2 decimales");
    } else {
      setError("");
      setAmount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("El importe debe ser mayor a 0");
      return;
    }
    dispatch(
      adjustTotal({ saleId: amountId, amountToSubtract: parseFloat(amount) })
    );
    handleClose();
  };

  return (
    <div>
      <Actions2>
        <MdPaid
          color="white"
          size={18}
          cursor="pointer"
          onClick={handleClickOpen}
        />
      </Actions2>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle style={{ textAlign: "center" }}>
          Actualizar Importe de Factura
        </DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <label htmlFor="amount">Ingrese el importe:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={handleChange}
                placeholder="Ingrese el importe"
                required
                min="0.01"
                step="0.01"
              />
              {error && <ErrorText>{error}</ErrorText>}
              <PrimaryButton
                type="submit"
                disabled={adjustStatus === "pending"}
              >
                {adjustStatus === "pending" ? "Actualizando..." : "Pagar"}
              </PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Amount;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;
    width: 100%;
    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
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
  &:hover {
    filter: brightness(90%);
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.8rem;
`;
