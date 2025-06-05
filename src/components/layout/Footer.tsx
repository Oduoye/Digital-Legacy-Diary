import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-flex items-center">
            <img 
              src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png"
              alt="Digital Legacy Diary"
              className="h-12 w-12 object-contain"
            />
            <span className="ml-2 text-lg font-serif font-medium text-gray-900">Digital Legacy Diary</span>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Preserving memories, sharing wisdom, connecting generations.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="flex space-x-6 mb-4">
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-800">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-800">
              Terms
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-800">
              Contact
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            ©2025 Digital Legacy Diary
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;