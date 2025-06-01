import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Book, Plus, Search, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import JournalEntryForm from '../components/journal/JournalEntryForm';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useDiary } from '../context/DiaryContext';
import { DiaryEntry } from '../types';
import Card, { CardHeader, CardContent } from '../components/ui/Card';

export const JournalListPage: React.FC = () => {
  const { entries } = useDiary();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags from entries
  const allTags = [...new Set(entries.flatMap(entry => entry.tags))];
  
  // Filter entries based on search query and selected tag
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTag = selectedTag === null || 
      entry.tags.includes(selectedTag);
      
    return matchesSearch && matchesTag;
  });
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Your Journal</h1>
            <p className="text-gray-600">Capture your memories and reflections</p>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => navigate('/journal/new')}
            className="mt-4 sm:mt-0"
          >
            New Entry
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:flex-grow">
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            {selectedTag && (
              <div className="flex items-center">
                <span className="bg-primary-100 text-primary-800 px-3 py-2 rounded-md text-sm flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  #{selectedTag}
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    &times;
                  </button>
                </span>
              </div>
            )}
            
            {(searchQuery || selectedTag) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by tag:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${tag === selectedTag 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardContent className="py-12 text-center">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-500 mb-6">
                {entries.length === 0
                  ? "You haven't created any journal entries yet."
                  : "No entries match your current filters."}
              </p>
              {entries.length === 0 ? (
                <Button onClick={() => navigate('/journal/new')}>Create Your First Entry</Button>
              ) : (
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export const NewJournalEntryPage: React.FC = () => {
  const { addEntry } = useDiary();
  const navigate = useNavigate();
  
  const handleSubmit = (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    addEntry(entryData);
    navigate('/journal');
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">New Journal Entry</h1>
          <p className="text-gray-600">Capture your thoughts, memories, and reflections</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <JournalEntryForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const EditJournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEntry, updateEntry } = useDiary();
  const navigate = useNavigate();
  
  const entry = id ? getEntry(id) : undefined;
  
  if (!entry) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Entry not found</p>
          <Button onClick={() => navigate('/journal')}>Back to Journal</Button>
        </div>
      </Layout>
    );
  }
  
  const handleSubmit = (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    updateEntry(entry.id, entryData);
    navigate('/journal');
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Edit Journal Entry</h1>
          <p className="text-gray-600">Last updated: {format(new Date(entry.updatedAt), 'MMMM d, yyyy')}</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <JournalEntryForm initialEntry={entry} onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const ViewJournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEntry } = useDiary();
  const navigate = useNavigate();
  
  const entry = id ? getEntry(id) : undefined;
  
  if (!entry) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Entry not found</p>
          <Button onClick={() => navigate('/journal')}>Back to Journal</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/journal')}
            className="mb-4"
          >
            &larr; Back to Journal
          </Button>
          
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{entry.title}</h1>
          <p className="text-gray-600">
            {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
            {entry.createdAt.toString() !== entry.updatedAt.toString() && 
              ` (Edited: ${format(new Date(entry.updatedAt), 'MMMM d, yyyy')})`}
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Content */}
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {entry.content}
              </p>
            </div>
            
            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entry.images.map((image, index) => (
                  <div key={index} className="rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={image} 
                      alt={`Image for ${entry.title}`} 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/journal/edit/${entry.id}`)}
              >
                Edit Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};