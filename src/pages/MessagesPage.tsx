import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './MessagesPage.css'; // Import the CSS file

// Define a type for chat data (adjust as needed)
export interface Chat {
  id: string;
  name: string;
  avatarUrl?: string; // Optional avatar
  lastMessage: string;
  timestamp: string;
  unread?: boolean; // Optional unread indicator
}

// Placeholder Message Icon (replace with actual SVG later)
const MessageIconPlaceholder = () => (
  <svg aria-label="Direct" color="#f5f5f5" fill="#f5f5f5" height="96" role="img" viewBox="0 0 96 96" width="96">
    <path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0zm0 88C25.94 88 8 70.06 8 48S25.94 8 48 8s40 17.94 40 40-17.94 40-40 40zm16.44-40.348L49.474 62.618a1.003 1.003 0 01-1.414.015L33.56 47.652A4 4 0 0136.42 41h23.16a4 4 0 012.86 6.652z"></path>
  </svg>
);

const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth(); // Get current user from context
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Get the display name, provide a fallback
  const username = currentUser?.displayName || 'User'; 

  // Dummy data for demonstration
  const dummyChats: Chat[] = [
    { id: '1', name: 'Alice Wonderland', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', avatarUrl: 'https://via.placeholder.com/50/FFA07A/000000?text=A' },
    { id: '2', name: 'Bob The Builder', lastMessage: 'Can we fix it?', timestamp: 'Yesterday', avatarUrl: 'https://via.placeholder.com/50/ADD8E6/000000?text=B', unread: true },
    { id: '3', name: 'Charlie Chaplin', lastMessage: '...', timestamp: 'Mon', avatarUrl: 'https://via.placeholder.com/50/808080/FFFFFF?text=C' },
    { id: '4', name: 'Diana Prince', lastMessage: 'Meeting at 2 PM.', timestamp: 'Sun', avatarUrl: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=D' },
  ];

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // TODO: Mark chat as read if needed
  };

  // Find the selected chat details (or provide default/empty state)
  const selectedChat = dummyChats.find(chat => chat.id === selectedChatId);

  // Function to handle "Send Message" button click (opens new chat modal - TBD)
  const handleNewMessage = () => {
    console.log('Open new message modal...');
    // TODO: Implement modal opening logic
  };

    return (
        <div className="messages-container">
      <div className="chat-list-panel">
        <ChatList chats={dummyChats} onSelectChat={handleSelectChat} selectedChatId={selectedChatId} username={username} />
            </div>
      <div className="chat-window-panel">
        {selectedChatId ? (
          <ChatWindow chat={selectedChat!} />
        ) : (
          <div className="chat-window-placeholder">
            <MessageIconPlaceholder />
            <h2>Your messages</h2>
            <p>Send private photos and messages to a friend or group.</p>
            <button onClick={handleNewMessage} className="send-message-btn">
              Send message
            </button>
                        </div>
        )}
            </div>
        </div>
    );
};

export default MessagesPage; 