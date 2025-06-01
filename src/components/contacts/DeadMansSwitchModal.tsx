import React, { useState } from 'react';
import { Clock, Bell, Mail, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { TrustedContact, DeadMansSwitch } from '../../types';

interface DeadMansSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustedContacts: TrustedContact[];
  currentSwitch?: DeadMansSwitch;
  onSave: (data: Partial<DeadMansSwitch>) => void;
}

const DeadMansSwitchModal: React.FC<DeadMansSwitchModalProps> = ({
  isOpen,
  onClose,
  trustedContacts,
  currentSwitch,
  onSave,
}) => {
  const [interval, setInterval] = useState(currentSwitch?.checkInInterval || 30);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(
    currentSwitch?.trustedContacts || []
  );
  const [customMessage, setCustomMessage] = useState(
    currentSwitch?.customMessage || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      checkInInterval: interval,
      trustedContacts: selectedContacts,
      customMessage,
      status: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Dead Man's Switch Setup
          </h2>
          <p className="text-gray-600">
            Configure when and how your legacy will be shared with your trusted contacts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-lg border border-primary-100">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">Check-in Interval</h3>
                <p className="text-sm text-gray-600 mb-2">
                  How often do you want to confirm you're still active?
                </p>
                <Input
                  type="number"
                  min={7}
                  max={365}
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="max-w-[200px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You'll need to check in every {interval} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg border border-secondary-100">
            <div className="flex items-start space-x-3">
              <Bell className="h-5 w-5 text-secondary-600 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">Select Trusted Contacts</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Choose who should receive your legacy
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trustedContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts([...selectedContacts, contact.id]);
                          } else {
                            setSelectedContacts(
                              selectedContacts.filter((id) => id !== contact.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-900">{contact.name}</span>
                      <span className="text-gray-500 text-sm">
                        ({contact.relationship})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-50 to-white p-4 rounded-lg border border-accent-100">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-accent-600 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">Custom Message</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Add a personal message to be sent with your legacy
                </p>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  className="h-24"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Important Notice</h3>
                <p className="text-sm text-gray-600">
                  If you don't check in within the specified interval, we'll begin
                  the process of sharing your legacy with your trusted contacts.
                  You'll receive multiple notifications before this happens.
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t pt-4 pb-2 mt-6">
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {currentSwitch ? 'Update Switch' : 'Activate Switch'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeadMansSwitchModal;