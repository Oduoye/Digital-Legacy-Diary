import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
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
                Terms of Service
              </h1>
              
              <div className="prose prose-lg max-w-none text-white/90">
                <p className="text-white/70 mb-8">Effective Date: March 15, 2025</p>

                <p className="mb-6">
                  These Terms of Service ("Terms") govern your access to and use of the "Digital Legacy Diary" web application (the "Service"), provided by Digital Legacy Diary ("we," "us," or "our").
                </p>

                <p className="mb-8">
                  By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-6">
                  By creating an account, clicking "I Agree," or otherwise accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms, and you represent that you are of legal age to form a binding contract in your jurisdiction (18 years old or older).
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  2. User Accounts
                </h2>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-4">
                    <strong>Account Creation:</strong> To use most features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </li>
                  <li className="mb-4">
                    <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
                  </li>
                  <li>
                    <strong>Eligibility:</strong> You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement.
                  </li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  3. Your Digital Legacy Diary Service
                </h2>
                <p>The Service provides you with a secure platform to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Create, edit, and store text-based diary entries.</li>
                  <li>Upload and attach various media files, including images (JPEG, PNG), videos (MP4, MOV, etc.), and document files (PDFs, etc.), to your entries.</li>
                  <li>Organize your content using tags and categories.</li>
                  <li>Receive AI-generated writing prompts to inspire your journaling.</li>
                  <li>Designate "Trusted Contacts" to receive access to your Digital Legacy Diary after your passing.</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  13. Governing Law and Dispute Resolution
                </h2>
                <p className="mb-6">
                  These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  14. Changes to These Terms
                </h2>
                <p className="mb-6">
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Effective Date" at the top.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  15. Contact Us
                </h2>
                <p>If you have any questions about these Terms, please contact us:</p>
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

export default TermsPage;