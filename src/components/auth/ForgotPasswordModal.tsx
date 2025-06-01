import React from 'react';
import { Mail, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Password Reset Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            The password reset functionality will be available in the full version. 
            For now, please contact support if you need help accessing your account.
          </p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This feature is currently in development and will be available soon.
                </p>
              </div>
            </div>
          </div>
          <Button onClick={onClose} className="w-full">
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;