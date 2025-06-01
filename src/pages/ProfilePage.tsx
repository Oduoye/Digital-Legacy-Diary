import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Twitter, Linkedin, Facebook, Instagram, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and social links</p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Card */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-gray-900">Profile Picture</h2>
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
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
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
                  <h3 className="text-lg font-medium text-gray-900">{currentUser?.name}</h3>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="animate-fade-in-up [animation-delay:200ms]">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
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
                  />
                  
                  <Textarea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="h-32"
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                    <Input
                      icon={<Twitter className="h-5 w-5 text-gray-400" />}
                      placeholder="Twitter profile URL"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                      })}
                    />
                    <Input
                      icon={<Linkedin className="h-5 w-5 text-gray-400" />}
                      placeholder="LinkedIn profile URL"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                    />
                    <Input
                      icon={<Facebook className="h-5 w-5 text-gray-400" />}
                      placeholder="Facebook profile URL"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                      })}
                    />
                    <Input
                      icon={<Instagram className="h-5 w-5 text-gray-400" />}
                      placeholder="Instagram profile URL"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="mt-1 text-gray-900">
                      {currentUser?.bio || 'No bio added yet.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentUser?.socialLinks?.twitter && (
                        <a
                          href={currentUser.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
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
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
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
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
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
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                        >
                          <Instagram className="h-5 w-5" />
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;