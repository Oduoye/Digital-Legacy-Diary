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
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden animate-fade-in">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.1),transparent)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-sm hover:shadow transition-all duration-300">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-800">Your memories, preserved forever</span>
            </div>
            <div className="relative mb-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Preserve Your Legacy,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent animate-gradient-x">
                    Share Your Story
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-200 to-accent-200 blur-lg opacity-30 animate-pulse"></span>
                  <Sparkles className="absolute -right-8 -top-6 h-6 w-6 text-yellow-400 animate-float" />
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
              Every memory tells a story. Create a lasting legacy by sharing your wisdom, experiences, and cherished moments with future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 group relative overflow-hidden"
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-300"
                >
                  Welcome Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Your Story Matters</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Digital Legacy Diary helps you preserve life's precious moments and share your wisdom with those who matter most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature cards with hover effects */}
            <div className="group bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Book className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Guided Storytelling</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Thoughtful prompts help you reflect on meaningful memories and capture your unique perspective.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-secondary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Safe & Private</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Your memories are protected with care. You decide who receives your legacy and when.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-accent-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Family Connection</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Bridge generations by sharing your wisdom, stories, and life lessons with loved ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with animated steps */}
      <section className="py-20 bg-gray-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Simple Steps to Preserve Your Legacy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Begin your journey of preserving memories and connecting generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative">
                <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-serif font-bold text-primary-700">1</span>
                </div>
                <div className="absolute top-1/2 left-full w-full h-px bg-primary-200 hidden md:block -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Start Writing</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Begin with simple prompts that help you share your memories and wisdom naturally.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-serif font-bold text-primary-700">2</span>
                </div>
                <div className="absolute top-1/2 left-full w-full h-px bg-primary-200 hidden md:block -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Choose Recipients</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Select family members who will receive your stories and wisdom when the time comes.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-serif font-bold text-primary-700">3</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Create Your Legacy</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Your memories will be preserved and shared with care, keeping your story alive for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced gradient and animation */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(255,255,255,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_600px,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Heart className="h-5 w-5 text-pink-300 mr-2" />
            <span className="text-sm font-medium">Join thousands preserving their legacy</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-6">Begin Your Legacy Today</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
            Every story deserves to be remembered. Start preserving your memories and wisdom for future generations.
          </p>
          <Link to="/register">
            <Button 
              variant="outline"
              size="lg" 
              className="border-white text-white px-10 hover:bg-white hover:text-primary-600 group"
              icon={<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
            >
              Create Your Diary
            </Button>
          </Link>
        </div>
      </section>

      {/* Live Chat Button */}
      <LiveChatButton variant="floating" />
    </Layout>
  );
};

export default HomePage;