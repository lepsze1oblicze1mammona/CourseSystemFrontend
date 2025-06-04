import React from "react";
import { useOutletContext } from "react-router-dom";
import AssignmentItem from "./AssignmentItem";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline?: string;
}
interface CourseContext {
  course: {
    assignments: Assignment[];
  };
}

const AssignmentsList: React.FC = () => {
  const { course } = useOutletContext<CourseContext>();

  return (
    <div className="assignments-list">
      {course.assignments.map(assignment => (
        <AssignmentItem
          key={assignment.id}
          title={assignment.title}
          description={assignment.description}
          deadline={assignment.deadline}
        />
      ))}
    </div>
  );
};

export default AssignmentsList;
