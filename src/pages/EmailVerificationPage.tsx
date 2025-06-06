import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || type !== 'signup') {
          setStatus('error');
          setMessage('Invalid verification link. Please check your email for the correct link.');
          return;
        }

        // Verify the email using Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          console.error('Email verification error:', error);
          
          if (error.message.includes('expired')) {
            setStatus('expired');
            setMessage('This verification link has expired. Please request a new verification email.');
          } else {
            setStatus('error');
            setMessage(error.message || 'Failed to verify your email. Please try again.');
          }
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now sign in to your account.');
          
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                message: 'Email verified successfully! You can now sign in.',
                type: 'success'
              }
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Verification process error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during verification. Please try again.');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    try {
      // This would require the user's email, which we don't have here
      // In a real app, you might want to redirect to a resend verification page
      navigate('/login', { 
        state: { 
          message: 'Please sign in to resend verification email.',
          type: 'info'
        }
      });
    } catch (error) {
      console.error('Error redirecting for resend:', error);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Continue to Sign In
              </Button>
              <p className="text-xs text-gray-500">
                Redirecting automatically in a few seconds...
              </p>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification Link Expired
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                className="w-full"
              >
                Go to Sign In
              </Button>
              <p className="text-sm text-gray-500">
                You can request a new verification email from the sign-in page.
              </p>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full"
              >
                Create New Account
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Card className="animate-fade-in">
            <CardContent className="p-8">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerificationPage;