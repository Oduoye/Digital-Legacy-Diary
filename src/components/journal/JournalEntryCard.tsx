import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { DiaryEntry } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { useDiary } from '../../context/DiaryContext';

interface JournalEntryCardProps {
  entry: DiaryEntry;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  const navigate = useNavigate();
  const { deleteEntry } = useDiary();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    navigate(`/journal/edit/${entry.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteEntry(entry.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const truncatedContent = entry.content.length > 200
    ? `${entry.content.substring(0, 200)}...`
    : entry.content;

  return (
    <>
      <Card 
        gradientFrom="secondary-50"
        gradientTo="primary-50"
        className="h-full flex flex-col"
      >
        <CardHeader className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold font-serif text-gray-900">{entry.title}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 whitespace-pre-line">{truncatedContent}</p>
          
          {entry.images && entry.images.length > 0 && (
            <div className={`mt-4 grid ${
              entry.images.length === 1 ? 'grid-cols-1' :
              entry.images.length === 2 ? 'grid-cols-2' :
              entry.images.length === 3 ? 'grid-cols-2' :
              'grid-cols-2 md:grid-cols-3'
            } gap-2`}>
              {entry.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative aspect-square overflow-hidden rounded-md ${
                    entry.images.length === 3 && index === 2 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Image ${index + 1} for ${entry.title}`} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-black/5 text-gray-700 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEdit}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleDelete}
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
                Delete Entry
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JournalEntryCard;