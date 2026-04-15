import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ChatDashboard from './pages/ChatDashboard';

function App() {
  // Simple check for your JWT
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Route - Redirects to login if no token */}
        <Route 
          path="/chat" 
          element={isAuthenticated ? <ChatDashboard /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;