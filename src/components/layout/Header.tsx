import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  BarChart3,
  History,
  Store,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
}

interface UserDropdownLink {
  Icon: React.ComponentType<LucideProps>;
  label: string;
  path: string;
}

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks: NavLink[] = [
    { label: 'Features', path: '/#features' },
    { label: 'Pricing', path: '/#pricing' },
    { label: 'Coverage', path: '/#coverage' },
    { label: 'Guide', path: '/guide' },
    { label: 'API', path: '/api-docs' },
  ];

  const userDropdownLinks: UserDropdownLink[] = [
    { Icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { Icon: Store, label: 'Retailers', path: '/retailers' },
    { Icon: BarChart3, label: 'Comparison', path: '/comparison' },
    { Icon: History, label: 'History', path: '/history' },
  ];

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsUserDropdownOpen(false);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'professional':
        return 'bg-green-500';
      case 'enterprise':
        return 'bg-purple-500';
      case 'starter':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlanLabel = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      return location.pathname === '/' && location.hash === `#${hash}`;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-black text-white border-b transition-all duration-300 ${
        isScrolled
          ? 'border-gray-800 shadow-sm backdrop-blur-sm bg-black/95'
          : 'border-gray-800'
      }`}
    >
      <nav className="h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between w-full">
            {/* Logo */}
              <Link
            to="/"
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            aria-label="ShipCompare Home"
          >
            <Package size={24} className="text-white" />
            <span className="text-xl font-medium tracking-tight">ShipCompare</span>
              </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-normal transition-colors relative ${
                  isActive(link.path)
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
                <>
                  <Link
                  to="/login"
                  className="text-sm font-normal text-gray-300 hover:text-white transition-colors"
                >
                  Login
                  </Link>
                  <Link
                  to="/register"
                  className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors rounded-sm"
                >
                  Sign Up
                  </Link>
                </>
            ) : (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-full"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-xs font-medium">
                    {getUserInitials(user?.name || null, user?.email || '')}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-300 transition-transform ${
                      isUserDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-sm py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(user?.name || null, user?.email || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-black truncate">
                            {user?.name || 'User'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </div>
                        </div>
              </div>
                      {user?.plan && (
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${getPlanBadgeColor(
                              user.plan
                            )}`}
                          >
                            {getPlanLabel(user.plan)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dropdown Links */}
                    <div className="py-1">
                      {userDropdownLinks.map((link) => {
                        const IconComponent = link.Icon;
                        return (
                  <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          >
                            <IconComponent size={18} className="text-gray-400" />
                            {link.label}
                  </Link>
                        );
                      })}
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-200 pt-1 mt-1">
              <button
                onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              >
                        <LogOut size={18} className="text-gray-400" />
                        Logout
              </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black text-white z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              {navLinks.map((link) => (
              <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-normal rounded-sm transition-colors ${
                    isActive(link.path)
                      ? 'text-white bg-gray-900'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
              </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            {!isAuthenticated ? (
              <div className="space-y-3 pt-6 border-t border-gray-800">
              <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-base font-normal text-gray-300 hover:bg-gray-900 hover:text-white rounded-sm transition-colors"
              >
                  Login
              </Link>
              <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-base font-medium text-black bg-white hover:bg-gray-200 rounded-sm transition-colors"
              >
                  Sign Up
              </Link>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-800">
                {/* User Info */}
                <div className="px-4 py-4 mb-4 bg-gray-900 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-sm font-medium">
                      {getUserInitials(user?.name || null, user?.email || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-white truncate">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {user?.email}
            </div>
          </div>
        </div>
                  {user?.plan && (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${getPlanBadgeColor(
                        user.plan
                      )}`}
                    >
                      {getPlanLabel(user.plan)}
                    </span>
                  )}
                </div>

                {/* Mobile User Links */}
                <div className="space-y-1">
                  {userDropdownLinks.map((link) => {
                    const IconComponent = link.Icon;
                    return (
              <Link
                        key={link.path}
                        to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-gray-900 hover:text-white rounded-sm transition-colors"
              >
                        <IconComponent size={20} className="text-gray-400" />
                        {link.label}
              </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-base text-gray-300 hover:bg-gray-900 hover:text-white rounded-sm transition-colors"
                  >
                    <LogOut size={20} className="text-gray-400" />
                    Logout
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        )}
      </header>
  );
};

export default Header;
