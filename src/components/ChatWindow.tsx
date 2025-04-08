import React from 'react';
import { Chat } from '../pages/MessagesPage'; // Assuming Chat type is exported
import './ChatWindow.css'; // CSS for styling

// Define Message type (adjust as needed)
interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  chat: Chat;
}

// Placeholder Icons
const PhoneIcon = () => <span>📞</span>;
const VideoIcon = () => <span>📹</span>;
const InfoIcon = () => <span>ℹ️</span>;
const EmojiIcon = () => <span>😊</span>;
const GalleryIcon = () => <span>🖼️</span>;
const LikeIcon = () => <span>❤️</span>;

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  // Dummy messages for the selected chat
  const dummyMessages: Message[] = [
    { id: 'm1', sender: 'them', text: `Hey! How are you doing? I saw your message about ${chat.name}.`, timestamp: '10:28 AM' },
    { id: 'm2', sender: 'me', text: "Hi! I'm good, thanks. Yeah, let's discuss.", timestamp: '10:29 AM' },
    { id: 'm3', sender: 'them', text: chat.lastMessage, timestamp: '10:30 AM' },
    // Add more messages...
  ];

  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <img src={chat.avatarUrl || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=?'} alt={`${chat.name} avatar`} className="avatar" />
        <h3>{chat.name}</h3>
        <div className="header-icons">
          <button className="icon-btn"><PhoneIcon /></button>
          <button className="icon-btn"><VideoIcon /></button>
          <button className="icon-btn"><InfoIcon /></button>
        </div>
      </div>
      <div className="message-list">
        {dummyMessages.map((message) => (
          <div key={message.id} className={`message-bubble ${message.sender}`}>
            <p>{message.text}</p>
            {/* <span className="message-timestamp">{message.timestamp}</span> */}
          </div>
        ))}
      </div>
      <div className="message-input-area">
        <button className="icon-btn"><EmojiIcon /></button> 
        <input type="text" placeholder="Message..." />
        <button className="icon-btn"><GalleryIcon /></button> 
        <button className="icon-btn"><LikeIcon /></button> 
      </div>
    </div>
  );
};

export default ChatWindow; 
 
 
 
 
 
 
 
 