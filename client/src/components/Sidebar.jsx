import { useEffect, useState } from 'react';
import axios from 'axios';
import avatar from '../assets/avtar.jpg'

const Sidebar = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);

  // Fetch all users from your MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getContacts`);
        // Filter out the logged-in user
        const filtered = res.data.filter(u => u._id !== currentUser.id);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  return (
  <div className="w-full md:w-80 bg-base-100 border-r border-base-300 shadow-lg flex flex-col">
  {/* Header */}
  <div className="p-5 border-b border-base-300 bg-base-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-base-content/50">
          Logged in as
        </p>
        <h2 className="text-lg font-bold">@{currentUser.username}</h2>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="btn btn-sm btn-error btn-outline"
      >
        Logout
      </button>
    </div>
  </div>

  {/* Contacts */}
  <div className="px-5 py-3 border-b border-base-300">
    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 font-semibold">
      Contacts
    </p>
  </div>

  {/* User List */}
  <div className="flex-1 overflow-y-auto">
    {users.length > 0 ? (
      users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-primary hover:text-primary-content transition-all duration-200"
        >
          <div className="avatar">
            <div className="w-11 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img
                src={avatar}
                alt="avatar"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">{user.username}</span>
            <span className="text-xs opacity-60">Click to chat</span>
          </div>
        </div>
      ))
    ) : (
      <div className="flex items-center justify-center h-32 text-sm opacity-50">
        No users found
      </div>
    )}
  </div>
</div>
  );
};

export default Sidebar;