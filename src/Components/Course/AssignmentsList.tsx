import React from "react";
import { useOutletContext } from "react-router-dom";
import AssignmentItem from "./AssignmentItem";

interface Assignment {
  id: number;
  nazwa: string;
  opis: string;
  termin_realizacji?: string;
}

interface OutletContext {
  assignments: Assignment[];
}

const AssignmentsList: React.FC = () => {
  const { assignments } = useOutletContext<OutletContext>();

  return (
    <div className="assignments-list">
      {assignments.map(assignment => (
        <AssignmentItem
          key={assignment.id}
          title={assignment.nazwa}
          description={assignment.opis}
          deadline={assignment.termin_realizacji}
        />
      ))}
    </div>
  );
};

export default AssignmentsList;
