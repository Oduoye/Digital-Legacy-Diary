import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 mb-8">Effective Date: March 15, 2025</p>

              <p className="mb-6">
                This Privacy Policy explains how Digital Legacy Diary ("we," "us," or "our") collects, uses, stores, processes, discloses, and protects your personal information when you use our web application, "Digital Legacy Diary" (the "Service").
              </p>

              <p className="mb-8">
                Our mission is to create a compassionate, secure, and sustainable platform that empowers individuals to capture, preserve, and transmit their life's memories, stories, wisdom, and crucial final wishes to designated family members ("Trusted Contacts") after their passing. We are committed to protecting your privacy and the security of your deeply personal information.
              </p>

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
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

              <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
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
  );
};

export default PrivacyPage;