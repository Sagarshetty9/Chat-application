import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await axios.post(`https://chat-application-626w.onrender.com/api/users/${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/chat'); // Redirect to dashboard
      } else {
        alert("Registration Successful! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-primary/10">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary text-primary-content rounded-2xl flex items-center justify-center text-3xl font-bold mb-2">
              🗪
            </div>
            <h2 className="text-2xl font-bold">{isLogin ? "Welcome Back!" : "Create Account"}</h2>
            <p className="text-sm opacity-60">Enter your details to access the chat</p>
          </div>

          <form onSubmit={handleAction} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text mx-1">Username</span></label>
              <input 
                type="text" 
                placeholder="Enter Username" 
                className="input input-bordered focus:input-primary" 
                required 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text mx-1">Password</span></label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered focus:input-primary" 
                required 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button className={`btn btn-primary w-full mt-4 ${loading ? 'loading' : ''}`}>
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span 
              className="text-primary font-bold cursor-pointer ml-1 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register Now" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;