import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, X, ArrowLeft, Shield, Crown, CheckCircle, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import TrustedContactForm from '../components/contacts/TrustedContactForm';
import TrustedContactCard from '../components/contacts/TrustedContactCard';
import DeadMansSwitchModal from '../components/contacts/DeadMansSwitchModal';
import WillUploadModal from '../components/contacts/WillUploadModal';
import SuccessModal from '../components/ui/SuccessModal';
import { useDiary } from '../context/DiaryContext';
import { TrustedContact, DeadMansSwitch, Will } from '../types';

const ContactsPage: React.FC = () => {
  const { trustedContacts, addTrustedContact, removeTrustedContact, updateTrustedContact } = useDiary();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const [showDeadMansSwitchModal, setShowDeadMansSwitchModal] = useState(false);
  const [showWillUploadModal, setShowWillUploadModal] = useState(false);
  const [currentSwitch, setCurrentSwitch] = useState<DeadMansSwitch | null>(null);
  const [currentWill, setCurrentWill] = useState<Will | null>(null);
  const [showFeatureMessage, setShowFeatureMessage] = useState(false);
  const [deleteModalContact, setDeleteModalContact] = useState<TrustedContact | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleAddSubmit = async (contact: Omit<TrustedContact, 'id'>) => {
    try {
      await addTrustedContact(contact);
      setShowAddForm(false);
      
      // Show success message
      setSuccessTitle('Contact Added Successfully!');
      setSuccessMessage(`${contact.name} has been added to your trusted contacts. They will be able to access your digital legacy when the time comes.`);
      setShowSuccessModal(true);
      
      setTimeout(() => setShowSuccessModal(false), 4000);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };
  
  const handleEditSubmit = async (contact: Omit<TrustedContact, 'id'>) => {
    if (editingContact) {
      try {
        await updateTrustedContact(editingContact.id, contact);
        setEditingContact(null);
        
        // Show success message
        setSuccessTitle('Contact Updated Successfully!');
        setSuccessMessage(`${contact.name}'s information has been updated in your trusted contacts.`);
        setShowSuccessModal(true);
        
        setTimeout(() => setShowSuccessModal(false), 3000);
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    }
  };
  
  const handleEditCancel = () => {
    setEditingContact(null);
  };
  
  const handleAddCancel = () => {
    setShowAddForm(false);
  };
  
  const handleEdit = (contact: TrustedContact) => {
    setEditingContact(contact);
    setShowAddForm(false);
  };
  
  const handleShowDeleteModal = (contact: TrustedContact) => {
    setDeleteModalContact(contact);
  };

  const handleDelete = async () => {
    if (deleteModalContact) {
      setIsDeleting(true);
      try {
        await removeTrustedContact(deleteModalContact.id);
        
        // Show success message
        setSuccessTitle('Contact Removed Successfully!');
        setSuccessMessage(`${deleteModalContact.name} has been removed from your trusted contacts.`);
        setShowSuccessModal(true);
        
        setDeleteModalContact(null);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } catch (error) {
        console.error('Error deleting contact:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeadMansSwitchClick = () => {
    setShowFeatureMessage(true);
    setTimeout(() => {
      setShowFeatureMessage(false);
      setShowDeadMansSwitchModal(true);
    }, 3000);
  };

  const handleSaveSwitch = (data: Partial<DeadMansSwitch>) => {
    console.log('Saving Dead Man\'s Switch:', data);
    setShowDeadMansSwitchModal(false);
    
    // Show success message
    setSuccessTitle('Dead Man\'s Switch Configured!');
    setSuccessMessage('Your automated legacy transfer system has been set up successfully. Your trusted contacts will be notified if you don\'t check in as scheduled.');
    setShowSuccessModal(true);
    
    setTimeout(() => setShowSuccessModal(false), 4000);
  };

  const handleSaveWill = (data: Partial<Will>) => {
    console.log('Saving Will:', data);
    setShowWillUploadModal(false);
    
    // Show success message
    setSuccessTitle('Will Uploaded Successfully!');
    setSuccessMessage('Your will has been securely stored and will be accessible to your trusted contacts when needed.');
    setShowSuccessModal(true);
    
    setTimeout(() => setShowSuccessModal(false), 4000);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-8 animate-fade-in">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Trusted Contacts</h1>
                <p className="text-white/80">People who will receive your legacy</p>
              </div>
              {!showAddForm && !editingContact && (
                <Button
                  icon={<UserPlus size={18} />}
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 sm:mt-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                >
                  Add Contact
                </Button>
              )}
            </div>
          </div>
          
          {/* Information cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Legacy Access Card */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 animate-fade-in-up [animation-delay:200ms]">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-primary-100 p-3">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Legacy Access Information</h3>
                    <p className="text-white/80 mt-1">
                      Your Trusted Contacts are the people you designate to receive access to your Digital Legacy Diary when the time comes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legacy Protection Card */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 animate-fade-in-up [animation-delay:400ms]">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-accent-100 p-3">
                      <Shield className="h-6 w-6 text-accent-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Legacy Protection</h3>
                    <p className="text-white/80 mt-1">
                      Set up automated legacy transfer to ensure your memories reach your loved ones.
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <div className="relative flex-1 group">
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center shadow-sm">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </div>
                        </div>
                        <Button 
                          variant="primary"
                          className="w-full text-white bg-red-600 hover:bg-red-700 border-2 border-red-600 hover:border-red-700"
                          onClick={handleDeadMansSwitchClick}
                        >
                          <span className="block md:hidden">Switch</span>
                          <span className="hidden md:block">Dead Man's Switch</span>
                        </Button>
                      </div>
                      <div className="relative flex-1 group">
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center shadow-sm">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          className="w-full text-white border-2 border-primary-600 hover:border-primary-700"
                          onClick={() => setShowWillUploadModal(true)}
                        >
                          <span className="block md:hidden">Will</span>
                          <span className="hidden md:block">Upload Will</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Coming Soon Message - Fixed positioning */}
          {showFeatureMessage && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[200] pointer-events-none">
              <div className="bg-white rounded-lg shadow-2xl p-6 border border-accent-200 max-w-sm w-full mx-4 animate-scale-in pointer-events-auto">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Crown className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">Premium Feature Preview</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're accessing a preview of our premium Dead Man's Switch feature. The full functionality will be available in our upcoming update!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit form */}
          {(showAddForm || editingContact) && (
            <Card className="mb-8 animate-slide-up backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-serif font-semibold text-white">
                  {editingContact ? 'Edit Contact' : 'Add New Trusted Contact'}
                </h2>
                <button
                  onClick={editingContact ? handleEditCancel : handleAddCancel}
                  className="text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </CardHeader>
              <CardContent>
                <TrustedContactForm
                  initialContact={editingContact || undefined}
                  onSubmit={editingContact ? handleEditSubmit : handleAddSubmit}
                  onCancel={editingContact ? handleEditCancel : handleAddCancel}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Contact list */}
          {trustedContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {trustedContacts.map((contact, index) => (
                <div 
                  key={contact.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TrustedContactCard
                    contact={contact}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShowDeleteModal={handleShowDeleteModal}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 animate-fade-in backdrop-blur-xl bg-white/10 border border-white/20">
              <CardContent>
                <Users className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No trusted contacts yet</h3>
                <p className="text-white/70 mb-6">
                  Add people you trust to receive your legacy when the time comes.
                </p>
                {!showAddForm && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                  >
                    Add Your First Contact
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dead Man's Switch Modal */}
          <DeadMansSwitchModal
            isOpen={showDeadMansSwitchModal}
            onClose={() => setShowDeadMansSwitchModal(false)}
            trustedContacts={trustedContacts}
            currentSwitch={currentSwitch || undefined}
            onSave={handleSaveSwitch}
          />

          {/* Will Upload Modal */}
          <WillUploadModal
            isOpen={showWillUploadModal}
            onClose={() => setShowWillUploadModal(false)}
            currentWill={currentWill || undefined}
            onSave={handleSaveWill}
          />

          {/* Delete Confirmation Modal */}
          {deleteModalContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200] animate-fade-in">
              <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Remove Trusted Contact
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to remove "{deleteModalContact.name}" from your trusted contacts? They will no longer have access to your digital legacy.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteModalContact(null)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      isLoading={isDeleting}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Removing...' : 'Remove Contact'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title={successTitle}
            message={successMessage}
            autoClose={true}
            autoCloseDelay={4000}
          />
        </div>
      </Layout>
    </div>
  );
};

export default ContactsPage;