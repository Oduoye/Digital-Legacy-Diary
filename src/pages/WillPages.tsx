import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FileText, Plus, Search, ArrowLeft, Download, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
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
  
  // Filter wills based on search query
  const filteredWills = wills.filter(will => 
    searchQuery === '' ||
    will.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    will.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Your Wills</h1>
            <p className="text-gray-600">Manage your legal documents and final wishes</p>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => navigate('/wills/new')}
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
                <Button onClick={() => navigate('/wills/new')}>Create Your First Will</Button>
              ) : (
                <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

const WillCard: React.FC<{ will: Will; index: number }> = ({ will, index }) => {
  const navigate = useNavigate();
  const { deleteWill } = useDiary();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteWill(will.id);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting will:', error);
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
        
        <CardFooter className="flex justify-between space-x-2 pt-4">
          <div className="flex space-x-2">
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
              onClick={() => navigate(`/wills/edit/${will.id}`)}
              icon={<Edit size={16} />}
            >
              Edit
            </Button>
          </div>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => setShowDeleteModal(true)}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

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
            <Button 
              onClick={() => navigate(`/wills/edit/${will.id}`)}
              icon={<Edit size={16} />}
            >
              Edit Will
            </Button>
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
      </div>
    </Layout>
  );
};