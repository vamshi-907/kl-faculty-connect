import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/faculty', label: 'Faculty List' },
  { path: '/cgpa-calculator', label: 'CGPA → Percentage' },
  { path: '/sgpa-calculator', label: 'SGPA → CGPA' },
  { path: '/contribute', label: 'Contribute' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, logoutAdmin } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <GraduationCap className="h-8 w-8" />
            <span className="font-semibold text-lg hidden sm:block">KL University</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-primary-foreground/80 hover:text-primary-foreground ${
                  location.pathname === link.path ? 'nav-link-active text-primary-foreground' : ''
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Admin Link */}
            {isAdmin ? (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/admin"
                  className={`nav-link text-primary-foreground/80 hover:text-primary-foreground ${
                    location.pathname === '/admin' ? 'nav-link-active text-primary-foreground' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="text-xs text-primary-foreground/60 hover:text-primary-foreground ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin-login"
                className="ml-4 flex items-center gap-1 text-primary-foreground/50 hover:text-primary-foreground/80 text-xs transition-colors"
              >
                <Lock className="h-3 w-3" />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary-foreground p-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-primary-foreground/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors ${
                    location.pathname === link.path ? 'bg-primary-foreground/10 text-primary-foreground font-medium' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-primary-foreground/10 mt-2 pt-2">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-primary-foreground/80 hover:bg-primary-foreground/10"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => { logoutAdmin(); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-primary-foreground/60 hover:text-primary-foreground"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin-login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-primary-foreground/50"
                  >
                    <Lock className="h-4 w-4" />
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
