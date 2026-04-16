import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

// Initialize socket outside the component to prevent multiple connections
const socket = io("https://chat-application-626w.onrender.com");

const ChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
  const scrollRef = useRef();

  // 1. Listen for incoming real-time messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Only add message to state if it belongs to the active chat room
      const currentRoomID = activeChat ? [currentUser.id, activeChat._id].sort().join("_") : null;
      if (data.room === currentRoomID) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [activeChat, currentUser.id]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Logic to join room AND fetch history from MongoDB
  const handleSelectUser = async (targetUser) => {
    setActiveChat(targetUser);
    const roomID = [currentUser.id, targetUser._id].sort().join("_");
    
    // Join the socket room for real-time updates
    socket.emit("join_room", roomID);

    try {
      // GET request to your new backend route for history
      const res = await axios.get(`https://chat-application-626w.onrender.com/api/messages/${roomID}`);
      setMessages(res.data); 
    } catch (err) {
      console.error("Error loading chat history:", err);
      setMessages([]); 
    }
  };

  // 4. Logic to send message (Saves to DB via Socket Controller)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const roomID = [currentUser.id, activeChat._id].sort().join("_");
    
    const messageData = {
      room: roomID,
      sender: currentUser.id,
      message: input, // 'message' matches your handleSocket controller logic
    };

    // Emit to socket (The controller handles the .save() to MongoDB)
    socket.emit("send_message", messageData);

    // Update local state instantly so the sender sees their own message
    const localMsg = {
      ...messageData,
      text: input, // Map input to 'text' to match your Schema
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, localMsg]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-base-300 overflow-hidden">
      {/* LEFT: SIDEBAR */}
      <Sidebar 
        currentUser={currentUser} 
        onSelectUser={handleSelectUser} 
      />

      {/* RIGHT: CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="navbar bg-base-100 border-b border-base-300 px-6 shadow-sm">
              <div className="flex-1 gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <img src={'avtar.jpg'} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-xl font-bold"> {activeChat.username}</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-">
              {messages.map((msg, i) => (
                <div key={i} className={`chat ${msg.sender === currentUser.id ? "chat-end" : "chat-start"}`}>
                  <div className={`chat-bubble shadow-md ${msg.sender === currentUser.id ? "chat-bubble-primary" : ""}`}>
                    {msg.text || msg.message}
                    <div className="chat-footer opacity-50 text-[10px] mt-1 text-right">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} /> 
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 bg-base-100 flex gap-2 border-t border-base-200">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message @${activeChat.username}...`} 
                className="input input-bordered flex-1 focus:outline-primary" 
              />
              <button type="submit" className="btn btn-primary px-8">Send</button>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <div className="text-center space-y-2 opacity-20">
              <h2 className="text-4xl font-black uppercase tracking-tighter">No Active Chat</h2>
              <p className="text-sm">Select a user from the sidebar to begin.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;