import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader, RefreshCw, Mail } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const EmailVerificationCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    handleEmailVerification();
  }, []);

  const handleEmailVerification = async () => {
    try {
      setStatus('loading');
      setMessage('Verifying your email address...');

      // Get URL parameters
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const tokenHash = searchParams.get('token_hash');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const code = searchParams.get('code');

      console.log('Email verification params:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        type, 
        hasTokenHash: !!tokenHash,
        hasCode: !!code,
        error,
        errorDescription
      });

      // Handle error from URL params first
      if (error) {
        console.error('URL error:', error, errorDescription);
        setStatus('error');
        
        if (error === 'access_denied' || errorDescription?.includes('expired')) {
          setMessage('The verification link has expired. Please request a new verification email.');
        } else if (error === 'invalid_request' || errorDescription?.includes('invalid')) {
          setMessage('The verification link is invalid. Please try requesting a new verification email.');
        } else {
          setMessage('Email verification failed. The link may be invalid or expired. Please try requesting a new verification email.');
        }
        return;
      }

      // Check if user is already verified first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && currentUser.email_confirmed_at) {
        console.log('User is already verified:', currentUser);
        setUserEmail(currentUser.email || '');
        setStatus('success');
        setMessage('Your email is already verified! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
        return;
      }

      // Modern Supabase auth flow - use exchangeCodeForSession if we have a code
      if (code) {
        console.log('Using modern auth flow with code exchange');
        
        const { data, error: codeError } = await supabase.auth.exchangeCodeForSession(code);

        if (codeError) {
          console.error('Code exchange error:', codeError);
          
          if (codeError.message?.includes('expired') || codeError.message?.includes('invalid')) {
            setStatus('error');
            setMessage('The verification link has expired or is invalid. Please request a new verification email.');
            return;
          }
          
          throw codeError;
        }

        if (data.user && data.session) {
          console.log('Email verified successfully with code exchange:', data.user);
          setUserEmail(data.user.email || '');
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }
      }

      // Fallback: Handle token_hash method (newer Supabase versions)
      if (tokenHash && type) {
        console.log('Using token hash verification');
        
        const { data, error: hashError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (hashError) {
          console.error('Token hash verification error:', hashError);
          
          if (hashError.message?.includes('expired') || hashError.message?.includes('invalid')) {
            setStatus('error');
            setMessage('The verification link has expired or is invalid. Please request a new verification email.');
            return;
          }
          
          throw hashError;
        }

        if (data.user && data.session) {
          console.log('Email verified successfully with token hash:', data.user);
          setUserEmail(data.user.email || '');
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }
      }

      // Legacy fallback: access_token method
      if (accessToken && refreshToken) {
        console.log('Using legacy access token method');
        
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          
          if (sessionError.message?.includes('expired') || sessionError.message?.includes('invalid')) {
            setStatus('error');
            setMessage('The verification link has expired or is invalid. Please request a new verification email.');
            return;
          }
          
          throw sessionError;
        }

        if (data.user) {
          console.log('Email verified successfully with session:', data.user);
          setUserEmail(data.user.email || '');
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to dashboard...');
          
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }
      }

      // If no verification parameters are present
      if (!code && !tokenHash && !accessToken && !refreshToken) {
        console.error('No verification parameters found in URL');
        setStatus('error');
        setMessage('The verification link appears to be incomplete. Please try requesting a new verification email.');
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

  const handleResendVerification = async () => {
    const emailFromParams = searchParams.get('email');
    const emailToUse = emailFromParams || userEmail;
    
    if (!emailToUse) {
      navigate('/register', { 
        state: { 
          message: 'Please enter your email to receive a new verification link.' 
        } 
      });
      return;
    }

    setIsResendingEmail(true);
    setResendSuccess(false);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error resending verification email:', err);
      setMessage('Failed to resend verification email. Please try again or contact support.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', {
      state: {
        message: 'Your email may already be verified. Please try logging in.'
      }
    });
  };

  const handleGoToRegister = () => {
    navigate('/register', { 
      state: { 
        message: 'Please enter your email to receive a new verification link.' 
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

                  {resendSuccess && (
                    <div className="bg-green-500/20 text-green-200 p-3 rounded-md text-sm mb-4 animate-slide-down backdrop-blur-sm border border-green-400/30">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Verification email sent successfully! Please check your inbox.</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {retryCount < 2 && !message.includes('already be verified') && (
                      <Button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                        icon={<RefreshCw className="h-4 w-4 mr-2" />}
                      >
                        Try Again
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleResendVerification}
                      isLoading={isResendingEmail}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                      icon={<Mail className="h-4 w-4 mr-2" />}
                    >
                      {isResendingEmail ? 'Sending...' : 'Request New Verification Email'}
                    </Button>
                    
                    {message.includes('already be verified') ? (
                      <Button
                        onClick={handleGoToLogin}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        Try Logging In
                      </Button>
                    ) : (
                      <Button
                        onClick={handleGoToLogin}
                        variant="outline"
                        className="w-full border border-white/30 text-white hover:bg-white/10 font-medium py-2 px-4 rounded-md transition-all duration-200"
                      >
                        Go to Login
                      </Button>
                    )}

                    <Button
                      onClick={handleGoToRegister}
                      variant="outline"
                      className="w-full border border-white/30 text-white hover:bg-white/10 font-medium py-2 px-4 rounded-md transition-all duration-200"
                    >
                      Start Over - Register Again
                    </Button>
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