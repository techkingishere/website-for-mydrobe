import React from 'react';
import { Chat } from '../pages/MessagesPage'; // Assuming Chat type is exported from MessagesPage
import './ChatList.css'; // CSS for styling

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  username: string; // Add username prop
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat, username }) => {
  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <div className="username-dropdown"> {/* Optional: Add dropdown later */} 
          <h2>{username}</h2>
          {/* Add dropdown arrow icon later */}
        </div>
        <button className="new-chat-btn">✏️</button> 
      </div>
      {/* Add Tabs Section */}
      <div className="chat-list-tabs">
        <button className="tab-btn active">Primary</button>
        <button className="tab-btn">General</button>
        <button className="tab-btn requests">Requests <span>(9+)</span></button> 
      </div>
      <div className="chat-list-items">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === selectedChatId ? 'selected' : ''} ${chat.unread ? 'unread' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <img src={chat.avatarUrl || 'https://via.placeholder.com/50/CCCCCC/FFFFFF?text=?'} alt={`${chat.name} avatar`} className="avatar" />
            <div className="chat-info">
              <p className="chat-name">{chat.name}</p>
              <p className="last-message">{chat.lastMessage}</p>
            </div>
            <span className="timestamp">{chat.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 
 
 
 
 
 
 
 
 