import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import AuthInput from '../components/ui/AuthInput';
import Card, { CardContent } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Set the session with the tokens from the URL
    const setSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    setSession();
  }, [accessToken, refreshToken]);

  const validateForm = () => {
    const errors = {
      password: '',
      confirmPassword: '',
    };

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value);
      if (validationErrors.password) {
        setValidationErrors(prev => ({ ...prev, password: '' }));
      }
    } else {
      setConfirmPassword(value);
      if (validationErrors.confirmPassword) {
        setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  if (isSuccess) {
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
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-green-400/30">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                  Password Reset Successful!
                </h2>
                <p className="text-white/80 mb-4">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>
                <p className="text-sm text-white/60">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

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
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cyan-400/30">
                <Lock className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                Reset Your Password
              </h2>
              <p className="text-white/80">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm mb-6 animate-shake backdrop-blur-sm border border-red-400/30">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <AuthInput
                  label="New Password"
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
                      password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
                        ? <span className="text-green-400 font-medium">Strong</span>
                        : password.length >= 6
                        ? <span className="text-yellow-400 font-medium">Medium</span>
                        : <span className="text-red-400 font-medium">Weak</span>
                    }
                  </div>
                )}
              </div>

              <div className="relative">
                <AuthInput
                  label="Confirm New Password"
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

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                disabled={isLoading}
              >
                {/* Responsive button text - shorter on mobile */}
                <span className="block sm:hidden">{isLoading ? 'Updating...' : 'Update'}</span>
                <span className="hidden sm:block">{isLoading ? 'Updating Password...' : 'Update Password'}</span>
              </Button>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ResetPasswordPage;