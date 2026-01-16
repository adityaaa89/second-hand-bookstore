import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, isAuthenticated, logout } = useAuth();
  
  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'items', label: 'Browse Items' },
    ...(isAuthenticated ? [{ id: 'add-item', label: 'Sell Item' }] : []),
    ...(isAuthenticated && user?.role === 'ADMIN' ? [{ id: 'admin-analytics', label: 'Analytics' }] : []),
    ...(isAuthenticated && user?.role === 'ADMIN' ? [{ id: 'admin-items', label: 'Manage Items' }] : []),
    ...(isAuthenticated ? [] : [{ id: 'login', label: 'Login' }]),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-semibold text-primary">BookStore</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onNavigate(page.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
            
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.fullName}
                </span>
                <button
                  onClick={() => {
                    logout();
                    onNavigate('login');
                  }}
                  className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}