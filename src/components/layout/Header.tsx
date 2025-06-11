import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Menu, X, ChevronDown, CreditCard, HelpCircle, Crown, Shield, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      setShowMenu(false);
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Redirect authenticated users away from auth pages
  React.useEffect(() => {
    if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Get subscription tier info for badge
  const getSubscriptionBadge = (tier: string = 'free') => {
    switch (tier) {
      case 'premium':
        return {
          icon: <Shield className="h-3 w-3" />,
          text: 'Premium',
          bgColor: 'bg-blue-500',
          textColor: 'text-white'
        };
      case 'gold':
        return {
          icon: <Crown className="h-3 w-3" />,
          text: 'Gold',
          bgColor: 'bg-yellow-500',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Star className="h-3 w-3" />,
          text: 'Free',
          bgColor: 'bg-gray-500',
          textColor: 'text-white'
        };
    }
  };

  const subscriptionBadge = getSubscriptionBadge(currentUser?.subscription_tier);

  return (
    <header className="bg-gradient-to-br from-primary-600 to-accent-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center group">
              <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img 
                    src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" 
                    alt="Digital Legacy Diary"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      // Fallback to text logo if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-2xl font-serif font-bold text-white">D</span>';
                      }
                    }}
                  />
                </div>
                <span className="ml-2 text-xl font-serif font-semibold text-white">Digital Legacy Diary</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="text-white hover:text-gray-200 transition-colors">
                    Dashboard
                  </Link>
                  
                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors focus:outline-none"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                        {currentUser.profilePicture ? (
                          <img 
                            src={currentUser.profilePicture} 
                            alt={currentUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        
                        {/* Subscription Badge */}
                        <div className={`absolute -bottom-1 -right-1 ${subscriptionBadge.bgColor} ${subscriptionBadge.textColor} rounded-full px-1 py-0.5 text-xs font-medium flex items-center gap-1 shadow-lg border border-white`}>
                          {subscriptionBadge.icon}
                          <span className="hidden sm:inline text-xs">{subscriptionBadge.text}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{currentUser.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </div>
                        </Link>
                        <Link
                          to="/subscription"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Subscription
                          </div>
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/about" className="text-white hover:text-gray-200 transition-colors">
                    About
                  </Link>
                  <Link to="/how-it-works" className="text-white hover:text-gray-200 transition-colors">
                    How It Works
                  </Link>
                  <Link to="/contact" className="text-white hover:text-gray-200 transition-colors">
                    Contact
                  </Link>
                  <Link to="/login" className="text-white hover:text-gray-200 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="bg-white text-red-600 font-bold hover:bg-white hover:text-red-600"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 rounded-md text-white hover:text-gray-200 hover:bg-white/10 transition-colors focus:outline-none"
            >
              {showMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden animate-fade-in z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed inset-x-0 top-16 md:hidden bg-white shadow-lg rounded-b-lg animate-slide-down z-50">
            <nav className="px-4 pt-2 pb-3 space-y-2">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-100">
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg font-medium text-primary-600">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Subscription Badge */}
                      <div className={`absolute -bottom-1 -right-1 ${subscriptionBadge.bgColor} ${subscriptionBadge.textColor} rounded-full px-1.5 py-0.5 text-xs font-medium flex items-center gap-1 shadow-lg border-2 border-white`}>
                        {subscriptionBadge.icon}
                        <span>{subscriptionBadge.text}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-sm text-gray-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/subscription"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Subscription
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Log Out
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;