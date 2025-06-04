import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import do przekierowania
import { getRole, getToken } from "../Auth/Auth";
import StudentDashboard from "./Student/StudentDashboard";
import TeacherDashboard from "./Teacher/TeacherDashboard";

function AppLayout() {
  const role = getRole();
  const token = getToken();

  console.log("Token:", token);
  console.log("Rola:", role);

  if (role === "teacher") return <TeacherDashboard />;
  if (role === "student") return <StudentDashboard />;
  return <div>Nieznana rola</div>;
}

export default AppLayout;