import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GlowCursor from './components/GlowCursor';
// Temporary placeholders for pages
const Landing = () => <div className="p-10 text-3xl font-bold">Landing Page</div>;
const Dashboard = () => <div className="p-10 text-3xl font-bold">Dashboard</div>;

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen bg-nature overflow-hidden selection:bg-royal selection:text-white">
        <GlowCursor />
        <Sidebar /> 
        
        <main className="relative z-10 flex-1 pl-32 pr-8 py-10 text-lavender">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;