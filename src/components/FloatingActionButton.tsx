import React from 'react';
import './FloatingActionButton.css';

// Simple Plus Icon
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Define Props interface
interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  // Use the onClick prop passed from the parent
  return (
    <button className="fab" onClick={onClick} aria-label="Create Post">
      <PlusIcon />
    </button>
  );
};

export default FloatingActionButton; 
 
 
 
 
 
 
 
 