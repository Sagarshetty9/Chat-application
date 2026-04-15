import { useEffect, useState } from 'react';
import axios from 'axios';

const Sidebar = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);

  // Fetch all users from your MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        // Filter out the logged-in user so you don't chat with yourself
        const filtered = res.data.filter(u => u._id !== currentUser.id);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 flex flex-col">
      {/* Header with Current User Info */}
      <div className="p-4 bg-primary text-primary-content flex items-center justify-between">
        <div className="font-bold">@{currentUser.username}</div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="btn btn-xs btn-outline btn-ghost"
        >
          Logout
        </button>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 text-xs font-bold opacity-50 uppercase tracking-widest">Contacts</div>
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user._id} 
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors border-b border-base-200/50"
            >
              <div className="avatar">
                <div className="rounded-full w-10 overflow-hidden">
                  <img src={'avtar.jpg'} alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="font-medium text-sm">{user.username}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm opacity-50">No users found...</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;