import React, { useState, useRef } from 'react';
import { User, Mail, Heart, Camera } from 'lucide-react';
import { TrustedContact } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TrustedContactFormProps {
  initialContact?: Partial<TrustedContact>;
  onSubmit: (contact: Omit<TrustedContact, 'id'>) => void;
  onCancel: () => void;
}

const TrustedContactForm: React.FC<TrustedContactFormProps> = ({
  initialContact = { name: '', email: '', relationship: '', picture: '' },
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialContact.name || '');
  const [email, setEmail] = useState(initialContact.email || '');
  const [relationship, setRelationship] = useState(initialContact.relationship || '');
  const [picture, setPicture] = useState(initialContact.picture || '');
  const [errors, setErrors] = useState({ name: '', email: '', relationship: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = {
      name: !name ? 'Name is required' : '',
      email: !email ? 'Email is required' : !validateEmail(email) ? 'Email is invalid' : '',
      relationship: !relationship ? 'Relationship is required' : '',
    };
    
    if (formErrors.name || formErrors.email || formErrors.relationship) {
      setErrors(formErrors);
      return;
    }
    
    onSubmit({
      name,
      email,
      relationship,
      picture,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-primary-500">
            {picture ? (
              <img 
                src={picture} 
                alt={name || 'Contact'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-50">
                <span className="text-2xl font-serif text-primary-600">
                  {name ? name.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-label-light">Contact Photo</h3>
          <p className="text-sm text-white/70">Upload a photo of your trusted contact</p>
        </div>
      </div>

      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        error={errors.name}
        icon={<User className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john.doe@example.com"
        error={errors.email}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        label="Relationship"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        placeholder="Son, Daughter, Spouse, Friend, etc."
        error={errors.relationship}
        icon={<Heart className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-white/30 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
        >
          {initialContact.id ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
};

export default TrustedContactForm;