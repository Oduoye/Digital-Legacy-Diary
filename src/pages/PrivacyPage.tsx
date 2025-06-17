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
              
              <div className="prose prose-lg max-w-none text-white/90 text-left">
                <p className="text-white/70 mb-8 text-center">Effective Date: January 1, 2025</p>

                <p className="mb-6">
                  This Privacy Policy explains how Digital Legacy Diary ("we," "us," or "our") collects, uses, stores, processes, discloses, and protects your personal information when you use our web application, "Digital Legacy Diary" (the "Service").
                </p>

                <p className="mb-8">
                  Our mission is to create a compassionate, secure, and sustainable platform that empowers individuals to capture, preserve, and transmit their life's memories, stories, wisdom, and crucial final wishes to designated family members ("Trusted Contacts") after their passing. We are committed to protecting your privacy and the security of your deeply personal information.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  1. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">a. Information You Provide Directly:</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, password (encrypted), and profile preferences.</li>
                  <li><strong>Digital Legacy Content:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Journal entries (memories, stories, advice, reflections, final wishes)</li>
                      <li>Uploaded media files: Images (JPEG, PNG), Videos (MP4, MOV), and Documents (PDF)</li>
                      <li>Legal documents including wills and testaments</li>
                    </ul>
                  </li>
                  <li><strong>Content Organization:</strong> Tags, categories, and metadata you apply to your entries.</li>
                  <li><strong>Trusted Contacts:</strong> Names and email addresses of individuals you designate as legacy recipients.</li>
                  <li><strong>Communications:</strong> Messages sent through our contact forms and customer support interactions.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">b. Information We Collect Automatically:</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Usage Data:</strong> How you interact with the Service, pages visited, features used.</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers.</li>
                  <li><strong>Authentication Data:</strong> Login timestamps, session information for security purposes.</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  2. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Provide and maintain the Digital Legacy Diary service</li>
                  <li>Secure storage and organization of your digital legacy content</li>
                  <li>Enable legacy transfer to your designated trusted contacts</li>
                  <li>Generate AI-powered writing prompts and life story insights</li>
                  <li>Communicate with you about your account and service updates</li>
                  <li>Provide customer support and respond to your inquiries</li>
                  <li>Improve our service through usage analytics</li>
                  <li>Ensure security and prevent fraud or abuse</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  3. Third-Party Services
                </h2>
                <p className="mb-4">We use the following third-party services to provide our platform:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Supabase:</strong> Database hosting, authentication, and backend services. Data is encrypted and stored securely.</li>
                  <li><strong>Netlify:</strong> Web hosting and content delivery network for fast, secure access to our platform.</li>
                  <li><strong>Formspree:</strong> Contact form processing for customer support inquiries.</li>
                  <li><strong>Email Service Providers:</strong> For sending account notifications and legacy transfer communications.</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  4. Data Security
                </h2>
                <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Secure HTTPS connections for all data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Secure data centers with redundant backups</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  5. Legacy Transfer Process
                </h2>
                <p className="mb-4">When legacy transfer is activated:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Secure access codes are generated for each trusted contact</li>
                  <li>Encrypted emails are sent to designated recipients</li>
                  <li>Access is time-limited and monitored for security</li>
                  <li>Recipients can access and download your digital legacy content</li>
                  <li>All access attempts are logged for security purposes</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  6. Data Retention
                </h2>
                <p className="mb-6">
                  We retain your information for as long as your account is active or as needed to provide services. 
                  Upon account deletion, personal data is permanently removed within 30 days, except where required 
                  by law or for legitimate business purposes (such as fraud prevention).
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  7. Your Rights
                </h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Export your data in a portable format</li>
                  <li>Restrict or object to certain processing activities</li>
                  <li>Withdraw consent for data processing</li>
                  <li>File a complaint with relevant data protection authorities</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  8. International Data Transfers
                </h2>
                <p className="mb-6">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  9. Children's Privacy
                </h2>
                <p className="mb-6">
                  Our Service is not intended for individuals under 18 years of age. We do not knowingly collect 
                  personal information from children under 18.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Effective Date" at the top.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  11. Contact Us
                </h2>
                <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="list-disc pl-6 mt-4 space-y-1">
                  <li><strong>Email:</strong> contact@digitallegacydiary.tech</li>
                  <li><strong>Mail:</strong> Ibadan, Nigeria</li>
                </ul>

                <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm text-white/80">
                    <strong>Note:</strong> This Privacy Policy is designed to be transparent about our data practices. 
                    Your trust is paramount to us, and we are committed to protecting your digital legacy with the highest 
                    standards of privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default PrivacyPage;