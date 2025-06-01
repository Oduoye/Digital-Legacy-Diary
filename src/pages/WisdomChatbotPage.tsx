import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import WisdomChatbot from '../components/chatbot/WisdomChatbot';

const WisdomChatbotPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Wisdom Chatbot</h1>
          <p className="text-gray-600 mt-2">
            Chat with an AI assistant that helps you explore and reflect on your memories
          </p>
        </div>

        <WisdomChatbot />
      </div>
    </Layout>
  );
};

export default WisdomChatbotPage;