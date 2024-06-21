import React from 'react';
import { Link } from 'react-router-dom';
import './Assignment.css';

export const Assignment = ({ assignment }) => {
  return (
    <div className="assignment">
      <Link to={`/assignment/${assignment.id}`}>
        <h4>{assignment.title}</h4>
        <p>{assignment.description}</p>
      </Link>
    </div>
  );
};
