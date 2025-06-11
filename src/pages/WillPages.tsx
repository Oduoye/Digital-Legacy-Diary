import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FileText, Plus, Search, ArrowLeft, Download, Eye, Edit, Trash2, AlertTriangle, Share, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import WillUploadModal from '../components/contacts/WillUploadModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import SuccessModal from '../components/ui/SuccessModal';
import { useDiary } from '../context/DiaryContext';
import { Will } from '../types';

export const WillListPage: React.FC = () => {
  const { wills } = useDiary();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Filter wills based on search query
  const filteredWills = wills.filter(will => 
    searchQuery === '' ||
    will.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    will.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Your Wills</h1>
            <p className="text-gray-600">Manage your legal documents and final wishes</p>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => setShowUploadModal(true)}
            className="mt-4 sm:mt-0"
          >
            New Will
          </Button>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search wills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        {filteredWills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredWills.map((will, index) => (
              <WillCard key={will.id} will={will} index={index} />
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No wills found</h3>
              <p className="text-gray-500 mb-6">
                {wills.length === 0
                  ? "You haven't created any wills yet."
                  : "No wills match your current search."}
              </p>
              {wills.length === 0 ? (
                <Button onClick={() => setShowUploadModal(true)}>Create Your First Will</Button>
              ) : (
                <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        <WillUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSave={handleUploadSuccess}
        />
      </div>
    </Layout>
  );
};

const WillCard: React.FC<{ will: Will; index: number }> = ({ will, index }) => {
  const navigate = useNavigate();
  const { deleteWill } = useDiary();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteWill(will.id);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting will:', error);
    }
  };

  const downloadWill = () => {
    const willContent = `
LAST WILL AND TESTAMENT
${will.title}

Created: ${format(new Date(will.createdAt), 'MMMM d, yyyy')}
Last Updated: ${format(new Date(will.updatedAt), 'MMMM d, yyyy')}

${will.content}

${will.attachments.length > 0 ? `\nAttachments: ${will.attachments.length} file(s)` : ''}

---
Generated from Digital Legacy Diary
Export Date: ${format(new Date(), 'MMMM d, yyyy')}
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
  };

  const exportWillPDF = () => {
    // Create a more formatted version for printing/PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${will.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 30px; }
              .header { text-align: center; margin-bottom: 40px; }
              .content { margin-bottom: 40px; white-space: pre-line; }
              .footer { margin-top: 40px; font-size: 12px; color: #666; }
              .attachments { margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>LAST WILL AND TESTAMENT</h1>
              <h2>${will.title}</h2>
              <p>Created: ${format(new Date(will.createdAt), 'MMMM d, yyyy')}</p>
              <p>Last Updated: ${format(new Date(will.updatedAt), 'MMMM d, yyyy')}</p>
            </div>
            
            <div class="content">
              ${will.content.replace(/\n/g, '<br>')}
            </div>
            
            ${will.attachments.length > 0 ? `
              <div class="attachments">
                <h3>Attachments:</h3>
                <ul>
                  ${will.attachments.map(att => `<li>${att.name} (${(att.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            <div class="footer">
              <p>Generated from Digital Legacy Diary</p>
              <p>Export Date: ${format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <Card 
        className={`h-full flex flex-col animate-fade-in-up`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardHeader className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold font-serif text-gray-900">{will.title}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(will.createdAt), 'MMMM d, yyyy')}
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                will.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {will.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-gray-700 text-sm line-clamp-3">
            {will.content.substring(0, 150)}
            {will.content.length > 150 ? '...' : ''}
          </p>
          
          {will.attachments && will.attachments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {will.attachments.length} attachment{will.attachments.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 pt-4">
          <div className="flex justify-between w-full space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/wills/${will.id}`)}
              icon={<Eye size={16} />}
            >
              View
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEditModal(true)}
              icon={<Edit size={16} />}
            >
              Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => setShowDeleteModal(true)}
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
          
          <div className="flex justify-between w-full space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadWill}
              icon={<Download size={16} />}
              className="flex-1"
            >
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportWillPDF}
              icon={<ExternalLink size={16} />}
              className="flex-1"
            >
              Print/PDF
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      <WillUploadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentWill={will}
        onSave={() => setShowEditModal(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Will
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{will.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Will Deleted Successfully!"
        message="Your will has been permanently removed from your account."
      />
    </>
  );
};

export const ViewWillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWill } = useDiary();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const will = id ? getWill(id) : undefined;
  
  if (!will) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Will not found</p>
          <Button onClick={() => navigate('/wills')}>Back to Wills</Button>
        </div>
      </Layout>
    );
  }

  const downloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadWillAsText = () => {
    const willContent = `
LAST WILL AND TESTAMENT
${will.title}

Created: ${format(new Date(will.createdAt), 'MMMM d, yyyy')}
Last Updated: ${format(new Date(will.updatedAt), 'MMMM d, yyyy')}

${will.content}

${will.attachments.length > 0 ? `\nAttachments: ${will.attachments.length} file(s)` : ''}

---
Generated from Digital Legacy Diary
Export Date: ${format(new Date(), 'MMMM d, yyyy')}
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
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/wills')}
            className="mb-4"
          >
            &larr; Back to Wills
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{will.title}</h1>
              <p className="text-gray-600">
                Created: {format(new Date(will.createdAt), 'MMMM d, yyyy')}
                {will.createdAt.toString() !== will.updatedAt.toString() && 
                  ` • Updated: ${format(new Date(will.updatedAt), 'MMMM d, yyyy')}`}
              </p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  will.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {will.isActive ? 'Active Will' : 'Inactive Will'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={downloadWillAsText}
                icon={<Download size={16} />}
                variant="outline"
              >
                Download
              </Button>
              <Button 
                onClick={() => setShowEditModal(true)}
                icon={<Edit size={16} />}
              >
                Edit Will
              </Button>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {/* Content */}
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Will Content</h3>
              <div className="bg-gray-50 rounded-lg p-6 border">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {will.content}
                </p>
              </div>
            </div>
            
            {/* Attachments */}
            {will.attachments && will.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {will.attachments.map((attachment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAttachment(attachment)}
                          icon={<Download size={16} />}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <WillUploadModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentWill={will}
          onSave={() => setShowEditModal(false)}
        />
      </div>
    </Layout>
  );
};