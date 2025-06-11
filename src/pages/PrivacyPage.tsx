import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl p-8 animate-fade-in-up">
            <div className="text-center">
              <h1 className="text-3xl font-serif font-bold text-white mb-6">
                Privacy Policy
              </h1>
              
              <div className="prose prose-lg max-w-none text-white/90">
                <p className="text-white/70 mb-8">Effective Date: March 15, 2025</p>

                <p className="mb-6">
                  This Privacy Policy explains how Digital Legacy Diary ("we," "us," or "our") collects, uses, stores, processes, discloses, and protects your personal information when you use our web application, "Digital Legacy Diary" (the "Service").
                </p>

                <p className="mb-8">
                  Our mission is to create a compassionate, secure, and sustainable platform that empowers individuals to capture, preserve, and transmit their life's memories, stories, wisdom, and crucial final wishes to designated family members ("Trusted Contacts") after their passing. We are committed to protecting your privacy and the security of your deeply personal information.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  1. Information We Collect
                </h2>
                <p>We collect various types of information from and about you, including information that may identify you directly or indirectly.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">a. Information You Provide Directly:</h3>
                <p>This includes personal data you voluntarily provide when you register for an account, create entries, upload files, or interact with our Service:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Account Information: Name, email address, password (hashed), and profile preferences.</li>
                  <li>Diary Content:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Text-based entries (your memories, stories, advice, reflections, final wishes, etc.).</li>
                      <li>Uploaded media files: Images (JPEG, PNG), Videos (MP4, MOV, etc.), and Document Files (PDF, etc.).</li>
                    </ul>
                  </li>
                  <li>Content Organization Data: Tags or categories you apply to your entries.</li>
                  <li>Trusted Contacts Information: Names and email addresses of individuals you designate as "Trusted Contacts".</li>
                  <li>Communications: Records of your correspondence with us, such as customer support inquiries.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">b. Information We Collect Automatically:</h3>
                <ul className="list-disc pl-6 mb-8">
                  <li>Usage Data: Information about how you interact with the Service.</li>
                  <li>Device Information: IP address, browser type, operating system, and device identifiers.</li>
                  <li>Cookies and Tracking Technologies: Used to enhance your experience and analyze usage patterns.</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  10. Contact Us
                </h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>By Email: noncefirewall@gmail.com</li>
                  <li>By Mail: Ibadan, Nigeria</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default PrivacyPage;