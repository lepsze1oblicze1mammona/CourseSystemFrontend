// Components/Course/CourseTile.tsx
import React from "react";

interface CourseTileProps {
  courseName: string;
  onClick?: () => void;
}

const CourseTile: React.FC<CourseTileProps> = ({ courseName, onClick }) => {
  return (
    <div 
      style={{
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        transition: "transform 0.2s",
        minHeight: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
      onClick={onClick}
    >
      <h3>{courseName}</h3>
    </div>
  );
};

export default CourseTile;
