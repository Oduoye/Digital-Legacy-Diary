import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { supabase } from '../lib/supabase';

const EmailVerificationCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        console.log('Email verification callback:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (!accessToken || !refreshToken) {
          setStatus('error');
          setMessage('Invalid verification link. Please try requesting a new verification email.');
          return;
        }

        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Session error:', error);
          setStatus('error');
          setMessage('Invalid or expired verification link. Please try requesting a new verification email.');
          return;
        }

        if (data.user && data.user.email_confirmed_at) {
          console.log('Email verified successfully:', data.user);
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('An error occurred during email verification. Please try again.');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
      </div>

      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-blue-400/30">
                    <Loader className="h-8 w-8 text-blue-400 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">
                    Verifying Your Email
                  </h2>
                  <p className="text-white/80">
                    Please wait while we verify your email address...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30 animate-pulse">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">
                    Email Verified Successfully!
                  </h2>
                  <p className="text-white/80 mb-4">
                    {message}
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-shrink-width" />
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-red-400/30">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">
                    Verification Failed
                  </h2>
                  <p className="text-white/80 mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full border border-white/30 text-white hover:bg-white/10 font-medium py-2 px-4 rounded-md transition-all duration-200"
                    >
                      Create New Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default EmailVerificationCallbackPage;