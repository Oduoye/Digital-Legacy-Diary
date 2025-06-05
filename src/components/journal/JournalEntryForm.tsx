import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Tag, ImagePlus, ChevronLeft, ChevronRight, Upload, Trash2 } from 'lucide-react';
import { DiaryEntry } from '../../types';
import { useDiary } from '../../context/DiaryContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { WritingPrompt, getRandomPrompt } from '../../utils/writingPrompts';

interface JournalEntryFormProps {
  initialEntry?: Partial<DiaryEntry>;
  onSubmit: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  initialEntry = { title: '', content: '', tags: [], images: [] },
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialEntry.title || '');
  const [content, setContent] = useState(initialEntry.content || '');
  const [tags, setTags] = useState<string[]>(initialEntry.tags || []);
  const [images, setImages] = useState<string[]>(initialEntry.images || []);
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [errors, setErrors] = useState({ title: '', content: '', tagInput: '', imageInput: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    const initialPrompts = Array.from({ length: 5 }, () => getRandomPrompt());
    setPrompts(initialPrompts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev < prompts.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [prompts.length]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isUnder50MB = file.size <= 50 * 1024 * 1024;
      return isValid && isUnder50MB;
    });

    const newFiles = await Promise.all(validFiles.map(async file => {
      return new Promise<{ file: File; preview: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handlePrevPrompt = () => {
    setCurrentPromptIndex((prev) => (prev > 0 ? prev - 1 : prompts.length - 1));
  };

  const handleNextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev < prompts.length - 1 ? prev + 1 : 0));
  };

  const getNewPrompts = () => {
    const newPrompts = Array.from({ length: 5 }, () => getRandomPrompt());
    setPrompts(newPrompts);
    setCurrentPromptIndex(0);
  };

  const applyPrompt = () => {
    const currentPrompt = prompts[currentPromptIndex];
    if (currentPrompt) {
      if (!content.trim()) {
        setContent(currentPrompt.text);
      } else {
        setContent(prevContent => `${prevContent}\n\n${currentPrompt.text}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = {
      title: !title ? 'Title is required' : '',
      content: !content ? 'Content is required' : '',
      tagInput: '',
      imageInput: '',
    };
    
    if (formErrors.title || formErrors.content) {
      setErrors(formErrors);
      return;
    }
    
    const mediaUrls = uploadedFiles.map(file => file.preview);
    
    onSubmit({
      title,
      content,
      tags,
      images: [...images, ...mediaUrls],
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) {
      setErrors({ ...errors, tagInput: 'Tag cannot be empty' });
      return;
    }
    
    if (tags.includes(tagInput.trim())) {
      setErrors({ ...errors, tagInput: 'Tag already exists' });
      return;
    }
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
    setErrors({ ...errors, tagInput: '' });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) {
      setErrors({ ...errors, imageInput: 'Image URL cannot be empty' });
      return;
    }
    
    try {
      new URL(imageInput);
    } catch (e) {
      setErrors({ ...errors, imageInput: 'Invalid URL' });
      return;
    }
    
    setImages([...images, imageInput.trim()]);
    setImageInput('');
    setErrors({ ...errors, imageInput: '' });
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setImages(images.filter(url => url !== urlToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {/* Writing prompts carousel */}
      <div className="bg-gradient-to-r from-accent-50 to-primary-50 p-6 rounded-lg border border-accent-200 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-800 font-serif flex items-center">
            <Sparkles size={18} className="text-accent-500 mr-2" />
            Writing Prompts
          </h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={getNewPrompts}
            className="animate-fade-in"
          >
            Refresh All
          </Button>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div className="transition-transform duration-300 ease-in-out">
              <p className="text-gray-700 italic mb-4 min-h-[3rem] animate-fade-in">
                {prompts[currentPromptIndex]?.text}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
              onClick={handlePrevPrompt}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex gap-1">
              {prompts.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPromptIndex 
                      ? 'bg-accent-600' 
                      : 'bg-accent-200'
                  }`}
                  onClick={() => setCurrentPromptIndex(index)}
                />
              ))}
            </div>
            
            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
              onClick={handleNextPrompt}
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={applyPrompt}
            className="animate-fade-in"
          >
            Use This Prompt
          </Button>
        </div>
      </div>

      {/* Main content section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 animate-fade-in-up [animation-delay:200ms]">
          <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg border border-primary-100">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title"
              error={errors.title}
              required
              className="mb-4"
            />
            
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, memories, or reflections here..."
              className="min-h-[300px]"
              error={errors.content}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Tags section */}
          <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-lg border border-secondary-100 animate-fade-in-up [animation-delay:400ms]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            <div className="flex items-center">
              <div className="flex-grow">
                <Input
                  placeholder="Add a tag (e.g., Family, Travel)"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setErrors({ ...errors, tagInput: '' });
                  }}
                  error={errors.tagInput}
                  icon={<Tag className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <Button 
                type="button" 
                className="ml-2" 
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-secondary-100 px-2.5 py-0.5 rounded-full text-sm font-medium text-secondary-800 animate-fade-in"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-secondary-500 hover:text-secondary-700 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Media Upload Section */}
          <div className="bg-gradient-to-br from-accent-50 to-white p-6 rounded-lg border border-accent-100 animate-fade-in-up [animation-delay:600ms]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photos & Videos
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-accent-200 rounded-lg hover:border-accent-300 transition-colors bg-white/50">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-accent-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-accent-600 hover:text-accent-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  Images and videos up to 50MB
                </p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group animate-fade-in">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {file.file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={file.preview}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* External Image URLs */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 rounded-lg border border-primary-100 animate-fade-in-up [animation-delay:800ms]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              External Image URLs
            </label>
            <div className="flex items-center">
              <div className="flex-grow">
                <Input
                  placeholder="Add image URL"
                  value={imageInput}
                  onChange={(e) => {
                    setImageInput(e.target.value);
                    setErrors({ ...errors, imageInput: '' });
                  }}
                  error={errors.imageInput}
                  icon={<ImagePlus className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <Button 
                type="button" 
                className="ml-2" 
                onClick={handleAddImage}
              >
                Add
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group animate-fade-in">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={url} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-6 animate-fade-in-up [animation-delay:1000ms]">
        <Button type="submit" size="lg" className="min-w-[200px]">
          {initialEntry.id ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;