import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Lock, Eye, Download, FileText, Book, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

interface LegacyData {
  user: {
    name: string;
    bio?: string;
    profilePicture?: string;
  };
  entries: any[];
  wills: any[];
  photos: string[];
  message?: string;
}

const LegacyAccessPage: React.FC = () => {
  const { accessCode } = useParams<{ accessCode: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<'verify' | 'register' | 'access'>('verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [legacyData, setLegacyData] = useState<LegacyData | null>(null);
  const [heirInfo, setHeirInfo] = useState({
    name: '',
    email: '',
    relationship: ''
  });

  useEffect(() => {
    if (accessCode) {
      verifyAccessCode();
    }
  }, [accessCode]);

  const verifyAccessCode = async () => {
    if (!accessCode) return;
    
    setLoading(true);
    try {
      // Check if access code exists and is valid
      const { data: accessData, error: accessError } = await supabase
        .from('legacy_access')
        .select(`
          *,
          users!legacy_access_user_id_fkey(name, bio, profile_picture),
          trusted_contacts!legacy_access_contact_id_fkey(name, email, relationship)
        `)
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .single();

      if (accessError || !accessData) {
        setError('Invalid or expired access code. Please contact the family for assistance.');
        return;
      }

      // Check if heir is already registered
      const { data: heirData } = await supabase
        .from('heir_registrations')
        .select('*')
        .eq('access_code', accessCode)
        .single();

      if (heirData && heirData.is_verified) {
        // Heir is already registered, load legacy data
        await loadLegacyData(accessData.user_id);
        setStep('access');
      } else {
        // Heir needs to register
        setStep('register');
      }
    } catch (err) {
      setError('An error occurred while verifying access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const registerHeir = async () => {
    if (!accessCode || !heirInfo.name || !heirInfo.email) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Register the heir
      const { error: regError } = await supabase
        .from('heir_registrations')
        .insert({
          access_code: accessCode,
          name: heirInfo.name,
          email: heirInfo.email,
          relationship: heirInfo.relationship,
          is_verified: true,
          registered_at: new Date().toISOString()
        });

      if (regError) {
        throw regError;
      }

      // Get user ID from access code
      const { data: accessData } = await supabase
        .from('legacy_access')
        .select('user_id')
        .eq('access_code', accessCode)
        .single();

      if (accessData) {
        await loadLegacyData(accessData.user_id);
        setStep('access');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLegacyData = async (userId: string) => {
    try {
      // Load user profile
      const { data: userData } = await supabase
        .from('users')
        .select('name, bio, profile_picture')
        .eq('id', userId)
        .single();

      // Load diary entries
      const { data: entriesData } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Load wills
      const { data: willsData } = await supabase
        .from('wills')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      // Load custom message from dead man's switch
      const { data: switchData } = await supabase
        .from('dead_mans_switches')
        .select('custom_message')
        .eq('user_id', userId)
        .eq('status', 'triggered')
        .single();

      setLegacyData({
        user: userData || { name: 'Unknown' },
        entries: entriesData || [],
        wills: willsData || [],
        photos: [], // Extract from entries
        message: switchData?.custom_message
      });
    } catch (err) {
      console.error('Error loading legacy data:', err);
    }
  };

  const downloadWill = async (will: any) => {
    try {
      // Create a downloadable version of the will
      const willContent = `
LAST WILL AND TESTAMENT
${will.title}

Created: ${new Date(will.created_at).toLocaleDateString()}
Last Updated: ${new Date(will.updated_at).toLocaleDateString()}

${will.content}

---
This document was accessed through Digital Legacy Diary
Access Date: ${new Date().toLocaleDateString()}
      `;

      const blob = new Blob([willContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${will.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading will:', err);
    }
  };

  const exportAllData = async () => {
    if (!legacyData) return;

    try {
      const exportData = {
        user: legacyData.user,
        message: legacyData.message,
        entries: legacyData.entries.map(entry => ({
          title: entry.title,
          content: entry.content,
          date: entry.created_at,
          tags: entry.tags
        })),
        wills: legacyData.wills.map(will => ({
          title: will.title,
          content: will.content,
          created: will.created_at
        })),
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${legacyData.user.name.replace(/[^a-z0-9]/gi, '_')}_legacy_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'verify' && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-serif font-bold text-gray-900">
                    Legacy Access
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Verifying your access to this digital legacy...
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}

          {step === 'register' && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="text-center">
                  <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-serif font-bold text-gray-900">
                    Register for Access
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Please provide your information to access this digital legacy.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Input
                    label="Your Full Name"
                    value={heirInfo.name}
                    onChange={(e) => setHeirInfo({ ...heirInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={heirInfo.email}
                    onChange={(e) => setHeirInfo({ ...heirInfo, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                  
                  <Input
                    label="Relationship"
                    value={heirInfo.relationship}
                    onChange={(e) => setHeirInfo({ ...heirInfo, relationship: e.target.value })}
                    placeholder="e.g., Son, Daughter, Friend"
                  />

                  <Button
                    onClick={registerHeir}
                    isLoading={loading}
                    className="w-full"
                  >
                    Access Legacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'access' && legacyData && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {legacyData.user.profilePicture ? (
                    <img
                      src={legacyData.user.profilePicture}
                      alt={legacyData.user.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-2xl font-serif text-primary-600">
                        {legacyData.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                  {legacyData.user.name}'s Digital Legacy
                </h1>
                {legacyData.user.bio && (
                  <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    {legacyData.user.bio}
                  </p>
                )}
              </div>

              {/* Personal Message */}
              {legacyData.message && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">
                      Personal Message for You
                    </h2>
                    <p className="text-gray-700 italic leading-relaxed">
                      "{legacyData.message}"
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={exportAllData}
                  icon={<Download className="h-5 w-5" />}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Export All Data
                </Button>
              </div>

              {/* Content Sections */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Diary Entries */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center">
                      <Book className="h-6 w-6 mr-2 text-primary-600" />
                      Journal Entries ({legacyData.entries.length})
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {legacyData.entries.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {legacyData.entries.slice(0, 5).map((entry, index) => (
                          <div key={index} className="border-l-4 border-primary-200 pl-4">
                            <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 text-sm line-clamp-3">
                              {entry.content.substring(0, 150)}...
                            </p>
                          </div>
                        ))}
                        {legacyData.entries.length > 5 && (
                          <p className="text-sm text-gray-500 text-center">
                            And {legacyData.entries.length - 5} more entries...
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No journal entries available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Wills */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center">
                      <FileText className="h-6 w-6 mr-2 text-primary-600" />
                      Legal Documents ({legacyData.wills.length})
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {legacyData.wills.length > 0 ? (
                      <div className="space-y-4">
                        {legacyData.wills.map((will, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{will.title}</h3>
                                <p className="text-sm text-gray-600">
                                  Created: {new Date(will.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadWill(will)}
                                  icon={<Download className="h-4 w-4" />}
                                >
                                  Download
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                              {will.content.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No legal documents available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm">
                <p>This legacy was preserved with Digital Legacy Diary</p>
                <p>Accessed on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {error && step === 'verify' && (
            <Card className="max-w-md mx-auto">
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LegacyAccessPage;