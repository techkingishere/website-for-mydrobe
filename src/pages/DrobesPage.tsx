import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  deleteDoc,
  doc,
  orderBy, // Import orderBy
  Timestamp // Import Timestamp
} from "firebase/firestore"; // Firestore imports
import { db } from '../firebaseConfig'; // Import db instance
import { useAuth } from '../context/AuthContext'; // Import useAuth
import CreateDrobeModal from '../components/CreateDrobeModal'; // Import the modal
import './DrobesPage.css'; // We'll create this CSS file next

// Define Drobe type
interface Drobe {
  id: string; // Firestore IDs are strings
  userId: string; // Store user ID
  title: string;
  subtitle: string;
  images: string[];
  createdAt: Timestamp; // Use Firestore Timestamp type
}

// Placeholder Search Icon
const SearchIcon = () => (
  <svg aria-label="Search" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
    <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);

// Plus Icon for Header Button
const PlusIconHeader = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="6" x2="12" y2="18"></line>
    <line x1="6" y1="12" x2="18" y2="12"></line>
  </svg>
);

// Minus Icon for Header Button
const MinusIconHeader = () => (
   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="18" y2="12"></line>
  </svg>
);

// Delete Icon for Drobe Item
const DeleteIconItem = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const DrobesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [drobes, setDrobes] = useState<Drobe[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { currentUser } = useAuth(); // Get current user

  // Fetch Drobes from Firestore
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      setDrobes([]); // Clear drobes if user logs out
      return; // Don't fetch if no user
    }

    setIsLoading(true);
    const drobesCollection = collection(db, "drobes");
    // Query for drobes belonging to the current user, order by creation time
    const q = query(
      drobesCollection, 
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc") // Order newest first
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userDrobes: Drobe[] = [];
      querySnapshot.forEach((doc) => {
        userDrobes.push({ id: doc.id, ...doc.data() } as Drobe);
      });
      setDrobes(userDrobes);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching drobes: ", error);
      setIsLoading(false); // Stop loading even on error
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]); // Re-run effect if user changes

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setIsDeleteMode(false); // Deactivate delete mode when opening create modal
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Function to handle adding a new drobe
  const handleCreateDrobe = async (title: string) => {
    if (!currentUser) return; // Guard clause

    const newDrobeData = {
      userId: currentUser.uid,
      title: title,
      subtitle: '0 Items · Just now',
      images: [],
      createdAt: Timestamp.now() // Use server timestamp
    };
    try {
      const docRef = await addDoc(collection(db, "drobes"), newDrobeData);
      console.log("Drobe added with ID: ", docRef.id);
      // No need to call setDrobes, onSnapshot will update the state
    } catch (e) {
      console.error("Error adding drobe: ", e);
    }
  };

  // Function to toggle delete mode
  const toggleDeleteMode = () => {
    setIsDeleteMode(prevMode => !prevMode);
  };

  // Function to handle deleting a drobe
  const handleDeleteDrobe = async (idToDelete: string) => {
    if (!currentUser) return; // Guard clause
    try {
      await deleteDoc(doc(db, "drobes", idToDelete));
      console.log("Drobe deleted with ID: ", idToDelete);
       // No need to call setDrobes, onSnapshot will update the state
       // If it was the last one, exit delete mode?
       // if (drobes.length === 1) setIsDeleteMode(false); // Can cause race conditions, maybe remove
    } catch (e) {
      console.error("Error deleting drobe: ", e);
    }
  };

  return (
    <div className="drobes-page">
      {/* Top Search Bar Area */}
      <div className="drobes-header">
        <div className="drobes-search-bar">
          <SearchIcon />
          <input type="text" placeholder="Search your ideas" />
        </div>
        {/* Add + / - buttons */}
        <div className="drobe-action-buttons">
          <button onClick={openCreateModal} className="drobe-action-btn add-btn" aria-label="Create Drobe">
            <PlusIconHeader />
          </button>
          {/* Minus button toggles delete mode */}
          <button 
            onClick={toggleDeleteMode} 
            className={`drobe-action-btn filter-btn ${isDeleteMode ? 'active' : ''}`} 
            aria-label={isDeleteMode ? 'Done Deleting' : 'Enable Deleting'}
          >
            <MinusIconHeader />
          </button>
        </div>
      </div>

      {/* Drobes Grid or Placeholder (only show if NOT loading) */}
      {!isLoading && drobes.length > 0 ? (
        <div className="drobes-grid">
          {drobes.map((drobe) => (
            <div key={drobe.id} className="drobe-item">
              {/* Conditionally render delete button */}
              {isDeleteMode && (
                <button 
                  className="drobe-delete-btn" 
                  onClick={() => handleDeleteDrobe(drobe.id)}
                  aria-label={`Delete drobe ${drobe.title}`}
                >
                  <DeleteIconItem />
                </button>
              )}
              {/* Drobe item content (image preview, info) */}
              <div className="drobe-image-preview">
                <div className="drobe-image-placeholder rect-left"></div>
                <div className="drobe-image-placeholder square-top-right"></div>
                <div className="drobe-image-placeholder square-bottom-right"></div>
              </div>
              <div className="drobe-info">
                <h3>{drobe.title}</h3>
                <p>{drobe.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div className="no-drobes-placeholder">
          You can create your first drobe by clicking the plus button at the top
        </div>
      ) : null} {/* Render nothing else while loading */}

      {/* Render the modal conditionally with onCreate */}
      <CreateDrobeModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
        onCreate={handleCreateDrobe} // Pass the creation handler
      />
    </div>
  );
};

export default DrobesPage; 
 
 
 
 
 
 
 
 