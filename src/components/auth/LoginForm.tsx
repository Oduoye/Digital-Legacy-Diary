import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, AlertTriangle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthInput from '../ui/AuthInput';
import Button from '../ui/Button';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showInvalidCredentialsHelp, setShowInvalidCredentialsHelp] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a message from the verification callback
  const callbackMessage = location.state?.message;

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
    setShowInvalidCredentialsHelp(false);
    
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
      let errorMessage = err.message || 'Invalid email or password. Please try again.';
      
      // Handle specific error cases
      if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in. Check your inbox for a verification link.';
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'The email or password you entered is incorrect.';
        setShowInvalidCredentialsHelp(true);
      }
      
      setError(errorMessage);
      console.error('❌ Login error:', err);
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
    if (error) {
      setError('');
      setShowInvalidCredentialsHelp(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
    if (error) {
      setError('');
      setShowInvalidCredentialsHelp(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/70 hover:text-white transition-colors"
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
        {/* Show callback message if present */}
        {callbackMessage && (
          <div className="bg-blue-500/20 text-blue-200 p-3 rounded-md text-sm mb-4 backdrop-blur-sm border border-blue-400/30">
            <div className="flex items-start space-x-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{callbackMessage}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm animate-shake backdrop-blur-sm border border-red-400/30">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Help message for invalid credentials */}
        {showInvalidCredentialsHelp && (
          <div className="bg-amber-500/20 text-amber-200 p-4 rounded-md text-sm backdrop-blur-sm border border-amber-400/30">
            <h4 className="font-medium mb-2">Need help signing in?</h4>
            <ul className="space-y-1 text-xs">
              <li>• Double-check your email address for typos</li>
              <li>• Make sure you're using the correct password</li>
              <li>• If you forgot your password, use the "Forgot your password?" link below</li>
              <li>• If you don't have an account yet, you'll need to register first</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs bg-amber-400/20 hover:bg-amber-400/30 px-2 py-1 rounded transition-colors"
              >
                Reset Password
              </button>
              <Link
                to="/register"
                className="text-xs bg-cyan-400/20 hover:bg-cyan-400/30 px-2 py-1 rounded transition-colors inline-flex items-center gap-1"
              >
                <UserPlus className="h-3 w-3" />
                Create Account
              </Link>
            </div>
          </div>
        )}

        <div className="relative">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            icon={<Mail className="h-5 w-5 text-white/60" />}
            required
            placeholder="your.email@example.com"
            error={validationErrors.email}
          />
        </div>

        <div className="space-y-1">
          <div className="relative">
            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              icon={<Lock className="h-5 w-5 text-white/60" />}
              required
              placeholder="••••••••"
              error={validationErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-white/60 hover:text-white"
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
              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <p className="text-white/70 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginForm;