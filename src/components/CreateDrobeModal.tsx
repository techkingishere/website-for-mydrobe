import React, { useState } from 'react';
import './CreateDrobeModal.css';

interface CreateDrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

// Simple Back Arrow Icon
const BackArrowIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
  </svg>
);

const CreateDrobeModal: React.FC<CreateDrobeModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (title.trim() === '') return; // Basic validation: Don't create if title is empty
    // TODO: Add more robust validation if needed
    
    onCreate(title); // Call the passed onCreate function with the title
    
    // Optional: Clear title and close after successful creation
    setTitle(''); 
    onClose(); 
  };

  // Add a way to reset title when modal opens/closes if needed
  React.useEffect(() => {
    if (!isOpen) {
      setTitle(''); // Reset title when modal closes
    }
  }, [isOpen]);

  if (!isOpen) {
    return null; // Don't render anything if modal is closed
  }

  return (
    <div className="create-drobe-modal-overlay" onClick={onClose}> {/* Close on overlay click */}
      <div className="create-drobe-modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */} 
        {/* Header */}
        <div className="create-drobe-modal-header">
          <button onClick={onClose} className="back-button" aria-label="Close">
            <BackArrowIcon />
          </button>
          <h2>Create Drobe</h2>
          {/* Optional: Add a placeholder or Done button if needed */}
          <div style={{ width: '24px' }}></div> {/* Spacer */}
        </div>

        {/* Body */}
        <div className="create-drobe-modal-body">
          <label htmlFor="drobeTitle">Title</label>
          <input 
            id="drobeTitle"
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title"
          />
          {/* Placeholder for adding items - can be developed later */}
          <div className="items-placeholder">
             {/* Content for adding/viewing items will go here */}
          </div>
        </div>

        {/* Footer */}
        <div className="create-drobe-modal-footer">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleCreate} className="create-btn create-drobe-confirm-btn">
            Create Drobe
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDrobeModal; 
 
 
 
 
 
 
 
 