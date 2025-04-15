
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useGradeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { student } = useGradeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    {
      name: "Grade Prediction",
      icon: <LineChart size={18} />,
      path: "/prediction",
    },
    {
      name: "Study Advice",
      icon: <BookOpen size={18} />,
      path: "/study-advice",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-edu-primary">Grade<span className="text-edu-dark">Pro</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-edu-primary transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="text-sm font-medium">
                  <span className="text-gray-500">Hello,</span> {currentUser.name.split(' ')[0]}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3">
          <div className="container mx-auto px-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-edu-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 py-2 w-full text-left text-gray-600 hover:text-edu-primary transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
