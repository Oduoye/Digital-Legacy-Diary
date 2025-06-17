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
              
              <div className="prose prose-lg max-w-none text-white/90 text-left">
                <p className="text-white/70 mb-8 text-center">Effective Date: January 1, 2025</p>

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
                  2. Description of Service
                </h2>
                <p className="mb-4">Digital Legacy Diary provides a secure platform to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Create, edit, and store digital journal entries containing your memories, stories, and wisdom</li>
                  <li>Upload and attach media files (images, videos, documents) to your entries</li>
                  <li>Organize your content using tags and categories</li>
                  <li>Receive AI-generated writing prompts to inspire your journaling</li>
                  <li>Designate "Trusted Contacts" to receive access to your digital legacy</li>
                  <li>Store legal documents including wills and testaments</li>
                  <li>Set up automated legacy transfer systems</li>
                  <li>Generate AI-powered life story insights and analysis</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  3. User Accounts and Eligibility
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Age Requirement:</strong> You must be at least 18 years old to use the Service.</li>
                  <li><strong>Account Creation:</strong> You agree to provide accurate, current, and complete information during registration.</li>
                  <li><strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
                  <li><strong>One Account Per Person:</strong> You may only create one account per person.</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  4. User Content and Responsibilities
                </h2>
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">a. Your Content:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>You retain ownership of all content you create and upload to the Service</li>
                  <li>You grant us a limited license to store, process, and transmit your content as necessary to provide the Service</li>
                  <li>You are responsible for backing up your content</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">b. Content Standards:</h3>
                <p className="mb-4">You agree not to upload content that:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
                  <li>Violates intellectual property rights of others</li>
                  <li>Contains malware, viruses, or other harmful code</li>
                  <li>Is spam or unsolicited commercial content</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  5. Subscription Plans and Payments
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Free Plan:</strong> Limited features with basic storage and functionality</li>
                  <li><strong>Premium Plans:</strong> Enhanced features, increased storage, and advanced functionality</li>
                  <li><strong>Billing:</strong> Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings</li>
                  <li><strong>Refunds:</strong> Refunds are provided according to our refund policy</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  6. Legacy Transfer and Trusted Contacts
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>You may designate trusted contacts to receive access to your digital legacy</li>
                  <li>Legacy transfer may be triggered manually or through automated systems</li>
                  <li>We will make reasonable efforts to contact your trusted contacts but cannot guarantee delivery</li>
                  <li>Access codes are time-limited and may expire for security reasons</li>
                  <li>You are responsible for keeping trusted contact information current</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  7. Privacy and Data Protection
                </h2>
                <p className="mb-6">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  8. Prohibited Uses
                </h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  9. Service Availability and Modifications
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>We strive to maintain high service availability but cannot guarantee 100% uptime</li>
                  <li>We may modify, suspend, or discontinue the Service with reasonable notice</li>
                  <li>We may update these Terms from time to time with notice to users</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="mb-6">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  11. Indemnification
                </h2>
                <p className="mb-6">
                  You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use 
                  of the Service or violation of these Terms.
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  12. Termination
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>You may terminate your account at any time through your account settings</li>
                  <li>We may terminate or suspend your account for violation of these Terms</li>
                  <li>Upon termination, your access to the Service will cease, but legacy transfer provisions may remain active</li>
                </ul>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  13. Governing Law and Dispute Resolution
                </h2>
                <p className="mb-6">
                  These Terms shall be governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through 
                  binding arbitration or in the courts of [Your Jurisdiction].
                </p>

                <h2 className="text-2xl font-serif font-semibold text-white mt-8 mb-4">
                  14. Contact Information
                </h2>
                <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
                <ul className="list-disc pl-6 mt-4 space-y-1">
                  <li><strong>Email:</strong> legal@digitallegacydiary.com</li>
                  <li><strong>Contact Form:</strong> Available on our website</li>
                  <li><strong>Mail:</strong> Digital Legacy Diary, Legal Department, [Your Address]</li>
                </ul>

                <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm text-white/80">
                    <strong>Last Updated:</strong> January 1, 2025<br/>
                    <strong>Note:</strong> These Terms of Service are designed to protect both you and Digital Legacy Diary 
                    while ensuring the secure and reliable operation of our digital legacy preservation service.
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

export default TermsPage;