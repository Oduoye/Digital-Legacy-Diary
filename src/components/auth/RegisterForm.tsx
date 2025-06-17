import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, X, Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthInput from '../ui/AuthInput';
import Button from '../ui/Button';
import { SubscriptionTier } from '../../types';

interface RegisterFormProps {
  selectedTier: SubscriptionTier['id'];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ selectedTier }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, resendVerificationEmail } = useAuth();
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password, selectedTier);
      
      if (result.emailConfirmationRequired) {
        setRegisteredEmail(email.trim());
        setEmailConfirmationRequired(true);
      } else {
        setShowSuccessMessage(true);
        // User is automatically logged in, redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    setError('');
    
    try {
      await resendVerificationEmail(registeredEmail);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    navigate('/dashboard');
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        if (validationErrors.name) {
          setValidationErrors(prev => ({ ...prev, name: '' }));
        }
        break;
      case 'email':
        setEmail(value);
        if (validationErrors.email) {
          setValidationErrors(prev => ({ ...prev, email: '' }));
        }
        break;
      case 'password':
        setPassword(value);
        if (validationErrors.password) {
          setValidationErrors(prev => ({ ...prev, password: '' }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (validationErrors.confirmPassword) {
          setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
        break;
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Email Verification Required Modal
  if (emailConfirmationRequired) {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cyan-400/30">
          <Mail className="h-8 w-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Check Your Email
        </h3>
        <p className="text-white/80 mb-4">
          We've sent a verification link to <strong className="text-cyan-400">{registeredEmail}</strong>
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-white/90 mb-2">
                <strong>Next Steps:</strong>
              </p>
              <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>You'll be automatically redirected to your dashboard</li>
              </ol>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm mb-4 animate-shake backdrop-blur-sm border border-red-400/30">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-500/20 text-green-200 p-3 rounded-md text-sm mb-4 animate-slide-down backdrop-blur-sm border border-green-400/30">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Verification email sent successfully!</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            isLoading={isResendingEmail}
            disabled={isResendingEmail}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            icon={<RefreshCw className="h-4 w-4 mr-2" />}
          >
            {isResendingEmail ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          <p className="text-sm text-white/70">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-6 transform transition-all duration-300 scale-90 animate-scale-in relative shadow-2xl">
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30 animate-pulse">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 animate-fade-in-up [animation-delay:200ms]">
                Account Created Successfully!
              </h3>
              <p className="text-white/80 animate-fade-in-up [animation-delay:400ms]">
                Welcome to Digital Legacy Diary! You're now logged in and ready to start preserving your memories.
              </p>
              <Button onClick={handleCloseSuccess} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl">
                Go to Dashboard
              </Button>
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

        <AuthInput
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          icon={<User className="h-5 w-5 text-white/60" />}
          required
          placeholder="John Doe"
          error={validationErrors.name}
        />

        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          icon={<Mail className="h-5 w-5 text-white/60" />}
          required
          placeholder="your.email@example.com"
          error={validationErrors.email}
        />

        <div className="relative">
          <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
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
          {password && (
            <div className="mt-2 text-xs text-white/70">
              Password strength: {
                password.length >= 6
                  ? <span className="text-green-400 font-medium">Good</span>
                  : <span className="text-red-400 font-medium">Too short</span>
              }
            </div>
          )}
        </div>

        <div className="relative">
          <AuthInput
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
            icon={<Lock className="h-5 w-5 text-white/60" />}
            required
            placeholder="••••••••"
            error={validationErrors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-white/60 hover:text-white"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-sm text-white/80">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;