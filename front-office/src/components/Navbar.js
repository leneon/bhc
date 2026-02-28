import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/utils/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const authenticated = isAuthenticated();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <img src="/logo.png" alt="Atiko Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Work Sans' }}>
              Atiko
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/cars" 
              className={`text-gray-700 hover:text-[#38BDF8] font-medium transition-colors ${
                isActive('/cars') ? 'text-[#38BDF8]' : ''
              }`}
              data-testid="nav-cars"
            >
              Voitures
            </Link>
            <Link 
              to="/bus" 
              className={`text-gray-700 hover:text-[#38BDF8] font-medium transition-colors ${
                isActive('/bus') ? 'text-[#38BDF8]' : ''
              }`}
              data-testid="nav-bus"
            >
              Bus
            </Link>
            <Link 
              to="/flights" 
              className={`text-gray-700 hover:text-[#38BDF8] font-medium transition-colors ${
                isActive('/flights') ? 'text-[#38BDF8]' : ''
              }`}
              data-testid="nav-flights"
            >
              Vols
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-700 hover:text-[#38BDF8] font-medium transition-colors ${
                isActive('/about') ? 'text-[#38BDF8]' : ''
              }`}
              data-testid="nav-about"
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-700 hover:text-[#38BDF8] font-medium transition-colors ${
                isActive('/contact') ? 'text-[#38BDF8]' : ''
              }`}
              data-testid="nav-contact"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => navigate(authenticated ? '/dashboard' : '/auth')}
              variant={authenticated ? 'default' : 'outline'}
              size="icon"
              className={`rounded-full ${authenticated ? 'bg-[#38BDF8] hover:bg-[#0EA5E9]' : ''}`}
              aria-label={authenticated ? 'Mon espace' : 'Authentification'}
              data-testid="account-btn"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/cars" 
              className="block py-2 text-gray-700 hover:text-[#38BDF8] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Voitures
            </Link>
            <Link 
              to="/bus" 
              className="block py-2 text-gray-700 hover:text-[#38BDF8] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bus
            </Link>
            <Link 
              to="/flights" 
              className="block py-2 text-gray-700 hover:text-[#38BDF8] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vols
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700 hover:text-[#38BDF8] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-700 hover:text-[#38BDF8] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    navigate(authenticated ? '/dashboard' : '/auth');
                    setMobileMenuOpen(false);
                  }}
                  variant={authenticated ? 'default' : 'outline'}
                  size="icon"
                  className={`rounded-full ${authenticated ? 'bg-[#38BDF8] hover:bg-[#0EA5E9]' : ''}`}
                  aria-label={authenticated ? 'Mon espace' : 'Authentification'}
                  data-testid="mobile-account-btn"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}