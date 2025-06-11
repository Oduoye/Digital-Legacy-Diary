import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Book, Shield, Users, ArrowRight, Heart, Star, Sparkles, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import LiveChatButton from '../components/ui/LiveChatButton';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-600/25 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/3 to-transparent" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                                radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
               backgroundSize: '100px 100px'
             }} />
      </div>

      <Layout>
        {/* Hero Section */}
        <section className="relative z-10 overflow-hidden animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-white">Your memories, preserved forever</span>
              </div>
              <div className="relative mb-6">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                  Preserve Your Legacy,{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white animate-gradient-x drop-shadow-2xl" 
                          style={{ 
                            backgroundSize: '400% 400%',
                            textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(34,211,238,0.3)',
                            WebkitTextStroke: '1px rgba(255,255,255,0.1)'
                          }}>
                      Share Your Story
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-white blur-lg opacity-40 animate-pulse"></span>
                    <Sparkles className="absolute -right-8 -top-6 h-6 w-6 text-yellow-400 animate-float drop-shadow-lg" />
                  </span>
                </h1>
              </div>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                Every memory tells a story. Create a lasting legacy by sharing your wisdom, experiences, and cherished moments with future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8 group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-2xl"
                  >
                    <span className="relative z-10">Begin Your Journey</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto px-8 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    Welcome Back
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative z-10 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-white mb-6">Your Story Matters</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Digital Legacy Diary helps you preserve life's precious moments and share your wisdom with those who matter most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Feature cards with glass morphism */}
              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Book className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-4">Guided Storytelling</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Thoughtful prompts help you reflect on meaningful memories and capture your unique perspective.
                </p>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-4">Safe & Private</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Your memories are protected with care. You decide who receives your legacy and when.
                </p>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-4">Family Connection</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Bridge generations by sharing your wisdom, stories, and life lessons with loved ones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 relative z-10 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-white mb-6">Simple Steps to Preserve Your Legacy</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Begin your journey of preserving memories and connecting generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <span className="text-2xl font-serif font-bold text-white">1</span>
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-cyan-400 to-transparent hidden md:block -translate-y-1/2" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-white">Start Writing</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Begin with simple prompts that help you share your memories and wisdom naturally.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <span className="text-2xl font-serif font-bold text-white">2</span>
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-purple-400 to-transparent hidden md:block -translate-y-1/2" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-white">Choose Recipients</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Select family members who will receive your stories and wisdom when the time comes.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="rounded-full bg-gradient-to-r from-green-400 to-cyan-500 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <span className="text-2xl font-serif font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-white">Create Your Legacy</h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  Your memories will be preserved and shared with care, keeping your story alive for generations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative z-10 overflow-hidden animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
                <Heart className="h-5 w-5 text-pink-400 mr-2" />
                <span className="text-sm font-medium text-white">Join thousands preserving their legacy</span>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">Begin Your Legacy Today</h2>
              <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-white/90">
                Every story deserves to be remembered. Start preserving your memories and wisdom for future generations.
              </p>
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 group shadow-2xl"
                  icon={<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
                >
                  Create Your Diary
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Chat Button */}
        <LiveChatButton variant="floating" />
      </Layout>
    </div>
  );
};

export default HomePage;