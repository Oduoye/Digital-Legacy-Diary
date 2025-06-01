import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { currentUser, logout, updateProfile, updatePassword, updateEmail, deactivateAccount, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const updates = {
        name: formData.get('fullName') as string,
        email: formData.get('email') as string,
      };

      if (updates.email !== currentUser?.email) {
        await updateEmail(updates.email, 'password');
      }

      updateProfile(updates);
      setShowSuccessMessage('Profile updated successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const currentPassword = formData.get('currentPassword') as string;
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      await updatePassword(currentPassword, newPassword);
      setShowSuccessMessage('Password updated successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      form.reset();
    } catch (err) {
      setError('Failed to update password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount();
      navigate('/login');
    } catch (err) {
      setError('Failed to deactivate account. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Account Settings</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md animate-shake">
            {error}
          </div>
        )}

        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md animate-slide-down">
            {showSuccessMessage}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center">
                <User className="mr-2 h-5 w-5 text-primary-500" />
                Profile Information
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  defaultValue={currentUser?.name}
                  placeholder="Your full name"
                  name="fullName"
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  defaultValue={currentUser?.email}
                  placeholder="your.email@example.com"
                  name="email"
                  required
                />
                
                <div className="mt-4">
                  <Button 
                    type="submit" 
                    isLoading={loading}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Password Settings */}
          <Card className="animate-fade-in-up [animation-delay:200ms]">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center">
                <Lock className="mr-2 h-5 w-5 text-primary-500" />
                Password & Security
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  name="currentPassword"
                  required
                />
                
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  name="newPassword"
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  required
                />
                
                <div className="mt-4">
                  <Button 
                    type="submit" 
                    isLoading={loading}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Account Actions */}
          <Card className="animate-fade-in-up [animation-delay:400ms]">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-gray-900">Account Actions</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Need to take a break or leave the service? You can temporarily deactivate your account or permanently delete all your data.
              </p>
              
              <div className="flex flex-col space-y-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeactivateModal(true)}
                  className="transform transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  Deactivate Account
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => setShowDeleteModal(true)}
                  className="transform transition-all duration-200 hover:bg-red-700 hover:scale-105 active:scale-95"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={handleLogout}
                icon={<LogOut size={16} />}
              >
                Log Out of Your Account
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Deactivate Account Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deactivate Account
                </h3>
                <p className="text-gray-600 mb-6">
                  Your account will be temporarily deactivated. You can reactivate it at any time by logging back in.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeactivateModal(false)}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeactivateAccount}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Account Permanently
                </h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. All your data, including journal entries and contacts, will be permanently deleted.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    className="transform transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
                  >
                    Delete Forever
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SettingsPage;