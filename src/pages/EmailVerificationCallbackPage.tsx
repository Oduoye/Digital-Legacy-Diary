import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const EmailVerificationCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    handleEmailVerification();
  }, []);

  const handleEmailVerification = async () => {
    try {
      setStatus('loading');
      setMessage('Verifying your email address...');

      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const tokenHash = searchParams.get('token_hash');
      const next = searchParams.get('next');

      console.log('Email verification params:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        type, 
        hasTokenHash: !!tokenHash,
        next 
      });

      // Handle different verification methods
      if (tokenHash && type) {
        // New method using token_hash
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          console.error('Token hash verification error:', error);
          throw error;
        }

        if (data.user && data.session) {
          console.log('Email verified successfully with token hash:', data.user);
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }
      }

      // Fallback to access_token method
      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (data.user) {
          console.log('Email verified successfully with session:', data.user);
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }
      }

      // Check if user is already verified but just needs to be logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User is already verified:', user);
        setStatus('success');
        setMessage('Your email is already verified! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
        return;
      }

      // If we get here, verification failed
      throw new Error('Unable to verify email with provided parameters');

    } catch (error: any) {
      console.error('Email verification error:', error);
      setStatus('error');
      
      // Provide more specific error messages
      if (error.message?.includes('expired')) {
        setMessage('The verification link has expired. Please request a new verification email.');
      } else if (error.message?.includes('invalid')) {
        setMessage('The verification link is invalid. Please try requesting a new verification email.');
      } else if (error.message?.includes('already_verified') || error.message?.includes('Email link is invalid or has expired')) {
        // User might already be verified, let them try to login
        setMessage('Your email may already be verified. Please try logging in to your account.');
      } else {
        setMessage('Email verification failed. The link may be invalid or expired. Please try requesting a new verification email.');
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleEmailVerification();
  };

  const handleResendVerification = () => {
    navigate('/register', { 
      state: { 
        message: 'Please enter your email to receive a new verification link.' 
      } 
    });
  };

  const handleGoToLogin = () => {
    navigate('/login', {
      state: {
        message: 'Your email may already be verified. Please try logging in.'
      }
    });
  };

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
                    {message}
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
                    Verification Issue
                  </h2>
                  <p className="text-white/80 mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    {/* Try Login Button - Primary action if user might already be verified */}
                    {message.includes('already be verified') && (
                      <Button
                        onClick={handleGoToLogin}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        Try Logging In
                      </Button>
                    )}
                    
                    {/* Retry Button - Only show if we haven't tried too many times */}
                    {retryCount < 2 && !message.includes('already be verified') && (
                      <Button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                        icon={<RefreshCw className="h-4 w-4 mr-2" />}
                      >
                        Try Again
                      </Button>
                    )}
                    
                    {/* Resend Verification Email */}
                    <Button
                      onClick={handleResendVerification}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      Request New Verification Email
                    </Button>
                    
                    {/* Go to Login - Secondary option */}
                    {!message.includes('already be verified') && (
                      <Button
                        onClick={handleGoToLogin}
                        variant="outline"
                        className="w-full border border-white/30 text-white hover:bg-white/10 font-medium py-2 px-4 rounded-md transition-all duration-200"
                      >
                        Go to Login
                      </Button>
                    )}
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