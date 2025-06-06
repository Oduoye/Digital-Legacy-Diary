import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendOtp(email);
      setIsOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please check your email and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(email, otp);
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
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

      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm animate-shake">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          required
          placeholder="your.email@example.com"
          disabled={isOtpSent}
        />

        {isOtpSent && (
          <div className="animate-fade-in">
            <Input
              label="One-Time Password"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter the code sent to your email"
              className="text-center tracking-[0.5em] font-mono text-lg"
              maxLength={6}
            />
            <p className="mt-2 text-sm text-gray-500">
              Please check your email for the verification code.
            </p>
          </div>
        )}

        <div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full"
          >
            {isOtpSent ? 'Verify Code' : 'Send Code'}
          </Button>
        </div>

        {isOtpSent && (
          <div className="text-center animate-fade-in">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              Didn't receive the code? Send again
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default LoginForm;