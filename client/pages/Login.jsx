import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>

      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg glow mx-auto w-fit mb-4">
                <BookOpen className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your account and start creating amazing content
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full btn-gradient text-white border-0 gap-3 text-lg py-6 h-auto font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Sign In to BlogCraft
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Create one now
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Create Posts</h3>
              <p className="text-sm text-muted-foreground">
                Share your stories with the world
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1">Manage Content</h3>
              <p className="text-sm text-muted-foreground">
                Edit and organize your posts
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold mb-1">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Join our community of writers
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
} 