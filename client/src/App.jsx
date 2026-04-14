import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GlowCursor from './components/GlowCursor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// A wrapper component to hide sidebar on login
const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login';

    return (
        <div className="relative flex min-h-screen overflow-hidden">
            {!isAuthPage && <Sidebar />}
            <main className={`relative z-10 flex-1 ${!isAuthPage ? 'pl-32' : ''} pr-8 py-10`}>
                {children}
            </main>
        </div>
    );
};

function App() {
  return (
    <Router>
        <GlowCursor />
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Login />} /> {/* Default to Login for now */}
            </Routes>
        </Layout>
    </Router>
  );
}

export default App;