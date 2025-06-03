import { Routes, Route } from 'react-router-dom';
import Login from '../Components/Login';
import Register from '../Components/Register';
import AppLayout from '../Components/AppLayout';
import RequireAuth from '../Auth/RequireAuth';

function AppRoutes() {
    const isAuthenticated = false;
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<AppLayout />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;