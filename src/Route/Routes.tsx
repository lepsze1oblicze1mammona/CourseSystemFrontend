import { Routes, Route } from 'react-router-dom';
import Login from '../Components/Login';
import Register from '../Components/Register';
import AppLayout from '../Components/AppLayout';
import RequireAuth from '../Auth/RequireAuth';
import CourseDetails from '../Components/Course/CourseDetails';
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<AppLayout />} />
        <Route path="courses/:courseId" element={<CourseDetails />}>
          <Route index element={<AssignmentsList />} />
          <Route path="students" element={<Students />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="remove-student" element={<RemoveStudent />} />
          <Route path="add-assignment" element={<AddAssignment />} />
          <Route path="remove-assignment" element={<RemoveAssignment />} />
        </Route>
        <Route path="teacher" element={<TeacherDashboard />}>
          <Route path="add-course" element={<AddCourse />} />
          <Route path="remove-course" element={<RemoveCourse />} />
          <Route path="rename-course" element={<RenameCourse />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
