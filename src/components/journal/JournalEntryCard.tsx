import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
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

  const handleEdit = () => {
    navigate(`/journal/edit/${entry.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(entry.id);
    }
  };

  const truncatedContent = entry.content.length > 200
    ? `${entry.content.substring(0, 200)}...`
    : entry.content;

  return (
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
          <div className="mt-4 grid grid-cols-2 gap-2">
            {entry.images.slice(0, 2).map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                <img 
                  src={image} 
                  alt={`Image for ${entry.title}`} 
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
            {entry.images.length > 2 && (
              <div className="col-span-2 text-sm text-gray-500 text-center mt-1">
                +{entry.images.length - 2} more {entry.images.length === 3 ? 'image' : 'images'}
              </div>
            )}
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
  );
};

export default JournalEntryCard;