import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ChatDashboard from './pages/ChatDashboard';

function App() {

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

    
        <Route 
          path="/chat" 
          element={isAuthenticated ? <ChatDashboard /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;