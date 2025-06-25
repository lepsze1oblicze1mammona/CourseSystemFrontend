// Components/Course/CourseTile.tsx
import React from "react";

interface CourseTileProps {
  courseName: string;
  onClick?: () => void;
  className?: string; // <-- dodajemy obsługę klasy
}

const CourseTile: React.FC<CourseTileProps> = ({ courseName, onClick, className }) => {
  return (
    <div
      className={className ? className : "course-tile"}
      onClick={onClick}
    >
      <h3>{courseName}</h3>
    </div>
  );
};

export default CourseTile;
