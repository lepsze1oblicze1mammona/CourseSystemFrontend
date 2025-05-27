import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth;