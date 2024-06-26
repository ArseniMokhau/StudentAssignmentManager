import React from 'react';
import { Link } from 'react-router-dom';
import './Assignment.css';

export const Assignment = ({ assignment }) => {
  return (
    <div className="assignment">
      <h4>{assignment.title}</h4>
      <p>{assignment.description}</p>
      {/* 
      <p><strong>Deadline:</strong> {assignment.deadline}</p>
      */}
      <Link to={`/assignment/${assignment.id}`}>View Details</Link>
    </div>
  );
};
