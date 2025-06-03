import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { SubscriptionTier } from '../../types';

interface RegisterFormProps {
  onComplete: () => void;
  selectedTier: SubscriptionTier['id'];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onComplete, selectedTier }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    setIsLoading(true);

    try {
      await register(name, email, password, selectedTier);
      setShowSuccessMessage(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return null;
  }

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 transform transition-all duration-300 scale-90 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600">
                Your account has been created. Welcome to Digital Legacy Diary!
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-5 w-5 text-gray-400" />}
          required
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          required
          placeholder="your.email@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          required
          placeholder="••••••••"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          required
          placeholder="••••••••"
        />
        <div>
          <Button type="submit" isLoading={isLoading} className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;