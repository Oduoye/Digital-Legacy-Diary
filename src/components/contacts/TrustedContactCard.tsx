import React, { useState } from 'react';
import { Mail, Edit, Trash2, CheckCircle } from 'lucide-react';
import { TrustedContact } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import SuccessModal from '../ui/SuccessModal';

interface TrustedContactCardProps {
  contact: TrustedContact;
  onEdit: (contact: TrustedContact) => void;
  onDelete: (id: string) => void;
  onShowDeleteModal: (contact: TrustedContact) => void;
}

const TrustedContactCard: React.FC<TrustedContactCardProps> = ({
  contact,
  onEdit,
  onShowDeleteModal,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = () => {
    onEdit(contact);
    // Show success message after edit (this would be triggered from parent)
    setSuccessMessage(`Contact "${contact.name}" has been updated successfully!`);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  return (
    <>
      <Card 
        gradientFrom="primary-50"
        gradientTo="accent-50"
        className="text-gray-900"
      >
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-4 ring-primary-500">
              {contact.picture ? (
                <img 
                  src={contact.picture} 
                  alt={contact.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50">
                  <span className="text-2xl font-serif text-primary-600">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              <p className="text-sm text-accent-600">{contact.relationship}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-gray-700">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${contact.email}`} className="text-sm hover:text-primary-600">
              {contact.email}
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(contact)}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onShowDeleteModal(contact)}
            icon={<Trash2 size={16} />}
          >
            Remove
          </Button>
        </CardFooter>
      </Card>

      {/* Success Modal for Contact Updates */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Contact Updated!"
        message={successMessage}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </>
  );
};

export default TrustedContactCard;