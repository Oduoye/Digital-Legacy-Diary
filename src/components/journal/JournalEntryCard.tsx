import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === entry.images.length - 1 ? 0 : prev + 1
    );
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? entry.images.length - 1 : prev - 1
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showImageViewer) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        setCurrentImageIndex((prev) => 
          prev === 0 ? entry.images.length - 1 : prev - 1
        );
        break;
      case 'ArrowRight':
        setCurrentImageIndex((prev) => 
          prev === entry.images.length - 1 ? 0 : prev + 1
        );
        break;
      case 'Escape':
        closeImageViewer();
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageViewer]);

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
                  className={`relative aspect-square overflow-hidden rounded-md cursor-pointer group ${
                    entry.images.length === 3 && index === 2 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                  onClick={() => openImageViewer(index)}
                >
                  <img 
                    src={image} 
                    alt={`Image ${index + 1} for ${entry.title}`} 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
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

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeImageViewer}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeImageViewer}
          >
            <X size={24} />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={showPrevImage}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
            <img
              src={entry.images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1} of ${entry.images.length}`}
              className="w-full h-full object-contain animate-fade-in"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {entry.images.length}
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={showNextImage}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

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