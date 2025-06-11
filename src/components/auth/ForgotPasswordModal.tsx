import React, { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle, X } from 'lucide-react';
import Button from '../ui/Button';
import AuthInput from '../ui/AuthInput';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get the correct redirect URL based on environment
const getRedirectUrl = (path: string = '/reset-password') => {
  // Check if we're in production (Netlify)
  if (window.location.hostname === 'digitallegacydiary.netlify.app') {
    return `https://digitallegacydiary.netlify.app${path}`;
  }
  
  // Check for other production domains
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}${path}`;
  }
  
  // Default to current origin for development
  return `${window.location.origin}${path}`;
};

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl('/reset-password'),
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
        setValidationError('');
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setError('');
    setValidationError('');
    setIsSuccess(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (validationError) {
      setValidationError('');
    }
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 animate-scale-in relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Reset Email Sent!
            </h3>
            <p className="text-white/80 mb-4">
              We've sent password reset instructions to <strong className="text-cyan-400">{email}</strong>.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-white/90">
                    Check your inbox and click the reset link to create a new password. 
                    The link will expire in 1 hour for security reasons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cyan-400/30">
                <Mail className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Reset Your Password
              </h3>
              <p className="text-white/80">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm mb-4 animate-shake backdrop-blur-sm border border-red-400/30">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <AuthInput
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
              required
              icon={<Mail className="h-5 w-5 text-white/60" />}
              error={validationError}
            />

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/70">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Back to login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;