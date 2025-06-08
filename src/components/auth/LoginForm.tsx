import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [showExpiredLinkMessage, setShowExpiredLinkMessage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  const { login, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  // Check URL parameters for verification status or errors
  useEffect(() => {
    const verified = searchParams.get('verified');
    const errorParam = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    console.log('🔍 URL params:', { verified, errorParam, errorCode, errorDescription });

    if (verified === 'true') {
      console.log('✅ Email verification successful');
      setShowVerificationSuccess(true);
      // Remove the parameter from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('verified');
      navigate(`/login?${newSearchParams.toString()}`, { replace: true });
    } else if (errorParam === 'access_denied' && errorCode === 'otp_expired') {
      console.log('⏰ Verification link expired');
      setShowExpiredLinkMessage(true);
      setError('Your verification link has expired. Please request a new verification email below.');
      setShowResendVerification(true);
      // Clean up URL
      navigate('/login', { replace: true });
    } else if (errorParam) {
      console.log('❌ Verification error:', errorParam, errorDescription);
      setError('There was an issue with your verification link. Please try signing in or request a new verification email.');
      setShowResendVerification(true);
      // Clean up URL
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendVerification(false);
    setShowVerificationSuccess(false);
    setShowExpiredLinkMessage(false);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
      
      // Show resend verification option if email not confirmed
      if (errorMessage.includes('verify your email') || 
          errorMessage.includes('Email not confirmed') ||
          errorMessage.includes('verification link has expired')) {
        setShowResendVerification(true);
      }
      
      console.error('❌ Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      await resendVerificationEmail(email);
      setError('New verification email sent! Please check your inbox and click the verification link.');
      setShowResendVerification(false);
      setShowExpiredLinkMessage(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: '' }));
    }
    if (error && !showExpiredLinkMessage) {
      setError('');
      setShowResendVerification(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
    if (error && !showExpiredLinkMessage) {
      setError('');
      setShowResendVerification(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 transform transition-all duration-300 scale-90 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Successful!
              </h3>
              <p className="text-gray-600">
                Welcome back! Redirecting to your dashboard...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {showVerificationSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm animate-slide-down">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Email verified successfully! You can now sign in to your account.</span>
            </div>
          </div>
        )}

        {showExpiredLinkMessage && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md text-sm animate-slide-down">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Verification Link Expired</h4>
                <p className="mb-3">
                  Your email verification link has expired for security reasons. 
                  Please enter your email address and request a new verification link.
                </p>
                <p className="text-xs">
                  Verification links expire after 24 hours to keep your account secure.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !showExpiredLinkMessage && (
          <div className={`p-3 rounded-md text-sm animate-shake ${
            error.includes('verification email sent') || error.includes('New verification email sent')
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex flex-col space-y-2">
              <span>{error}</span>
              {showResendVerification && !error.includes('verification email sent') && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="text-left text-blue-600 hover:text-blue-700 font-medium underline text-sm flex items-center"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Request new verification email'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="relative">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            required
            placeholder="your.email@example.com"
            error={validationErrors.email}
          />
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              required
              placeholder="••••••••"
              error={validationErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {showResendVerification && showExpiredLinkMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Need a new verification email?
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Enter your email address above and click the button below to receive a fresh verification link.
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isLoading || !email.trim()}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send New Verification Email'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginForm;