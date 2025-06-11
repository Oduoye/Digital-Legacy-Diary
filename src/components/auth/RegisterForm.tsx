import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
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
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register(name.trim(), email.trim(), password, selectedTier);
      setShowSuccessMessage(true);
      
      // User is automatically logged in, redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
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
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-6 transform transition-all duration-300 scale-90 animate-scale-in relative">
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Account Created Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                Welcome to Digital Legacy Diary! You're now logged in and ready to start preserving your memories.
              </p>
              <Button onClick={handleCloseSuccess} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm animate-shake backdrop-blur-sm border border-red-400/30">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          icon={<User className="h-5 w-5 text-white/60" />}
          required
          placeholder="John Doe"
          error={validationErrors.name}
        />

        <Input
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
          <Input
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
          <Input
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
            <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
              Privacy Policy
            </a>
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