const MessagesPage = () => {
    // TODO: Fetch real chats
    const chats = [
        { id: 1, avatar: 'https://via.placeholder.com/50x50/777/fff?text=U1', name: 'Fashionista123', lastMessage: 'Okay, sounds good! See you then.', timestamp: '1h', active: false },
        { id: 2, avatar: 'https://via.placeholder.com/50x50/888/fff?text=U2', name: 'StyleSeeker', lastMessage: 'Did you see that new drop?', timestamp: '3h', active: true },
        { id: 3, avatar: 'https://via.placeholder.com/50x50/999/fff?text=U3', name: 'VintageFinds', lastMessage: 'You sent an attachment.', timestamp: 'Yesterday', active: false },
    ];

    return (
        <div className="messages-container">
            <div className="messages-header">
                <h2>Messages</h2>
                <button className="action-btn new-message-icon">➕</button>
            </div>
            <div className="chat-list">
                {chats.map(chat => (
                    <div className={`chat-item ${chat.active ? 'active' : ''}`} key={chat.id}>
                        <img className="avatar" src={chat.avatar} alt={`${chat.name} Avatar`} />
                        <div className="chat-preview">
                            <p className="chat-name">{chat.name}</p>
                            <p className="last-message">{chat.lastMessage}</p>
                        </div>
                        <span className="timestamp">{chat.timestamp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default MessagesPage; 