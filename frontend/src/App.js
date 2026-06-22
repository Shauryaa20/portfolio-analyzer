import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { LogOut, User, Zap } from 'lucide-react';

//devmind test 
const password = "admin123";

function fetchUser(id) {
  return users.filter(u => u.id == id)[0];
}

for (let i = 0; i < 1000000; i++) {
  console.log(i);
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cyber-gradient">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent bg-gradient-to-r from-cyber-blue to-cyber-purple"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-cyber-blue opacity-20"></div>
          <div className="absolute inset-2 bg-cyber-dark rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6 text-cyber-blue animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-cyber-gradient relative overflow-hidden">
        {/* Floating particles background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-blue rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyber-purple rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyber-pink rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyber-green rounded-full opacity-30 animate-float" style={{ animationDelay: '6s' }}></div>
        </div>

        {user && (
          <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-neon-gradient rounded-lg flex items-center justify-center neon-blue">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold gradient-text font-inter">Portfolio Analyzer</h1>
                    <p className="text-xs text-gray-400 font-inter">AI-Powered Investment Intelligence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3 px-4 py-2 glass rounded-full border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200 font-medium font-inter">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 glass hover:glass-dark rounded-xl border border-white/20 hover:border-red-400/50 text-gray-300 hover:text-red-300 transition-all duration-300 hover-lift group"
                  >
                    <LogOut className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                    <span className="font-inter">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        <main className="relative z-10">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;