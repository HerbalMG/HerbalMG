import React, { useState, useEffect } from 'react'
import AppRoutes from './route/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  // Listen for login/logout in other tabs
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Provide a callback to LoginPage to update auth state after login
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <>
          <Sidebar />
          <div className="ml-60 overflow-x-hidden min-h-screen">
            <Navbar onLogout={handleLogout} />
            <main className="p-3">
              <AppRoutes onLogin={handleLogin} />
            </main>
          </div>
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </BrowserRouter>
  )
}

export default App