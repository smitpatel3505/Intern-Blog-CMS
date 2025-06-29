import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, PenTool, Menu, X, BookOpen, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Navbar({ onCreatePost }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg glow">
              <BookOpen className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">
              BlogCraft
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  onClick={onCreatePost}
                  className="btn-gradient text-white border-0 gap-2 px-6 py-2.5 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PenTool className="w-4 h-4" />
                  Write Post
                </Button>

                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 px-4 py-2 h-auto font-medium"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 px-3 py-2 h-auto font-medium"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden sm:inline">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.displayName || 'User'}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-gradient text-white border-0 gap-2 px-6 py-2.5 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-xl hover:bg-accent/80 transition-all duration-300 hover:scale-110"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="w-10 h-10 p-0 rounded-xl hover:bg-accent/80 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-out overflow-hidden",
            isMenuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0",
          )}
        >
          <div className="pt-4 space-y-3 border-t border-border/50">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    onCreatePost();
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-gradient text-white border-0 gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <PenTool className="w-4 h-4" />
                  Write Post
                </Button>

                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full gap-2 font-medium"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.displayName || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full btn-gradient text-white border-0 gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full gap-2 rounded-xl hover:bg-accent/80 transition-all duration-300"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}
