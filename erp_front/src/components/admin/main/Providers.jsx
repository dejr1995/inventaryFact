import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "../../styles/CommonStyled";
import { useState } from "react";

const Providers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreating = location.pathname === "/admin/providers/create-provider";

  const [status] = useState("idle");

  const handleCreateClick = () => {
    navigate("/admin/providers/create-provider");
  };

  const handleCancelClick = () => {
    navigate("/admin/providers");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      <AdminHeaders>
        Proveedores
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

export default Providers;
