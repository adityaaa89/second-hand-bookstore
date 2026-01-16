import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ItemsPage } from './components/ItemsPage';
import { AddItemPage } from './components/AddItemPage';
import AdminAnalytics from './components/AdminAnalytics';
import AdminItemManagement from './components/AdminItemManagement';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'items':
        return <ItemsPage />;
      case 'add-item':
        return <AddItemPage />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      case 'admin-items':
        return <AdminItemManagement />;
      default:
        return isAuthenticated ? <HomePage onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleNavigate} />;
    }
  };

  // Auto-navigate to home if authenticated and on login page
  React.useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('home');
    } else if (!isAuthenticated && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg">📚</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}