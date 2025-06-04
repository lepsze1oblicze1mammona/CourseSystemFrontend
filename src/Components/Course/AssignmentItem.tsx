interface AssignmentItemProps {
  title: string;
  description: string;
  deadline?: string;
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({ 
  title, 
  description,
  deadline 
}) => {
  return (
    <div className="assignment-item">
      <h4>{title}</h4>
      <p>{description}</p>
      {deadline && <small>Termin: {deadline}</small>}
    </div>
  );
};

export default AssignmentItem;
