import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, X, ArrowLeft, Shield, Crown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import TrustedContactForm from '../components/contacts/TrustedContactForm';
import TrustedContactCard from '../components/contacts/TrustedContactCard';
import DeadMansSwitchModal from '../components/contacts/DeadMansSwitchModal';
import WillUploadModal from '../components/contacts/WillUploadModal';
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
  
  const handleAddSubmit = (contact: Omit<TrustedContact, 'id'>) => {
    addTrustedContact(contact);
    setShowAddForm(false);
  };
  
  const handleEditSubmit = (contact: Omit<TrustedContact, 'id'>) => {
    if (editingContact) {
      updateTrustedContact(editingContact.id, contact);
      setEditingContact(null);
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

  const handleDelete = () => {
    if (deleteModalContact) {
      removeTrustedContact(deleteModalContact.id);
      setDeleteModalContact(null);
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
  };

  const handleSaveWill = (data: Partial<Will>) => {
    console.log('Saving Will:', data);
    setShowWillUploadModal(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Trusted Contacts</h1>
              <p className="text-gray-600">People who will receive your legacy</p>
            </div>
            {!showAddForm && !editingContact && (
              <Button
                icon={<UserPlus size={18} />}
                onClick={() => setShowAddForm(true)}
                className="mt-4 sm:mt-0"
              >
                Add Contact
              </Button>
            )}
          </div>
        </div>
        
        {/* Information cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Legacy Access Card */}
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 animate-fade-in-up [animation-delay:200ms]">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-primary-100 p-3">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Legacy Access Information</h3>
                  <p className="text-gray-600 mt-1">
                    Your Trusted Contacts are the people you designate to receive access to your Digital Legacy Diary when the time comes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legacy Protection Card */}
          <Card className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-100 animate-fade-in-up [animation-delay:400ms]">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-accent-100 p-3">
                    <Shield className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Legacy Protection</h3>
                  <p className="text-gray-600 mt-1">
                    Set up automated legacy transfer to ensure your memories reach your loved ones.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <div className="relative flex-1 group">
                      <div className="absolute -top-7 -right-2 z-10">
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
                      <div className="absolute -top-7 -right-2 z-10">
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

        {/* Feature Coming Soon Message */}
        {showFeatureMessage && (
          <div className="fixed left-1/2 transform -translate-x-1/2 top-4 max-w-sm w-full z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-accent-200 mx-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Crown className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Premium Feature Preview</h3>
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
          <Card className="mb-8 animate-slide-up">
            <CardHeader className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add New Trusted Contact'}
              </h2>
              <button
                onClick={editingContact ? handleEditCancel : handleAddCancel}
                className="text-gray-400 hover:text-gray-600"
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
          <Card className="text-center py-12 animate-fade-in">
            <CardContent>
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No trusted contacts yet</h3>
              <p className="text-gray-500 mb-6">
                Add people you trust to receive your legacy when the time comes.
              </p>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>Add Your First Contact</Button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Are you sure you want to delete this entry? This action cannot be undone.
                </h3>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModalContact(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleDelete}
                  >
                    OK
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

export default ContactsPage;