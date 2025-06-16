import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Plus, MessageSquare, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useDiary } from '../../context/DiaryContext';
import { ChatMessage, ChatSession } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Simple conversation context tracking
interface ConversationContext {
  messageCount: number;
  lastTopics: string[];
  userMood: 'positive' | 'negative' | 'neutral';
  hasGreeted: boolean;
}

// Enhanced response generation system
class LegacyScribeAI {
  private context: ConversationContext;
  private conversationHistory: ChatMessage[];
  private userEntries: any[];
  private usedResponses: Set<string>;

  constructor(entries: any[], chatHistory: ChatMessage[]) {
    this.userEntries = entries;
    this.conversationHistory = chatHistory;
    this.usedResponses = new Set();
    this.context = {
      messageCount: chatHistory.length,
      lastTopics: [],
      userMood: 'neutral',
      hasGreeted: chatHistory.some(msg => msg.sender === 'bot')
    };
  }

  // Analyze user input for basic understanding
  private analyzeUserInput(message: string): {
    emotion: string;
    intent: string;
    keywords: string[];
    isQuestion: boolean;
    isGreeting: boolean;
  } {
    const lowercaseMessage = message.toLowerCase();
    
    // Detect emotions
    let emotion = 'neutral';
    if (['sad', 'upset', 'depressed', 'down'].some(word => lowercaseMessage.includes(word))) {
      emotion = 'sad';
    } else if (['happy', 'excited', 'great', 'wonderful'].some(word => lowercaseMessage.includes(word))) {
      emotion = 'happy';
    } else if (['worried', 'anxious', 'nervous', 'stressed'].some(word => lowercaseMessage.includes(word))) {
      emotion = 'anxious';
    }

    // Detect intent
    let intent = 'general';
    if (['help', 'advice', 'what should'].some(phrase => lowercaseMessage.includes(phrase))) {
      intent = 'seeking_advice';
    } else if (['remember', 'memory', 'childhood', 'past'].some(word => lowercaseMessage.includes(word))) {
      intent = 'sharing_memory';
    } else if (['feel', 'feeling', 'emotion'].some(word => lowercaseMessage.includes(word))) {
      intent = 'expressing_feeling';
    }

    // Check if it's a question or greeting
    const isQuestion = message.includes('?') || lowercaseMessage.startsWith('what') || lowercaseMessage.startsWith('how') || lowercaseMessage.startsWith('why');
    const isGreeting = ['hi', 'hello', 'hey', 'good morning', 'good afternoon'].some(greeting => lowercaseMessage.includes(greeting));

    // Extract keywords (simple approach)
    const words = message.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'have', 'from', 'they', 'been', 'have', 'their', 'said', 'each', 'which', 'what', 'were', 'when', 'your', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way', 'you'].includes(word)
    );

