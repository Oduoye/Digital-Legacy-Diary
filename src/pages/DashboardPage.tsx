import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Book, Users, Calendar, Plus, ArrowRight, Tag, Sparkles, Network, Bot } from 'lucide-react';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { getRandomPrompt } from '../utils/writingPrompts';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { entries, trustedContacts } = useDiary();
  const [currentDate] = useState(new Date());
  const [randomPrompt, setRandomPrompt] = useState(getRandomPrompt());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomPrompt(getRandomPrompt());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const totalEntries = entries.length;
  const recentEntries = entries.slice(0, 3);
  const allTags = entries.flatMap(entry => entry.tags);
  const uniqueTags = [...new Set(allTags)].slice(0, 8);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const entriesThisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="animate-fade-in">
            <h2 className="text-lg text-gray-600">Welcome back,</h2>
            <h1 className="text-2xl font-serif font-bold text-gray-900">{currentUser?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{format(currentDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>

          <Link 
            to="/profile" 
            className="group relative"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-4 ring-blue-500 shadow-lg transform transition-transform group-hover:scale-105">
              {currentUser?.profilePicture ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50">
                  <span className="text-2xl font-serif text-primary-600">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white p-3 rounded-full mb-4">
                <Book className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">New Entry</h2>
              <p className="text-gray-600 mb-4">Record your thoughts and memories.</p>
              <Link to="/journal/new">
                <Button variant="primary" icon={<Plus size={16} />}>
                  Create Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">Contacts</h2>
              <p className="text-gray-600 mb-4">Manage your trusted contacts.</p>
              <Link to="/contacts">
                <Button 
                  variant="secondary" 
                  icon={<ArrowRight size={16} />}
                >
                  View Contacts
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white p-3 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-accent-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">Journal</h2>
              <p className="text-gray-600 mb-4">Browse your past entries.</p>
              <Link to="/journal">
                <Button 
                  variant="outline" 
                  className="border-accent-300 text-accent-700 hover:bg-accent-50"
                  icon={<ArrowRight size={16} />}
                >
                  View Journal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">Life Story</h2>
              <p className="text-gray-600 mb-4">View AI-powered insights.</p>
              <Link to="/life-story">
                <Button 
                  variant="outline" 
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                  icon={<ArrowRight size={16} />}
                >
                  View Insights
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
                <Network className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-serif font-semibold mb-2">Memory Map</h2>
              <p className="text-white/90 mb-4">Explore your memory constellation.</p>
              <Link to="/memory-constellation">
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  icon={<ArrowRight size={16} />}
                >
                  View Map
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white">
            <CardContent className="flex flex-col items-start py-6">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-serif font-semibold mb-2">AI Assistant</h2>
              <p className="text-white/90 mb-4">Chat with your wisdom assistant.</p>
              <Link to="/wisdom-chatbot">
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  icon={<ArrowRight size={16} />}
                >
                  Start Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Writing Prompt */}
        <div className="mb-10 bg-gradient-to-r from-accent-100 to-primary-100 rounded-lg p-6 border border-accent-200 shadow-sm animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2 flex items-center">
                <span className="mr-2">✨</span> Today's Writing Prompt
              </h2>
              <p className="text-gray-700 font-medium italic">{randomPrompt.text}</p>
            </div>
            <Link to="/journal/new" className="self-start">
              <Button>Write About This</Button>
            </Link>
          </div>
        </div>
        
        {/* Stats and Recents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Stats Cards */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-serif font-semibold text-gray-900">Your Journey</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Entries</span>
                      <span className="text-2xl font-semibold text-primary-600">{totalEntries}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-2xl font-semibold text-secondary-600">{entriesThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Trusted Contacts</span>
                      <span className="text-2xl font-semibold text-accent-600">{trustedContacts.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-primary-500" />
                    Your Tags
                  </h2>
                </CardHeader>
                <CardContent>
                  {uniqueTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {uniqueTags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Add tags to your entries to see them here.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-serif font-semibold text-gray-900">Recent Entries</h2>
                <Link to="/journal" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {recentEntries.length > 0 ? (
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <Link key={entry.id} to={`/journal/${entry.id}`}>
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                            <span className="text-xs text-gray-500">
                              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {entry.content.substring(0, 100)}
                            {entry.content.length > 100 ? '...' : ''}
                          </p>
                          {entry.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {entry.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{entry.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any entries yet.</p>
                    <Link to="/journal/new">
                      <Button>Create Your First Entry</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;