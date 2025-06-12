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
      const welcomeMessage = "Hello! I'm your Wisdom Assistant. I can help you explore your memories and reflect on your experiences. What would you like to discuss?";
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
        entry.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    );

    return relevantEntries.map(entry => entry.content);
  };

  const generateResponse = (userMessage: string): string => {
    const context = analyzeContext(userMessage);
    setMessageContext(context);
    
    if (userMessage === lastUserMessage) {
      return "I notice you've mentioned this before. Let's explore this from a different angle. What specific aspects would you like to discuss?";
    }

    const lowercaseMessage = userMessage.toLowerCase();
    
    // Enhanced greeting detection with personalized response based on journal entries
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    const isGreeting = greetings.some(greeting => lowercaseMessage.includes(greeting));
    
    if (isGreeting) {
      // Check if user has journal entries
      if (entries.length > 0) {
        const firstEntry = entries[entries.length - 1]; // Get the first entry (oldest)
        const recentEntry = entries[0]; // Get the most recent entry
        
        // Create a personalized greeting based on their journal history
        const greetingResponses = [
          `Hello there! It's wonderful to connect with you again. I see you've been documenting your journey with ${entries.length} journal entries. Your first entry "${firstEntry.title}" caught my attention - it seems like that was an important moment for you. How are you feeling about your journey since then?`,
          
          `Hi! Great to see you back. I've been reflecting on your memories, and your recent entry "${recentEntry.title}" seems particularly meaningful. I can sense there's depth to your experiences. Would you like to explore that further, or is there something else on your mind today?`,
          
          `Hello! I'm delighted you're here. Looking at your journal, I can see you've shared some beautiful memories, starting with "${firstEntry.title}". There's something special about first entries - they often capture a moment of decision to preserve our stories. What inspired you to begin this journey?`,
          
          `Hey there! Welcome back to our conversation. I notice you've been thoughtfully documenting your life with ${entries.length} entries. Your journey from "${firstEntry.title}" to "${recentEntry.title}" shows such growth and reflection. What's been on your heart lately that you'd like to explore together?`,
          
          `Hello! It's so good to see you again. I've been thinking about your story, especially your entry "${firstEntry.title}" - there was something profound about how you expressed yourself there. How has your perspective evolved since you wrote that?`
        ];
        
        return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      } else {
        // If no entries, encourage them to start their legacy journey
        return "Hello! I'm so glad you're here. I'm your Wisdom Assistant, and I'm here to help you explore and preserve your memories. Since you're just starting your digital legacy journey, I'd love to hear about what brought you here today. What story or memory would you like to begin with?";
      }
    }
    
    // Check for question patterns
    if (lowercaseMessage.includes('?')) {
      if (lowercaseMessage.includes('why')) {
        return "That's a thoughtful question. Based on your journal entries, let's explore the underlying reasons together.";
      }
      if (lowercaseMessage.includes('how')) {
        return "Good question. Let's break this down and examine your experiences related to this topic.";
      }
      if (lowercaseMessage.includes('what')) {
        return "Let's reflect on your past experiences and insights about this.";
      }
    }

    // Check for emotional content
    const emotionalWords = ['feel', 'sad', 'happy', 'angry', 'worried', 'excited'];
    if (emotionalWords.some(word => lowercaseMessage.includes(word))) {
      return "I can sense this holds emotional significance for you. Would you like to explore these feelings further?";
    }

    // Search for relevant entries
    const relevantEntries = entries.filter(entry => 
      entry.content.toLowerCase().includes(lowercaseMessage) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseMessage))
    );

    if (relevantEntries.length > 0) {
      const randomEntry = relevantEntries[Math.floor(Math.random() * relevantEntries.length)];
      return `I found a relevant memory from your journal about "${randomEntry.title}". Would you like to reflect on this experience?`;
    }

    // Default responses with context awareness
    const defaultResponses = [
      "That's an interesting perspective. How does this relate to your recent experiences?",
      "I notice this topic isn't in your journal yet. Would you like to create a new entry about it?",
      "This could be a meaningful area for reflection. What aspects resonate most with you?",
      "Let's explore this together. How does this connect to your personal journey?",
      "What memories or feelings does this bring up for you?",
      "How has your perspective on this changed over time?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      const botResponse = generateResponse(userMessageText);
      await addChatMessage({
        text: botResponse,
        sender: 'bot',
        sessionId: currentChatSession?.id,
      });
      setIsTyping(false);
    }, 800 + Math.random() * 800);
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
            {currentChatSession?.title || 'Wisdom Assistant'}
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
                    <span className="font-medium">Wisdom Assistant</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
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
                  <span className="font-medium">Wisdom Assistant</span>
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
              placeholder="Type your message..."
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