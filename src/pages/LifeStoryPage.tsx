import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Heart, Sparkles, RefreshCw, Calendar, Plus, PenSquare } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import { format } from 'date-fns';

const LifeStoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { entries, generateLifeStoryInsights } = useDiary();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  useEffect(() => {
    if (!currentUser?.lifeStory && entries.length > 0) {
      handleGenerateInsights();
    }
  }, []);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    generateLifeStoryInsights();
    setIsGenerating(false);
  };

  // Floating action button for quick journal entry
  const FloatingActionButton = () => (
    <Link 
      to="/journal/new"
      className="fixed bottom-8 right-8 bg-primary-600 text-white rounded-full p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-primary-700 active:scale-95 group"
      onMouseEnter={() => setShowShortcutHint(true)}
      onMouseLeave={() => setShowShortcutHint(false)}
    >
      <PenSquare className="h-6 w-6" />
      {showShortcutHint && (
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap animate-fade-in">
          Create New Entry
        </div>
      )}
    </Link>
  );

  if (!currentUser?.lifeStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
               style={{ animationDelay: '0s', animationDuration: '6s' }} />
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
               style={{ animationDelay: '2s', animationDuration: '8s' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
               style={{ animationDelay: '4s', animationDuration: '7s' }} />
        </div>

        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
            <div className="mb-6">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-white/70 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
            </div>

            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-white/60 mx-auto mb-4 animate-fade-in" />
              <h2 className="text-2xl font-serif font-bold text-white mb-2 animate-fade-in-up [animation-delay:200ms]">
                No Life Story Analysis Yet
              </h2>
              <p className="text-white/80 mb-6 animate-fade-in-up [animation-delay:400ms]">
                {entries.length === 0
                  ? "Start writing journal entries to generate your life story analysis."
                  : "Generate insights from your journal entries to see your life story analysis."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
                <Link to="/journal/new">
                  <Button 
                    icon={<Plus className="h-5 w-5 mr-2" />}
                    className="w-full sm:w-auto transform transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
                  >
                    <span className="block md:hidden">New</span>
                    <span className="hidden md:block">Create New Entry</span>
                  </Button>
                </Link>
                
                {entries.length > 0 && (
                  <Button
                    onClick={handleGenerateInsights}
                    isLoading={isGenerating}
                    icon={<Sparkles className="h-5 w-5 mr-2" />}
                    variant="outline"
                    className="w-full sm:w-auto transform transition-all duration-200 hover:scale-105 active:scale-95 border-white/30 text-white hover:bg-white/10"
                  >
                    <span className="block md:hidden">Generate</span>
                    <span className="hidden md:block">Generate Insights</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  const { narrative, themes, timeline, relationships, values } = currentUser.lifeStory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
      </div>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col gap-4 mb-8 animate-fade-in-up [animation-delay:200ms]">
            <div className="text-center">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">Your Life Story</h1>
              <p className="text-white/80">
                AI-powered analysis of your journal entries
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/journal/new">
                <Button 
                  icon={<Plus className="h-5 w-5 mr-2" />}
                  variant="outline"
                  className="transform transition-all duration-200 hover:scale-105 active:scale-95 border-white/30 text-white hover:bg-white/10"
                >
                  <span className="block md:hidden">New</span>
                  <span className="hidden md:block">New Entry</span>
                </Button>
              </Link>
              <Button
                onClick={handleGenerateInsights}
                isLoading={isGenerating}
                icon={<RefreshCw className="h-5 w-5 mr-2" />}
                className="transform transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
              >
                <span className="block md:hidden">Refresh</span>
                <span className="hidden md:block">Refresh Analysis</span>
              </Button>
            </div>
          </div>

          {/* Narrative Overview */}
          <Card className="mb-8 backdrop-blur-xl bg-white/10 border border-white/20 animate-fade-in-up [animation-delay:400ms]">
            <CardContent className="p-6">
              <p className="text-lg text-white/90 leading-relaxed">
                {narrative}
              </p>
              <p className="text-sm text-white/70 mt-4">
                Last updated: {format(new Date(currentUser.lifeStory.lastGenerated), 'MMMM d, yyyy')}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Themes */}
            <Card className="animate-fade-in-up [animation-delay:600ms] backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                  <BookOpen className="h-5 w-5 text-primary-400 mr-2" />
                  Major Themes
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {themes.map((theme, index) => (
                    <div 
                      key={theme.id} 
                      className="border-b border-white/20 pb-4 last:border-0 animate-fade-in-up"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <h3 className="font-medium text-white mb-1">{theme.name}</h3>
                      <p className="text-sm text-white/80">{theme.description}</p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-grow h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-primary-400 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${theme.relevance * 100}%`,
                              transitionDelay: `${1000 + index * 100}ms`
                            }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-white/70">
                          {Math.round(theme.relevance * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="animate-fade-in-up [animation-delay:800ms] backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                  <Heart className="h-5 w-5 text-primary-400 mr-2" />
                  Personal Values
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div 
                      key={value.id} 
                      className="border-b border-white/20 pb-4 last:border-0 animate-fade-in-up"
                      style={{ animationDelay: `${1000 + index * 100}ms` }}
                    >
                      <h3 className="font-medium text-white mb-1">{value.name}</h3>
                      <p className="text-sm text-white/80">{value.description}</p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-grow h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-accent-400 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${value.confidence * 100}%`,
                              transitionDelay: `${1200 + index * 100}ms`
                            }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-white/70">
                          {Math.round(value.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="mb-8 animate-fade-in-up [animation-delay:1000ms] backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                Life Timeline
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="relative pl-8 pb-6 last:pb-0 animate-fade-in-up"
                    style={{ animationDelay: `${1200 + index * 100}ms` }}
                  >
                    <div className="absolute left-0 top-0 h-full w-px bg-white/30" />
                    <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary-400" />
                    <div>
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-white/70 mb-2">
                        {format(new Date(event.date), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-white/80">{event.description}</p>
                      {event.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {event.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Relationships */}
          <Card className="animate-fade-in-up [animation-delay:1200ms] backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <h2 className="text-xl font-serif font-semibold text-white flex items-center">
                <Users className="h-5 w-5 text-primary-400 mr-2" />
                Key Relationships
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationships.map((relationship, index) => (
                  <div
                    key={relationship.id}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors animate-fade-in-up border border-white/20"
                    style={{ animationDelay: `${1400 + index * 100}ms` }}
                  >
                    <h3 className="font-medium text-white mb-1">{relationship.name}</h3>
                    <p className="text-sm text-white/80 mb-2">{relationship.description}</p>
                    <div className="text-sm text-white/70">
                      First mentioned:{' '}
                      {format(new Date(relationship.firstMentioned), 'MMM yyyy')}
                    </div>
                    <div className="text-sm text-white/70">
                      Last mentioned:{' '}
                      {format(new Date(relationship.lastMentioned), 'MMM yyyy')}
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex-grow h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-secondary-400 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${relationship.significance * 100}%`,
                            transitionDelay: `${1600 + index * 100}ms`
                          }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-white/70">
                        {Math.round(relationship.significance * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Floating action button for quick journal entry */}
          <FloatingActionButton />
        </div>
      </Layout>
    </div>
  );
};

export default LifeStoryPage;