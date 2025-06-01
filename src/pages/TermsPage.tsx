import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in-up">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 mb-8">Effective Date: March 15, 2025</p>

              <p className="mb-6">
                These Terms of Service ("Terms") govern your access to and use of the "Digital Legacy Diary" web application (the "Service"), provided by Digital Legacy Diary ("we," "us," or "our").
              </p>

              <p className="mb-8">
                By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.
              </p>

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-6">
                By creating an account, clicking "I Agree," or otherwise accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms, and you represent that you are of legal age to form a binding contract in your jurisdiction (18 years old or older).
              </p>

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
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

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
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

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
                13. Governing Law and Dispute Resolution
              </h2>
              <p className="mb-6">
                These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
                14. Changes to These Terms
              </h2>
              <p className="mb-6">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Effective Date" at the top.
              </p>

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
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
  );
};

export default TermsPage;