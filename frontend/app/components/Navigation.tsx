import { Link, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Home, 
  Mic, 
  Library, 
  Settings, 
  User,
  LogIn,
  UserPlus,
  Sparkles
} from "lucide-react";

interface NavigationProps {
  isAuthenticated?: boolean;
}

export default function Navigation({ isAuthenticated = false }: NavigationProps) {
  const location = useLocation();
  
  const navItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/voice-clone", label: "Voice Clone", icon: Mic },
    { path: "/voice-library", label: "Voice Library", icon: Library },
    { path: "/dashboard", label: "Dashboard", icon: Sparkles },
  ];

  const authItems = [
    { path: "/login", label: "Login", icon: LogIn },
    { path: "/signup", label: "Sign Up", icon: UserPlus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                RVC-Wiz
              </span>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth & Settings */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive("/settings")
                      ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">Settings</span>
                </Link>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl">
                  <User className="w-4 h-4 text-white/70" />
                  <span className="text-white font-medium hidden sm:inline">Profile</span>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
