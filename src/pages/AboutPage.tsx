import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/1 to-transparent" />
      </div>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold text-white mb-6">About Digital Legacy Diary</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl p-8 mb-12 animate-fade-in-up">
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                In a world where memories can fade, Digital Legacy Diary offers a revolutionary way to preserve your unique story, wisdom, and experiences for eternity. We empower you to effortlessly capture the essence of your life's journey, transforming raw moments into rich, coherent narratives with the intelligent assistance of AI, ensuring your legacy truly lives on for future generations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-lg animate-fade-in-up [animation-delay:200ms]">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">Our Mission</h2>
                <p className="text-white/80">
                  To help individuals preserve their life stories, wisdom, and memories in a meaningful way that can be shared with future generations.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-lg animate-fade-in-up [animation-delay:400ms]">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">Our Vision</h2>
                <p className="text-white/80">
                  Creating a world where no story is lost to time, where every individual's legacy can inspire and guide future generations.
                </p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-8 text-center animate-fade-in-up [animation-delay:600ms]">
              <h2 className="text-2xl font-serif font-bold mb-4 text-white">Ready to Start Your Legacy?</h2>
              <p className="mb-6 text-white/80">Join thousands of others who are preserving their stories for future generations.</p>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  icon={<ArrowRight className="ml-2" />}
                >
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AboutPage;