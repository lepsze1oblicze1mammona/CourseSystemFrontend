import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "./Auth";

interface RequireRoleProps {
  allowedRoles: string[];
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles }) => {
  const role = getRole();
  return role && allowedRoles.includes(role)
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

export default RequireRole;
