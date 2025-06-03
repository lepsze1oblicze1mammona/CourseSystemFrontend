import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./Auth";

function RequireAuth() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth;
