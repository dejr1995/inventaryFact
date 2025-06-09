import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { token, list: users } = useSelector((state) => state.auth);
  const location = useLocation();

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Obtener rol del usuario desde el estado de Redux
  const userRole = users[0]?.rol_nombre;

  // Validar roles si se especifican
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return (
      <Navigate to="/admin/unauthorized" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};
