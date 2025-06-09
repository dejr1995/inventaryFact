import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "../../styles/CommonStyled";
import { useState } from "react";

const Sales = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreating = location.pathname === "/admin/sales/create-sale";

  const [status, setStatus] = useState("idle");

  const handleCreateClick = () => {
    navigate("/admin/sales/create-sale");
  };

  const handleCancelClick = () => {
    navigate("/admin/sales");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      <AdminHeaders>
        Salidas
        {!isCreating ? (
          <PrimaryButton
            style={{ marginTop: "-10px", marginBottom: "10px" }}
            onClick={handleCreateClick}
          >
            Crear
          </PrimaryButton>
        ) : (
          <SecondaryButton onClick={handleCancelClick}>
            Regresar
          </SecondaryButton>
        )}
      </AdminHeaders>
      <Outlet />
    </>
  );
};

export default Sales;
