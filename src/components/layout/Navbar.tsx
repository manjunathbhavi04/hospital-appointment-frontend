
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Role } from "@/types";
import { 
  User, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  Home,
  Phone
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Appointments", href: "/appointments", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
  ];

  // Determine the dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case Role.ADMIN:
        return "/admin/dashboard";
      case Role.DOCTOR:
        return "/doctor/dashboard";
      case Role.STAFF:
        return "/staff/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 right-0 z-50">
      <div className="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            <span className="text-hospital-600">Health</span>
            <span className="text-hospital-800">Care</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center lg:order-2">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to={getDashboardLink()}>
                <Button variant="ghost" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => logout()} 
                variant="ghost" 
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/appointments">
                <Button>Book Appointment</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex md:w-auto items-center justify-between w-full" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="flex items-center py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-hospital-600 md:p-0">
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:hidden fixed top-14 left-0 right-0 bottom-0 bg-white z-50 h-screen p-4 overflow-y-auto`}
        >
          <ul className="space-y-6 mt-6 font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.href} 
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}

            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to={getDashboardLink()} 
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="ml-3">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Button 
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                    }} 
                    variant="ghost" 
                    className="flex items-center w-full justify-start"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Logout</span>
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="ml-3">Login</span>
                  </Link>
                </li>
                <li className="mt-4">
                  <Link 
                    to="/appointments"
                    onClick={toggleMobileMenu}
                  >
                    <Button className="w-full">
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
