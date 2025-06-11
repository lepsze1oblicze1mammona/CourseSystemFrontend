import { Routes, Route } from 'react-router-dom';
import RequireRole from "../Auth/RequireRole";
import Login from '../Components/Login';
import Register from '../Components/Register';
import AppLayout from '../Components/AppLayout';
import RequireAuth from '../Auth/RequireAuth';
import Students from '../Components/Course/Students';
import AddStudent from '../Components/Course/AddStudent';
import RemoveStudent from '../Components/Course/RemoveStudent';
import RenameCourse from '../Components/Teacher/RenameCourse';
import RemoveCourse from '../Components/Teacher/RemoveCourse';
import AddAssignment from '../Components/Course/AddAssignment';
import RemoveAssignment from '../Components/Course/RemoveAssignment';
import AssignmentsList from '../Components/Course/AssignmentsList';
import TeacherDashboard from '../Components/Teacher/TeacherDashboard';
import AddCourse from '../Components/Teacher/AddCourse';
import StudentDashboard from '../Components/Student/StudentDashboard';
import SubmitAssignment from '../Components/Student/SubmitAssignment';
import CourseDetailsWrapper from '../Components/Course/CourseDetailsWrapper';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<AppLayout />} />
        
        {/* Kursy - wspólne wejście */}
        <Route path="courses/:courseId" element={<CourseDetailsWrapper />}>
          <Route index element={<AssignmentsList />} />
          
          {/* Tylko nauczyciel */}
          <Route element={<RequireRole allowedRoles={["teacher"]} />}>
            <Route path="students" element={<Students />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="remove-student" element={<RemoveStudent />} />
            <Route path="add-assignment" element={<AddAssignment />} />
            <Route path="remove-assignment" element={<RemoveAssignment />} />
          </Route>
        </Route>

        {/* Panel nauczyciela */}
        <Route element={<RequireRole allowedRoles={["teacher"]} />}>
          <Route path="teacher" element={<TeacherDashboard />}>
            <Route path="add-course" element={<AddCourse />} />
            <Route path="remove-course" element={<RemoveCourse />} />
            <Route path="rename-course" element={<RenameCourse />} />
          </Route>
        </Route>

        {/* Panel ucznia */}
        <Route element={<RequireRole allowedRoles={["student"]} />}>
          <Route path="student" element={<StudentDashboard />} />
          <Route path="courses/:courseId/submit/:assignmentId" element={<SubmitAssignment />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
