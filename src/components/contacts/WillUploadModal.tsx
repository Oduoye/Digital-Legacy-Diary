import React, { useState, useRef } from 'react';
import { Upload, FileText, Paperclip, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import SuccessModal from '../ui/SuccessModal';
import { useDiary } from '../../context/DiaryContext';
import { Will, WillAttachment } from '../../types';

interface WillUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWill?: Will;
  onSave: (data: Partial<Will>) => void;
}

const WillUploadModal: React.FC<WillUploadModalProps> = ({
  isOpen,
  onClose,
  currentWill,
  onSave,
}) => {
  const { addWill, updateWill } = useDiary();
  const [title, setTitle] = useState(currentWill?.title || '');
  const [content, setContent] = useState(currentWill?.content || '');
  const [attachments, setAttachments] = useState<WillAttachment[]>(
    currentWill?.attachments || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/') || 
                         file.type === 'application/msword' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      return isValidSize && isValidType;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Only PDF, Word documents, and images under 10MB are allowed.');
    }

    const newAttachments: WillAttachment[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Simulate upload time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const willData = {
        title: title.trim(),
        content: content.trim(),
        attachments,
        isActive: true,
      };

      if (currentWill) {
        await updateWill(currentWill.id, willData);
      } else {
        await addWill(willData);
      }

      onSave(willData);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error saving will:', error);
      setError(error.message || 'Failed to save will. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    // Reset form
    setTitle('');
    setContent('');
    setAttachments([]);
    setError('');
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter((att) => att.id !== id));
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form if not editing
      if (!currentWill) {
        setTitle('');
        setContent('');
        setAttachments([]);
      }
      setError('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] animate-fade-in">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in shadow-2xl">
          <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              {currentWill ? 'Update Your Will' : 'Upload Your Will'}
            </h2>
            <p className="text-gray-600">
              Securely store your will and related documents
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-lg border border-primary-100">
              <Input
                label="Will Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Last Will and Testament"
                required
                disabled={isLoading}
                icon={<FileText className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg border border-secondary-100">
              <Textarea
                label="Will Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the content of your will..."
                className="h-48"
                required
                disabled={isLoading}
              />
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-white p-4 rounded-lg border border-accent-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-accent-300 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer text-accent-600 hover:text-accent-500 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        accept=".pdf,.doc,.docx,image/*"
                        disabled={isLoading}
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      or drag and drop files here
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    PDF, Word documents, and images up to 10MB each
                  </p>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Important Notice</h3>
                  <p className="text-sm text-gray-600">
                    This digital copy of your will is for storage purposes only.
                    Please ensure you have a legally executed physical copy of your
                    will stored in a secure location.
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t pt-4 pb-2">
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleClose} 
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  disabled={isLoading || !title.trim() || !content.trim()}
                >
                  {isLoading ? 'Saving...' : (currentWill ? 'Update Will' : 'Upload Will')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={`Will ${currentWill ? 'Updated' : 'Uploaded'} Successfully!`}
        message={`Your will "${title}" has been securely saved to your account. Your legal documents are now preserved in your digital legacy.`}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </>
  );
};

export default WillUploadModal;