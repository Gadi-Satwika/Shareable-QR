import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import GlowCursor from './components/GlowCursor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Layout = ({ children }) => {
    const location = useLocation();
    
    // Check if we are on the login page OR the root landing/login page
    const isAuthPage = location.pathname === '/login' || location.pathname === '/';

    return (
        <div className="relative flex min-h-screen overflow-hidden">
            {/* Sidebar only shows if we are NOT on an auth page */}
            {!isAuthPage && <Sidebar />}
            
            <main className={`relative z-10 flex-1 ${!isAuthPage ? 'pl-32' : ''} pr-8 py-10`}>
                {children}
            </main>
        </div>
    );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <Router>
        <GlowCursor />
        <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                  path="/dashboard" 
                  element={
                      <ProtectedRoute>
                          <Dashboard />
                      </ProtectedRoute>
                  } 
              />
              <Route path="/" element={localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Login />} />
            </Routes>
        </Layout>
    </Router>
  );
}

export default App;