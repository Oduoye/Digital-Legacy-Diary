import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 backdrop-blur-xl bg-white/10 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-flex items-center">
            <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center p-1 shadow-2xl border border-white/20">
              <img 
                src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" 
                alt="Digital Legacy Diary"
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-2xl font-serif font-bold text-white">D</span>';
                  }
                }}
              />
            </div>
            <span className="ml-2 text-lg font-serif font-medium text-white">Digital Legacy Diary</span>
          </Link>
          <p className="mt-4 text-sm text-white/80">
            Preserving memories, sharing wisdom, connecting generations.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="flex flex-wrap justify-center space-x-6 mb-4">
            <Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link to="/privacy" className="text-sm text-white/80 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-white/80 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-sm text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-white/70">
            ©2025 Digital Legacy Diary
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;