import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "../../styles/CommonStyled";
import { useState } from "react";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreating = location.pathname === "/admin/users/create-user";

  const [status, setStatus] = useState("idle");

  const handleCreateClick = () => {
    navigate("/admin/users/create-user");
  };

  const handleCancelClick = () => {
    navigate("/admin/users");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      <AdminHeaders>
        Usuarios
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

export default Users;
