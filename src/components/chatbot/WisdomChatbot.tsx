import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Plus, MessageSquare, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useDiary } from '../../context/DiaryContext';
import { ChatMessage, ChatSession } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const WisdomChatbot: React.FC = () => {
  const { 
    entries, 
    chatMessages, 
    chatSessions, 
    currentChatSession,
    addChatMessage, 
    loadChatHistory,
    createNewChatSession,
    updateChatSession,
    deleteChatSession,
    setCurrentChatSession
  } = useDiary();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [messageContext, setMessageContext] = useState<string[]>([]);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (currentChatSession && chatMessages.length === 0) {
      const welcomeMessage = "Hello! I'm Legacy Scribe, your personal memory companion. I've been studying your journal entries and I'm here to help you explore your memories, reflect on your experiences, and discover deeper insights about your life's journey. What would you like to discuss today?";
      addChatMessage({
        text: welcomeMessage,
        sender: 'bot',
        sessionId: currentChatSession.id,
      });
    }
  }, [currentChatSession, chatMessages.length]);

  const analyzeContext = (userMessage: string): string[] => {
    const keywords = userMessage.toLowerCase().split(' ');
    const relevantEntries = entries.filter(entry =>
      keywords.some(keyword =>
        entry.content.toLowerCase().includes(keyword) ||
        entry.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
        entry.title.toLowerCase().includes(keyword)
      )
    );

    return relevantEntries.map(entry => entry.content);
  };

  const generateIntelligentResponse = (userMessage: string): string => {
    const context = analyzeContext(userMessage);
    setMessageContext(context);
    
    if (userMessage === lastUserMessage) {
      return "I notice you've mentioned this before. Let me help you explore this from a different perspective. What specific aspects of this topic resonate most deeply with you right now?";
    }

    const lowercaseMessage = userMessage.toLowerCase();
    
    // Enhanced greeting detection with personalized response
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    const isGreeting = greetings.some(greeting => lowercaseMessage.includes(greeting));
    
    if (isGreeting) {
      if (entries.length > 0) {
        const recentEntry = entries[0];
        const totalEntries = entries.length;
        const uniqueTags = [...new Set(entries.flatMap(entry => entry.tags))];
        
        const greetingResponses = [
          `Welcome back! I've been reflecting on your ${totalEntries} journal entries, and I'm particularly drawn to your recent piece "${recentEntry.title}". There's such depth in how you express yourself. What's been on your mind lately that you'd like to explore together?`,
          
          `Hello! It's wonderful to connect with you again. I've noticed some beautiful patterns in your writing - themes around ${uniqueTags.slice(0, 2).join(' and ')} keep appearing. Your voice has such authenticity. What aspect of your life story would you like to delve into today?`,
          
          `Hi there! I've been contemplating your journey through your journal entries. Your recent reflection in "${recentEntry.title}" shows such insight. I'm curious - what memories or thoughts are stirring in you right now?`,
          
          `Greetings! Your ${totalEntries} entries paint such a rich tapestry of experiences. I'm particularly moved by how you write about ${uniqueTags[0] || 'your experiences'}. What would you like to explore or reflect on in our conversation today?`
        ];
        
        return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      } else {
        return "Hello! I'm Legacy Scribe, and I'm here to be your companion in exploring life's deeper meanings. While you haven't written any journal entries yet, I'm excited to help you begin this journey of reflection and discovery. What's something meaningful that's happened in your life recently that you'd like to talk about?";
      }
    }
    
    // Enhanced emotional intelligence
    const emotionalWords = {
      joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'elated'],
      sadness: ['sad', 'grief', 'loss', 'mourning', 'heartbroken', 'melancholy'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'fearful'],
      anger: ['angry', 'frustrated', 'irritated', 'furious', 'annoyed'],
      love: ['love', 'affection', 'care', 'cherish', 'adore'],
      gratitude: ['grateful', 'thankful', 'blessed', 'appreciate']
    };

    let detectedEmotion = null;
    for (const [emotion, words] of Object.entries(emotionalWords)) {
      if (words.some(word => lowercaseMessage.includes(word))) {
        detectedEmotion = emotion;
        break;
      }
    }

    if (detectedEmotion) {
      const emotionalResponses = {
        joy: [
          "I can feel the joy radiating from your words! These moments of happiness are precious gifts. What made this experience so special for you?",
          "Your happiness is contagious! I love seeing you celebrate life's beautiful moments. How does this joy connect to your deeper values and what matters most to you?"
        ],
        sadness: [
          "I sense the weight of sadness in your words, and I want you to know that these feelings are valid and important. Sometimes our deepest growth comes through difficult emotions. Would you like to share what's weighing on your heart?",
          "Grief and sadness are profound teachers, though painful ones. I'm here to listen and help you process these feelings. What would feel most supportive right now?"
        ],
        anxiety: [
          "I can hear the worry in your words. Anxiety often signals that something matters deeply to us. Let's explore what's beneath these feelings - what are you most concerned about?",
          "When we feel overwhelmed, it can help to break things down into smaller pieces. What's the core of what's troubling you right now?"
        ],
        anger: [
          "I sense frustration in your message. Anger often points to our boundaries or values being challenged. What feels most important to address right now?",
          "These feelings of anger are telling us something important. What do you think is at the heart of this frustration?"
        ],
        love: [
          "The love in your words is beautiful to witness. These connections that matter to us are what make life meaningful. Tell me more about this relationship that brings you such joy.",
          "Love is one of life's greatest gifts. I can feel how much this means to you. How has this love shaped who you are?"
        ],
        gratitude: [
          "Your gratitude is touching. These moments of appreciation often reveal what we value most deeply. What about this experience fills you with such thankfulness?",
          "Gratitude has such power to transform our perspective. I'm moved by your appreciation. How does this gratitude connect to your life's larger story?"
        ]
      };

      const responses = emotionalResponses[detectedEmotion as keyof typeof emotionalResponses];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Enhanced question handling with context awareness
    if (lowercaseMessage.includes('?')) {
      if (lowercaseMessage.includes('why')) {
        if (context.length > 0) {
          return "That's a profound question that touches on some themes I've noticed in your journal entries. Looking at your past reflections, I see patterns that might help us explore this 'why' together. What draws you to ask this particular question right now?";
        }
        return "That's such an important question - the 'why' behind our experiences often holds the deepest meaning. What's prompting you to explore this particular aspect of your life?";
      }
      if (lowercaseMessage.includes('how')) {
        return "Great question! I love how you're thinking about the 'how' - the process and journey matter as much as the destination. Based on your experiences, what approaches have worked well for you in the past?";
      }
      if (lowercaseMessage.includes('what')) {
        return "That's a thoughtful question that invites deeper exploration. From what I know about your journey through your journal entries, what aspects of this topic feel most significant to you?";
      }
    }

    // Memory and reflection prompts
    const memoryKeywords = ['remember', 'memory', 'childhood', 'past', 'used to', 'back then'];
    if (memoryKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return "Memories are such treasures - they shape who we are and connect us to our authentic selves. I'm curious about this memory you're sharing. What emotions or insights does it bring up for you now, looking back?";
    }

    // Family and relationship topics
    const relationshipKeywords = ['family', 'mother', 'father', 'parent', 'child', 'friend', 'spouse', 'partner'];
    if (relationshipKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return "Relationships are the threads that weave the tapestry of our lives. I can sense this person holds special meaning for you. How has this relationship shaped your understanding of yourself and what matters most?";
    }

    // Search for relevant entries with enhanced matching
    const relevantEntries = entries.filter(entry => {
      const entryText = (entry.content + ' ' + entry.title + ' ' + entry.tags.join(' ')).toLowerCase();
      const messageWords = lowercaseMessage.split(' ').filter(word => word.length > 3);
      return messageWords.some(word => entryText.includes(word));
    });

    if (relevantEntries.length > 0) {
      const randomEntry = relevantEntries[Math.floor(Math.random() * relevantEntries.length)];
      const entryDate = new Date(randomEntry.createdAt).toLocaleDateString();
      return `Your message reminds me of something beautiful you wrote in "${randomEntry.title}" on ${entryDate}. There's a connection here that feels meaningful. How do your thoughts today relate to what you were experiencing then?`;
    }

    // Enhanced default responses with more personality and depth
    const thoughtfulResponses = [
      "I find myself drawn to the deeper currents beneath your words. There's something here that feels significant. What aspects of this topic stir something within you?",
      
      "Your perspective always offers such rich material for reflection. I'm curious - how does this connect to your broader life story and the themes that matter most to you?",
      
      "There's wisdom in what you're sharing, even if it might not feel that way right now. Sometimes our most important insights come through exploring these very thoughts. What feels most alive or urgent about this for you?",
      
      "I sense there's more beneath the surface of what you're sharing. Our conversations often reveal unexpected connections. What drew you to bring this up today?",
      
      "Your words carry weight and meaning. I'm here to help you unpack whatever feels important. What would feel most valuable to explore about this topic?",
      
      "I notice this topic isn't something you've written about in your journal yet. Sometimes our conversations reveal new territories worth exploring. Would you like to delve deeper into this together?",
      
      "There's something in your message that suggests this matters to you in a particular way. I'm curious about what makes this significant in your life right now.",
      
      "Your thoughts often lead us to unexpected places of insight. What feels most important to understand or explore about what you've shared?"
    ];

    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    setLastUserMessage(userMessageText);
    setInput('');
    setIsTyping(true);

    // Add user message
    await addChatMessage({
      text: userMessageText,
      sender: 'user',
      sessionId: currentChatSession?.id,
    });

    // Generate and add bot response after a delay
    setTimeout(async () => {
      const botResponse = generateIntelligentResponse(userMessageText);
      await addChatMessage({
        text: botResponse,
        sender: 'bot',
        sessionId: currentChatSession?.id,
      });
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Slightly longer delay for more thoughtful responses
  };

  const handleNewSession = async () => {
    await createNewChatSession();
    setShowSessionMenu(false);
  };

  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentChatSession(session);
    await loadChatHistory(session.id);
    setShowSessionMenu(false);
  };

  const handleEditSession = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveSessionTitle = async () => {
    if (editingSessionId && editingTitle.trim()) {
      await updateChatSession(editingSessionId, { title: editingTitle.trim() });
      setEditingSessionId(null);
      setEditingTitle('');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (chatSessions.length > 1) {
      await deleteChatSession(sessionId);
    }
  };

  return (
    <div className="relative">
      {/* Session Management Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-white">
            {currentChatSession?.title || 'Legacy Scribe'}
          </h2>
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSessionMenu(!showSessionMenu)}
            icon={<MoreVertical className="h-4 w-4" />}
            className="border-white/30 text-white hover:bg-white/10"
          >
            Sessions
          </Button>
          
          {showSessionMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
              <div className="p-3 border-b border-gray-200">
                <Button
                  onClick={handleNewSession}
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  className="w-full"
                >
                  New Chat Session
                </Button>
              </div>
              
              <div className="p-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                      currentChatSession?.id === session.id ? 'bg-primary-50 border border-primary-200' : ''
                    }`}
                  >
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => handleSessionSelect(session)}
                    >
                      {editingSessionId === session.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={handleSaveSessionTitle}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveSessionTitle();
                            if (e.key === 'Escape') {
                              setEditingSessionId(null);
                              setEditingTitle('');
                            }
                          }}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.messageCount} messages • {session.lastMessageAt.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSession(session);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {chatSessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-lg p-3 animate-fade-in-up
                  ${message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                  }
                `}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center mb-2">
                    <Bot className="h-5 w-5 mr-2" />
                    <span className="font-medium">Legacy Scribe</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm border border-white/30">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">Legacy Scribe</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts with Legacy Scribe..."
              className="flex-1 rounded-md border border-white/30 px-3 py-2 text-sm bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              icon={<Send className="h-4 w-4" />}
              className="transform transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 min-w-[80px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl"
            >
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WisdomChatbot;