    return {
      emotion,
      intent,
      keywords: words.slice(0, 3), // Take top 3 keywords
      isQuestion,
      isGreeting
    };
  }

  // Generate natural, conversational responses
  generateResponse(userMessage: string): string {
    const analysis = this.analyzeUserInput(userMessage);
    
    // Update context
    this.context.messageCount++;
    this.context.lastTopics = [...this.context.lastTopics.slice(-2), ...analysis.keywords];
    this.context.userMood = analysis.emotion === 'happy' ? 'positive' : 
                           analysis.emotion === 'sad' || analysis.emotion === 'anxious' ? 'negative' : 'neutral';

    // Handle greetings naturally
    if (analysis.isGreeting) {
      const greetingResponses = [
        "Hi there! I'm so glad you're here. What's on your mind today?",
        "Hello! It's wonderful to connect with you. What would you like to explore together?",
        "Hey! I'm here and ready to listen. What's been happening in your world?",
        "Hi! Thanks for stopping by. What's something you'd like to talk about?"
      ];
      return this.getUniqueResponse(greetingResponses);
    }

    // Handle different intents with natural responses
    switch (analysis.intent) {
      case 'seeking_advice':
        return this.generateAdviceResponse(analysis, userMessage);
      case 'sharing_memory':
        return this.generateMemoryResponse(analysis, userMessage);
      case 'expressing_feeling':
        return this.generateEmotionalResponse(analysis, userMessage);
      default:
        return this.generateGeneralResponse(analysis, userMessage);
    }
  }

  private generateAdviceResponse(analysis: any, userMessage: string): string {
    const responses = [
      "That's a really thoughtful question. From what I know about your journey, what feels right to you in your gut?",
      "I can sense this is important to you. What options are you considering, and which one feels most aligned with who you are?",
      "That's something worth exploring. What would your wisest self tell you about this situation?",
      "I hear you asking for guidance. What do you think someone who really knows you would suggest?",
      "That's a meaningful question. What feels like the next right step for you?"
    ];
    return this.getUniqueResponse(responses);
  }

  private generateMemoryResponse(analysis: any, userMessage: string): string {
    const responses = [
      "I love that you're sharing this memory with me. What makes this moment stand out to you?",
      "Thank you for opening up about that. What feelings come up when you think about it now?",
      "That sounds like a significant memory. How do you think it shaped who you are today?",
      "I'm honored you're sharing this with me. What would you want others to understand about this experience?",
      "That memory seems meaningful to you. What wisdom did you gain from that time?"
    ];
    return this.getUniqueResponse(responses);
  }

  private generateEmotionalResponse(analysis: any, userMessage: string): string {
    if (this.context.userMood === 'negative') {
      const supportiveResponses = [
        "I can hear that you're going through something difficult. Your feelings make complete sense.",
        "It sounds like you're carrying some heavy emotions right now. That takes courage to acknowledge.",
        "I'm here with you in this. What would feel most supportive right now?",
        "Thank you for trusting me with how you're feeling. What's weighing most heavily on your heart?"
      ];
      return this.getUniqueResponse(supportiveResponses);
    } else if (this.context.userMood === 'positive') {
      const celebratoryResponses = [
        "I can feel the joy in your words! What's bringing you this happiness?",
        "That's wonderful to hear! Tell me more about what's going well.",
        "Your positive energy is contagious! What's been the highlight for you?",
        "I love hearing this from you! What's making this time special?"
      ];
      return this.getUniqueResponse(celebratoryResponses);
    } else {
      const neutralResponses = [
        "I'm listening. What's going on in your world right now?",
        "Tell me more about what you're experiencing.",
        "I'm here for whatever you'd like to share.",
        "What's on your heart today?"
      ];
      return this.getUniqueResponse(neutralResponses);
    }
  }

  private generateGeneralResponse(analysis: any, userMessage: string): string {
    // Look for relevant entries based on keywords
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0 && Math.random() > 0.5) {
      const entry = relevantEntries[0];
      const responses = [
        `That reminds me of something you wrote in "${entry.title}." There seems to be a connection there. What do you think?`,
        `I'm thinking about your journal entry "${entry.title}" - there might be some wisdom there that relates to this.`,
        `This connects to themes I've noticed in your writing, especially in "${entry.title}." How do you see the connection?`
      ];
      return this.getUniqueResponse(responses);
    }

    // General conversational responses
    const generalResponses = [
      "That's interesting. Tell me more about your thoughts on this.",
      "I'm curious to hear more about your perspective on this.",
      "What draws you to think about this right now?",
      "That's worth exploring. What feels most important about this to you?",
      "I'd love to understand this better from your point of view.",
      "What's behind this thought for you?",
      "That's something to sit with. What comes up for you when you think about it?",
      "I'm listening. What else is on your mind about this?"
    ];
    
    return this.getUniqueResponse(generalResponses);
  }

  private getUniqueResponse(responses: string[]): string {
    // Filter out recently used responses
    const availableResponses = responses.filter(response => 
      !this.usedResponses.has(response.substring(0, 20))
    );
    
    const selectedResponses = availableResponses.length > 0 ? availableResponses : responses;
    const response = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
    
    // Track usage
    this.usedResponses.add(response.substring(0, 20));
    
    // Keep only recent responses in memory
    if (this.usedResponses.size > 10) {
      const firstUsed = this.usedResponses.values().next().value;
      this.usedResponses.delete(firstUsed);
    }
    
    return response;
  }

  private findRelevantEntries(keywords: string[]): any[] {
    if (keywords.length === 0) return [];

    return this.userEntries.filter(entry => {
      const entryText = (entry.content + ' ' + entry.title + ' ' + entry.tags.join(' ')).toLowerCase();
      return keywords.some(keyword => entryText.includes(keyword));
    }).slice(0, 2);
  }
}

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
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI instance
  const aiRef = useRef<LegacyScribeAI | null>(null);

  useEffect(() => {
    aiRef.current = new LegacyScribeAI(entries, chatMessages);
  }, [entries, chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    setInput('');
    setIsTyping(true);

    // Add user message
    await addChatMessage({
      text: userMessageText,
      sender: 'user',
      sessionId: currentChatSession?.id,
    });

    // Generate AI response with more natural timing
    setTimeout(async () => {
      if (aiRef.current) {
        const botResponse = aiRef.current.generateResponse(userMessageText);
        await addChatMessage({
          text: botResponse,
          sender: 'bot',
          sessionId: currentChatSession?.id,
        });
      }
      setIsTyping(false);
    }, 800 + Math.random() * 600); // More natural response time
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
                  max-w-[85%] rounded-lg p-4 animate-fade-in-up
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm border border-white/30">
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