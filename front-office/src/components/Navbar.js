import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Bus,
  Plane,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Info,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';
import { isAuthenticated, getCurrentUser, logout } from '@/utils/auth';

const NAV_LINKS = [
  { to: '/cars', label: 'Voitures', icon: Car },
  { to: '/bus', label: 'Bus', icon: Bus },
  { to: '/flights', label: 'Vols', icon: Plane },
  { to: '/about', label: 'À propos', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name, email) => {
    const source = (name || email || 'U').trim();
    const parts = source.split(/\s+/);
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return source.slice(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] rounded-lg"
            data-testid="logo-link"
            aria-label="Atiko - Retour à l'accueil"
          >
            <Logo size={40} className="group-hover:scale-105 transition-transform" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#0EA5E9] bg-sky-50'
                      : 'text-gray-700 hover:text-[#0EA5E9] hover:bg-gray-50'
                  }`}
                  data-testid={`nav-${link.to.replace('/', '')}`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0EA5E9] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/40"
                    data-testid="account-btn"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                      {getInitials(user?.name, user?.email)}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-xs text-gray-500">Bonjour,</span>
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
                        {user?.name || 'Utilisateur'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold truncate">{user?.name || 'Mon compte'}</span>
                      {user?.email && (
                        <span className="text-xs text-gray-500 font-normal truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer"
                    data-testid="menu-dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Mon espace
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    data-testid="menu-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="text-gray-700 hover:text-[#0EA5E9]"
                  data-testid="nav-login-btn"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=register')}
                  className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white shadow-sm"
                  data-testid="nav-register-btn"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
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

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out border-t border-gray-100 ${
          mobileMenuOpen ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        data-testid="mobile-menu"
      >
        <div className="px-4 py-4 space-y-1">
          {authenticated && (
            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-gradient-to-r from-sky-50 to-orange-50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white flex items-center justify-center font-semibold text-sm">
                {getInitials(user?.name, user?.email)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 truncate">
                  {user?.name || 'Utilisateur'}
                </div>
                {user?.email && (
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                )}
              </div>
            </div>
          )}

          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 py-3 px-3 rounded-lg font-medium transition-colors ${
                  active
                    ? 'bg-sky-50 text-[#0EA5E9]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
            {authenticated ? (
              <>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full justify-start bg-[#38BDF8] hover:bg-[#0EA5E9]"
                  data-testid="mobile-dashboard-btn"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Mon espace
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  data-testid="mobile-logout-btn"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full justify-center"
                  data-testid="mobile-login-btn"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=register')}
                  className="w-full justify-center bg-[#38BDF8] hover:bg-[#0EA5E9]"
                  data-testid="mobile-register-btn"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
