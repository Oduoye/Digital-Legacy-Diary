import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SuccessModal from '../components/ui/SuccessModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { currentUser, logout, updateProfile, updatePassword, updateEmail, deactivateAccount, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successAction, setSuccessAction] = useState<'deactivate' | 'delete' | 'update' | ''>('');
  
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
        await updateEmail(updates.email);
      }

      await updateProfile(updates);
      setSuccessAction('update');
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessModal(true);
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
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      await updatePassword(newPassword);
      setSuccessAction('update');
      setSuccessMessage('Password updated successfully!');
      setShowSuccessModal(true);
      form.reset();
    } catch (err) {
      setError('Failed to update password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setShowDeactivateModal(false);
      await deactivateAccount();
      setSuccessAction('deactivate');
      setSuccessMessage('Your account has been successfully deactivated. You can reactivate it anytime by logging back in.');
      setShowSuccessModal(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError('Failed to deactivate account. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setShowDeleteModal(false);
      await deleteAccount();
      setSuccessAction('delete');
      setSuccessMessage('Your account and all associated data have been permanently deleted. Thank you for using Digital Legacy Diary.');
      setShowSuccessModal(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    }
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-serif font-bold text-white mb-8">Account Settings</h1>
          
          {error && (
            <div className="mb-6 bg-red-500/20 text-red-200 p-4 rounded-md animate-shake backdrop-blur-sm border border-red-400/30">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="animate-fade-in-up backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary-400" />
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
                      className="transform transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Password Settings */}
            <Card className="animate-fade-in-up [animation-delay:200ms] backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary-400" />
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
                      className="transform transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Account Actions */}
            <Card className="animate-fade-in-up [animation-delay:400ms] backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white">Account Actions</h2>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6">
                  Need to take a break or leave the service? You can temporarily deactivate your account or permanently delete all your data.
                </p>
                
                <div className="space-y-6">
                  {/* Information Box */}
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-white/80">
                        <p className="font-medium mb-2 text-white">Important Information:</p>
                        <div className="space-y-1">
                          <p><strong>Deactivate:</strong> Temporarily disables your account. You can reactivate by logging back in. Your data will be preserved.</p>
                          <p><strong>Delete:</strong> Permanently removes all your data including journal entries, contacts, and personal information. This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeactivateModal(true)}
                      className="w-full bg-yellow-500/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-500/30 transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Deactivate Account
                    </Button>
                    
                    <Button 
                      variant="danger" 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full bg-red-600 text-white hover:bg-red-700 transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Delete Account Permanently
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/5">
                <Button 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transform transition-all duration-200 hover:scale-105 active:scale-95"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Deactivate Account
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your account will be temporarily deactivated. You can reactivate it at any time by logging back in. Your data will be preserved.
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
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 transform transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={handleDeactivateAccount}
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Account Permanently
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This action cannot be undone. All your data, including journal entries, trusted contacts, and personal information will be permanently deleted from our servers.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          <strong>Warning:</strong> This will permanently delete all your memories, stories, and legacy content. This action is irreversible.
                        </p>
                      </div>
                    </div>
                  </div>
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
                      className="transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title={
              successAction === 'deactivate' ? 'Account Deactivated Successfully!' :
              successAction === 'delete' ? 'Account Deleted Successfully!' :
              'Settings Updated Successfully!'
            }
            message={successMessage}
            autoClose={successAction === 'update'}
            autoCloseDelay={successAction === 'update' ? 3000 : 4000}
          />
        </div>
      </Layout>
    </div>
  );
};

export default SettingsPage;