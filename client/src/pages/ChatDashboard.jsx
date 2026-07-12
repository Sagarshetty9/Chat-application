import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import avatar from "../assets/avtar.jpg";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")),
  );
  const scrollRef = useRef();

  const [onlineUsers, setOnlineUsers] = useState([]);

  //  Tell backend who we are as soon as the component loads
  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("user_connected", currentUser.id);
    }
  }, [currentUser]);


  //Listen for incoming Messages, Statuses, Typing, and Presence updates
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const currentRoomID = activeChat
        ? [currentUser.id, activeChat._id].sort().join("_")
        : null;

      if (data.room === currentRoomID) {
        setMessages((prev) => [...prev, data]);

        // If we are actively viewing this chat, instantly mark their message as read
        if (data.sender !== currentUser.id) {
          socket.emit("mark_as_read", {
            room: currentRoomID,
            userId: currentUser.id,
          });
        }
      }
    });

    // 🟢 ADDED: Listen for when the other user reads your messages
    socket.on("messages_marked_read", ({ room }) => {
      const currentRoomID = activeChat
        ? [currentUser.id, activeChat._id].sort().join("_")
        : null;

      // If they read messages in our active room, update our local array to "read"
      if (room === currentRoomID) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === currentUser.id ? { ...msg, status: "read" } : msg,
          ),
        );
      }
    });

    socket.on("user_typing", () => {
      setIsTyping(true);
    });

    socket.on("user_stop_typing", () => {
      setIsTyping(false);
    });

    // Listen Online state
    socket.on("update_online_users", (usersList) => {
      setOnlineUsers(usersList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("messages_marked_read"); 
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("update_online_users");
    };
  }, [activeChat, currentUser.id]);


  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Logic to join room AND fetch history from MongoDB
  const handleSelectUser = async (targetUser) => {
    setActiveChat(targetUser);
    const roomID = [currentUser.id, targetUser._id].sort().join("_");

    

    // Tell backend we opened the chat and are reading messages
    socket.emit("mark_as_read", { room: roomID, userId: currentUser.id });


    socket.emit("join_room", roomID);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${roomID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages(res.data);
    } catch (err) {
      console.error("Error loading chat history:", err);
      setMessages([]);
    }
  };

  // Logic to send message (Saves to DB via Socket Controller)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const roomID = [currentUser.id, activeChat._id].sort().join("_");

    const messageData = {
      room: roomID,
      sender: currentUser.id,
      receiverId: activeChat._id,
      message: input,
    };

    // Emit to socket
    socket.emit("send_message", messageData);

    // Update local state
    const localMsg = {
      ...messageData,
      text: input,
      createdAt: new Date().toISOString(),
      status:
      onlineUsers.includes(activeChat._id)
      ? "delivered"
      : "sent",
    };

    setMessages((prev) => [...prev, localMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-base-200 overflow-hidden">
      {/* LEFT: SIDEBAR */}
      <Sidebar currentUser={currentUser} onSelectUser={handleSelectUser} onlineUsers={onlineUsers}/>

      {/* RIGHT: CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="navbar bg-base-100 border-b border-base-300 px-6 shadow-sm">
              <div className="flex-1 gap-3 items-center">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Wrapped the text container in a column layout */}
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-tight">
                    {activeChat.username}
                  </span>

                  {/*  on or off Indicatr */}
                  <span
                    className="text-xs font-semibold mt-0.5 transition-colors duration-200"
                    style={{
                      color: onlineUsers.includes(activeChat._id)
                        ? "#22c55e"
                        : "#9ca3af",
                    }}
                  >
                    {onlineUsers.includes(activeChat._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => {
                const isMyMessage = msg.sender === currentUser.id;

                return (
                  <div
                    key={i}
                    className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble shadow-md ${isMyMessage ? "chat-bubble-primary" : ""}`}
                    >
                      {msg.text || msg.message}

                      <div className="chat-footer opacity-70 text-[10px] mt-1 flex items-center justify-end gap-1 text-right">
                        <span>
                          {new Date(
                            msg.createdAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {/* 🟢 Real-time Read/Delivered status for your own messages */}
                        {isMyMessage && (
                          <span
                            className={`font-semibold transition-all duration-200 ${
                              msg.status === "read"
                                ? "text-info opacity-100"
                                : "opacity-50"
                            }`}
                          >
                            •{" "}
                            {msg.status === "read"
                              ? "Read"
                              : msg.status === "delivered"
                                ? "Delivered"
                                : "Sent"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
            {isTyping && (
              <div className="px-4 py-1 text-sm italic text-base-content/60">
                Typing...
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={sendMessage}
              className="p-4 bg-base-100 flex gap-2 border-t border-base-200"
            >
              <input
                type="text"
                value={input}
                placeholder={`Message @${activeChat.username}...`}
                className="input input-bordered flex-1 focus:outline-primary"
                onChange={(e) => {
                  setInput(e.target.value);
                  const roomID = [currentUser.id, activeChat._id]
                    .sort()
                    .join("_");
                  socket.emit("typing", roomID);
                  if (typingTimeout) clearTimeout(typingTimeout);

                  const timeout = setTimeout(() => {
                    socket.emit("stop_typing", roomID);
                    console.log("Emitted");
                  }, 1000);

                  setTypingTimeout(timeout);
                }}
              />

              <button type="submit" className="btn btn-primary px-8">
                Send
              </button>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <div className="text-center space-y-2 opacity-20">
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                No Active Chat
              </h2>
              <p className="text-sm">
                Select a user from the sidebar to begin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
