import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Menu, X, User, Heart, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="p-2 rounded-xl bg-primary/10"
          >
            <ChefHat className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-xl font-display font-bold text-gradient">OurDapur</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/recipes" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Recipes
          </Link>
          <Link 
            to="/ai-suggest" 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggest
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Join Free</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-2">
              <Link 
                to="/recipes" 
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Recipes
              </Link>
              <Link 
                to="/ai-suggest" 
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Sparkles className="h-4 w-4" />
                AI Suggest
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Favorites
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left text-destructive"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={() => setIsOpen(false)}>Join Free</Link>
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
