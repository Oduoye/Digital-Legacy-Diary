import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">About Digital Legacy Diary</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12 animate-fade-in-up">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              In a world where memories can fade, Digital Legacy Diary offers a revolutionary way to preserve your unique story, wisdom, and experiences for eternity. We empower you to effortlessly capture the essence of your life's journey, transforming raw moments into rich, coherent narratives with the intelligent assistance of AI, ensuring your legacy truly lives on for future generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg animate-fade-in-up [animation-delay:200ms]">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To help individuals preserve their life stories, wisdom, and memories in a meaningful way that can be shared with future generations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-white p-6 rounded-lg animate-fade-in-up [animation-delay:400ms]">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700">
                Creating a world where no story is lost to time, where every individual's legacy can inspire and guide future generations.
              </p>
            </div>
          </div>

          <div className="bg-primary-600 text-white rounded-xl p-8 text-center animate-fade-in-up [animation-delay:600ms]">
            <h2 className="text-2xl font-serif font-bold mb-4">Ready to Start Your Legacy?</h2>
            <p className="mb-6">Join thousands of others who are preserving their stories for future generations.</p>
            <Link to="/register">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-600"
                icon={<ArrowRight className="ml-2" />}
              >
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;