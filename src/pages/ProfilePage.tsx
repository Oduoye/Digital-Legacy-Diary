import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Twitter, Linkedin, Facebook, Instagram, ArrowLeft, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import SuccessModal from '../components/ui/SuccessModal';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    socialLinks: {
      twitter: currentUser?.socialLinks?.twitter || '',
      linkedin: currentUser?.socialLinks?.linkedin || '',
      facebook: currentUser?.socialLinks?.facebook || '',
      instagram: currentUser?.socialLinks?.instagram || '',
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real app, this would upload to a storage service
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            await updateProfile({ profilePicture: reader.result as string });
            setSuccessMessage('Profile picture updated successfully!');
            setShowSuccessModal(true);
          } catch (err: any) {
            setError('Failed to update profile picture. Please try again.');
            console.error('Profile picture update error:', err);
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError('Failed to process image. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessModal(true);
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setFormData({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      socialLinks: {
        twitter: currentUser?.socialLinks?.twitter || '',
        linkedin: currentUser?.socialLinks?.linkedin || '',
        facebook: currentUser?.socialLinks?.facebook || '',
        instagram: currentUser?.socialLinks?.instagram || '',
      }
    });
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">Your Profile</h1>
            <p className="text-white/80 mt-2">Manage your personal information and social links</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 text-red-200 p-4 rounded-md animate-shake backdrop-blur-sm border border-red-400/30">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Picture Card */}
            <Card className="animate-fade-in-up backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white">Profile Picture</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                      {currentUser?.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50">
                          <span className="text-4xl font-serif text-primary-600">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Camera className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-white">{currentUser?.name}</h3>
                    <p className="text-sm text-white/70">{currentUser?.email}</p>
                    {isLoading && (
                      <p className="text-sm text-blue-400 mt-1">Updating profile picture...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card className="animate-fade-in-up [animation-delay:200ms] backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-serif font-semibold text-white">Profile Information</h2>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    
                    <Textarea
                      label="Bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="h-32"
                      disabled={isLoading}
                    />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Social Links</h3>
                      <Input
                        icon={<Twitter className="h-5 w-5 text-gray-400" />}
                        placeholder="Twitter profile URL"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                        })}
                        disabled={isLoading}
                      />
                      <Input
                        icon={<Linkedin className="h-5 w-5 text-gray-400" />}
                        placeholder="LinkedIn profile URL"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                        })}
                        disabled={isLoading}
                      />
                      <Input
                        icon={<Facebook className="h-5 w-5 text-gray-400" />}
                        placeholder="Facebook profile URL"
                        value={formData.socialLinks.facebook}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                        })}
                        disabled={isLoading}
                      />
                      <Input
                        icon={<Instagram className="h-5 w-5 text-gray-400" />}
                        placeholder="Instagram profile URL"
                        value={formData.socialLinks.instagram}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                        })}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
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
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-white/70">Bio</h3>
                      <p className="mt-1 text-white">
                        {currentUser?.bio || 'No bio added yet.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentUser?.socialLinks?.twitter && (
                          <a
                            href={currentUser.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white"
                          >
                            <Twitter className="h-5 w-5" />
                            <span>Twitter</span>
                          </a>
                        )}
                        {currentUser?.socialLinks?.linkedin && (
                          <a
                            href={currentUser.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white"
                          >
                            <Linkedin className="h-5 w-5" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {currentUser?.socialLinks?.facebook && (
                          <a
                            href={currentUser.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white"
                          >
                            <Facebook className="h-5 w-5" />
                            <span>Facebook</span>
                          </a>
                        )}
                        {currentUser?.socialLinks?.instagram && (
                          <a
                            href={currentUser.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white"
                          >
                            <Instagram className="h-5 w-5" />
                            <span>Instagram</span>
                          </a>
                        )}
                      </div>
                      {!currentUser?.socialLinks?.twitter && 
                       !currentUser?.socialLinks?.linkedin && 
                       !currentUser?.socialLinks?.facebook && 
                       !currentUser?.socialLinks?.instagram && (
                        <p className="text-white/60 text-sm">No social links added yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Profile Updated!"
            message={successMessage}
          />
        </div>
      </Layout>
    </div>
  );
};

export default ProfilePage;