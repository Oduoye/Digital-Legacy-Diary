import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Plus, MessageSquare, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useDiary } from '../../context/DiaryContext';
import { ChatMessage, ChatSession } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Enhanced conversation context tracking
interface ConversationContext {
  currentTopic: string | null;
  userMood: 'positive' | 'negative' | 'neutral' | 'reflective' | 'seeking_advice';
  conversationFlow: 'greeting' | 'deep_discussion' | 'advice_seeking' | 'memory_sharing' | 'emotional_support';
  recentKeywords: string[];
  userPreferences: {
    responseStyle: 'supportive' | 'analytical' | 'conversational';
    topicsOfInterest: string[];
  };
  lastUserIntent: string | null;
  emotionalCues: string[];
}

// Enhanced response generation system
class LegacyScribeAI {
  private context: ConversationContext;
  private conversationHistory: ChatMessage[];
  private userEntries: any[];

  constructor(entries: any[], chatHistory: ChatMessage[]) {
    this.userEntries = entries;
    this.conversationHistory = chatHistory;
    this.context = {
      currentTopic: null,
      userMood: 'neutral',
      conversationFlow: 'greeting',
      recentKeywords: [],
      userPreferences: {
        responseStyle: 'supportive',
        topicsOfInterest: []
      },
      lastUserIntent: null,
      emotionalCues: []
    };
  }

  // Analyze user input for emotional cues and intent
  private analyzeUserInput(message: string): {
    emotion: string;
    intent: string;
    keywords: string[];
    urgency: 'low' | 'medium' | 'high';
    needsValidation: boolean;
  } {
    const lowercaseMessage = message.toLowerCase();
    
    // Emotional analysis
    const emotionalIndicators = {
      sadness: ['sad', 'grief', 'loss', 'mourning', 'heartbroken', 'melancholy', 'depressed', 'down', 'upset', 'crying'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'fearful', 'scared', 'panic', 'afraid'],
      anger: ['angry', 'frustrated', 'irritated', 'furious', 'annoyed', 'mad', 'rage', 'hate'],
      joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'elated', 'wonderful', 'amazing', 'great'],
      confusion: ['confused', 'lost', 'unclear', 'don\'t understand', 'puzzled', 'bewildered'],
      gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'thank you'],
      loneliness: ['lonely', 'alone', 'isolated', 'nobody', 'empty', 'disconnected'],
      hope: ['hope', 'optimistic', 'looking forward', 'excited about', 'can\'t wait']
    };

    let detectedEmotion = 'neutral';
    let emotionStrength = 0;

    for (const [emotion, words] of Object.entries(emotionalIndicators)) {
      const matches = words.filter(word => lowercaseMessage.includes(word)).length;
      if (matches > emotionStrength) {
        emotionStrength = matches;
        detectedEmotion = emotion;
      }
    }

    // Intent analysis
    const intentPatterns = {
      seeking_advice: ['what should i', 'how do i', 'advice', 'help me', 'what would you', 'recommend'],
      sharing_memory: ['remember', 'when i', 'back then', 'used to', 'memory', 'childhood'],
      asking_question: ['?', 'why', 'how', 'what', 'when', 'where', 'who'],
      expressing_feeling: ['feel', 'feeling', 'emotion', 'think', 'believe'],
      seeking_validation: ['am i', 'is it okay', 'is this normal', 'do you think'],
      wanting_to_talk: ['tell you', 'share', 'talk about', 'discuss'],
      expressing_gratitude: ['thank', 'grateful', 'appreciate'],
      expressing_disagreement: ['no', 'but', 'however', 'disagree', 'not really', 'actually']
    };

    let detectedIntent = 'general_conversation';
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => lowercaseMessage.includes(pattern))) {
        detectedIntent = intent;
        break;
      }
    }

    // Extract keywords (excluding common words)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
    const words = message.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !commonWords.has(word) && /^[a-zA-Z]+$/.test(word)
    );

    // Determine urgency and validation needs
    const urgencyIndicators = ['urgent', 'emergency', 'crisis', 'help', 'desperate', 'immediately'];
    const validationIndicators = ['am i', 'is it okay', 'normal', 'right', 'wrong', 'should i'];

    const urgency = urgencyIndicators.some(indicator => lowercaseMessage.includes(indicator)) ? 'high' :
                   ['worried', 'anxious', 'confused'].some(word => lowercaseMessage.includes(word)) ? 'medium' : 'low';

    const needsValidation = validationIndicators.some(indicator => lowercaseMessage.includes(indicator)) ||
                           detectedIntent === 'seeking_validation';

    return {
      emotion: detectedEmotion,
      intent: detectedIntent,
      keywords: words,
      urgency,
      needsValidation
    };
  }

  // Update conversation context based on analysis
  private updateContext(analysis: any, userMessage: string) {
    this.context.lastUserIntent = analysis.intent;
    this.context.emotionalCues = [...this.context.emotionalCues.slice(-2), analysis.emotion];
    this.context.recentKeywords = [...this.context.recentKeywords.slice(-5), ...analysis.keywords];

    // Update mood based on emotional analysis
    if (['sadness', 'anxiety', 'anger', 'loneliness'].includes(analysis.emotion)) {
      this.context.userMood = 'negative';
    } else if (['joy', 'gratitude', 'hope'].includes(analysis.emotion)) {
      this.context.userMood = 'positive';
    } else if (['confusion'].includes(analysis.emotion)) {
      this.context.userMood = 'seeking_advice';
    } else {
      this.context.userMood = 'neutral';
    }

    // Update conversation flow
    if (analysis.intent === 'seeking_advice') {
      this.context.conversationFlow = 'advice_seeking';
    } else if (analysis.intent === 'sharing_memory') {
      this.context.conversationFlow = 'memory_sharing';
    } else if (this.context.userMood === 'negative') {
      this.context.conversationFlow = 'emotional_support';
    } else {
      this.context.conversationFlow = 'deep_discussion';
    }
  }

  // Generate contextually appropriate response
  generateResponse(userMessage: string): string {
    const analysis = this.analyzeUserInput(userMessage);
    this.updateContext(analysis, userMessage);

    // Handle immediate emotional needs first
    if (analysis.urgency === 'high' || this.context.userMood === 'negative') {
      return this.generateEmotionalSupportResponse(analysis, userMessage);
    }

    // Handle validation requests
    if (analysis.needsValidation) {
      return this.generateValidationResponse(analysis, userMessage);
    }

    // Handle disagreement or correction
    if (analysis.intent === 'expressing_disagreement') {
      return this.generateAdaptiveResponse(analysis, userMessage);
    }

    // Handle specific intents
    switch (analysis.intent) {
      case 'seeking_advice':
        return this.generateAdviceResponse(analysis, userMessage);
      case 'sharing_memory':
        return this.generateMemoryResponse(analysis, userMessage);
      case 'asking_question':
        return this.generateQuestionResponse(analysis, userMessage);
      case 'expressing_gratitude':
        return this.generateGratitudeResponse(analysis, userMessage);
      default:
        return this.generateContextualResponse(analysis, userMessage);
    }
  }

  private generateEmotionalSupportResponse(analysis: any, userMessage: string): string {
    const supportiveResponses = {
      sadness: [
        "I can hear the sadness in your words, and I want you to know that what you're feeling is completely valid. Grief and sadness are natural responses to loss and difficult experiences. Would you like to share what's weighing on your heart right now?",
        "Your sadness speaks to the depth of your caring and the significance of what you've experienced. Sometimes our deepest pain comes from our deepest love. I'm here to listen and support you through this.",
        "I sense you're carrying some heavy emotions right now. It takes courage to acknowledge and express sadness. What would feel most helpful for you in this moment?"
      ],
      anxiety: [
        "I can feel the worry and anxiety in your message. These feelings can be overwhelming, but you're not alone in experiencing them. Let's take this one step at a time. What's the main thing that's causing you concern right now?",
        "Anxiety often signals that something important to us feels uncertain or threatened. Your feelings are valid, and it's okay to feel this way. What would help you feel more grounded in this moment?",
        "I hear the anxiety in your words. Sometimes when we're worried, it helps to focus on what we can control. What aspects of this situation feel most manageable to you right now?"
      ],
      anger: [
        "I can sense the frustration and anger in your message. These are powerful emotions that often point to something important - perhaps a boundary that's been crossed or a value that's been challenged. What's at the heart of this anger for you?",
        "Your anger is telling us something important. It's a valid emotion that deserves to be heard and understood. What feels most important to address about this situation?",
        "I hear the intensity of your feelings. Anger often emerges when we feel powerless or when something we care deeply about is threatened. What would feel most empowering for you right now?"
      ],
      loneliness: [
        "I hear the loneliness in your words, and I want you to know that reaching out here shows incredible strength. Feeling isolated is one of the most difficult human experiences. You're not as alone as you might feel right now.",
        "Loneliness can feel so overwhelming, but the fact that you're sharing this with me shows your courage to connect. What kinds of connections have felt most meaningful to you in the past?",
        "I sense you're feeling disconnected right now. That's such a painful place to be. Sometimes sharing our stories and memories can help us feel more connected to ourselves and others. What's one memory that makes you feel most like yourself?"
      ]
    };

    const responses = supportiveResponses[analysis.emotion as keyof typeof supportiveResponses];
    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return "I can sense you're going through something difficult right now. Your feelings are valid and important. I'm here to listen and support you. What would feel most helpful for you in this moment?";
  }

  private generateValidationResponse(analysis: any, userMessage: string): string {
    const validationResponses = [
      "What you're feeling and thinking is completely valid. There's no 'right' or 'wrong' way to experience life's complexities. Your perspective and emotions make sense given your unique journey.",
      "You're asking such an important question, and it shows your thoughtfulness and self-awareness. Trust your instincts - you know yourself better than anyone else.",
      "It's so normal to question ourselves and seek validation. The fact that you're reflecting on this shows your wisdom and care. What does your heart tell you about this?",
      "Your concerns and questions are completely understandable. Many people have walked similar paths and felt similar uncertainties. You're not alone in this experience.",
      "There's no universal 'normal' - there's only what's authentic and true for you. Your feelings and reactions are valid responses to your unique life experiences."
    ];

    return validationResponses[Math.floor(Math.random() * validationResponses.length)];
  }

  private generateAdaptiveResponse(analysis: any, userMessage: string): string {
    const adaptiveResponses = [
      "I hear you, and I appreciate you sharing your perspective. You know your experience better than anyone else. Help me understand what feels most important to you about this.",
      "Thank you for that insight. You're absolutely right to correct me or share a different viewpoint. What would you like to explore about this instead?",
      "I value your perspective and want to make sure I'm understanding you correctly. It sounds like there's something different you'd like to focus on. What feels most relevant to you right now?",
      "You're the expert on your own life and experiences. I appreciate you guiding our conversation toward what matters most to you. What would you like to talk about?",
      "I hear you redirecting our conversation, and that's completely valid. You know what you need to discuss. What's really on your mind today?"
    ];

    return adaptiveResponses[Math.floor(Math.random() * adaptiveResponses.length)];
  }

  private generateAdviceResponse(analysis: any, userMessage: string): string {
    // Look for relevant entries based on keywords
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      const entry = relevantEntries[0];
      return `That's such an important question you're asking. Looking at your journey, I'm reminded of something you wrote in "${entry.title}" where you reflected on similar themes. Based on your own wisdom and experiences, what approaches have served you well in the past when facing similar decisions?`;
    }

    const adviceResponses = [
      "That's a profound question that deserves thoughtful consideration. From what I've learned about your journey through your writings, you have a strong sense of wisdom and intuition. What does your inner voice tell you about this situation?",
      "You're asking about something that clearly matters deeply to you. Sometimes the best advice comes from reflecting on our own values and past experiences. What principles have guided you through difficult decisions before?",
      "This is such an important question, and I can sense how much thought you've put into it. Based on your life experiences and the wisdom you've shared in your journal, what feels most aligned with who you are and what you value?",
      "You're seeking guidance on something significant, and that shows your thoughtfulness. Looking at the patterns in your life and the lessons you've learned, what approach feels most authentic to you?"
    ];

    return adviceResponses[Math.floor(Math.random() * adviceResponses.length)];
  }

  private generateMemoryResponse(analysis: any, userMessage: string): string {
    const memoryResponses = [
      "Thank you for sharing that memory with me. There's something beautiful about how our past experiences shape who we are today. What emotions or insights does this memory bring up for you now?",
      "I love how you're connecting with your past experiences. Memories have such power to teach us about ourselves and what matters most. What does this memory reveal about your values or the person you've become?",
      "That memory sounds significant to you. Our past experiences often hold keys to understanding our present selves. How do you think this experience influenced the path your life has taken?",
      "Thank you for trusting me with that memory. There's wisdom in reflecting on our past experiences. What would you want future generations to understand about this part of your journey?"
    ];

    return memoryResponses[Math.floor(Math.random() * memoryResponses.length)];
  }

  private generateQuestionResponse(analysis: any, userMessage: string): string {
    // Try to find relevant context from user's entries
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      return `That's a thoughtful question. I notice you've written about related themes in your journal entries. Your own reflections might hold some insights. What connections do you see between this question and your life experiences?`;
    }

    const questionResponses = [
      "That's such a meaningful question. Questions like this often lead to the most important discoveries about ourselves. What draws you to explore this particular aspect of life?",
      "I appreciate the depth of your question. Sometimes the most profound insights come from sitting with questions rather than rushing to answers. What thoughts or feelings does this question stir up for you?",
      "You're asking about something that clearly resonates with you. The questions we ask often reveal what matters most to us. What makes this question particularly important to you right now?",
      "That's a question worth exploring deeply. Your curiosity about this topic suggests it connects to something meaningful in your life. What experiences have led you to wonder about this?"
    ];

    return questionResponses[Math.floor(Math.random() * questionResponses.length)];
  }

  private generateGratitudeResponse(analysis: any, userMessage: string): string {
    const gratitudeResponses = [
      "Your gratitude is so touching to witness. It speaks to your ability to find meaning and beauty even in life's complexities. What you're grateful for often reveals what you value most deeply.",
      "Thank you for sharing your appreciation. Gratitude has such power to transform our perspective and connect us to what truly matters. What about this experience fills you with such thankfulness?",
      "I'm moved by your gratitude. It's a beautiful reflection of your character and your ability to recognize the gifts in your life. How has cultivating gratitude shaped your outlook over the years?",
      "Your thankfulness is beautiful to hear. Gratitude often opens our hearts to deeper connections and insights. What does this gratitude teach you about what brings meaning to your life?"
    ];

    return gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)];
  }

  private generateContextualResponse(analysis: any, userMessage: string): string {
    // Check conversation history for context
    const recentMessages = this.conversationHistory.slice(-4);
    const hasBeenDiscussing = recentMessages.some(msg => 
      analysis.keywords.some(keyword => 
        msg.text.toLowerCase().includes(keyword)
      )
    );

    if (hasBeenDiscussing) {
      return `I can see this topic is really important to you, and I appreciate you continuing to share your thoughts about it. What new insights or feelings are emerging for you as we explore this together?`;
    }

    // Look for relevant entries
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      const entry = relevantEntries[Math.floor(Math.random() * Math.min(relevantEntries.length, 3))];
      return `What you're sharing reminds me of the wisdom in your journal entry "${entry.title}." There's a beautiful connection between what you're expressing now and the insights you've captured before. How do these thoughts feel different or similar to what you were experiencing then?`;
    }

    // Default contextual responses based on mood and flow
    const contextualResponses = {
      positive: [
        "I can sense the positive energy in what you're sharing. There's something wonderful about how you're reflecting on this. What aspects of this experience bring you the most joy or satisfaction?",
        "Your perspective on this is really insightful. I love how you're approaching this topic with such openness. What discoveries are you making about yourself through this reflection?"
      ],
      reflective: [
        "I can feel the depth of your reflection in what you're sharing. You're touching on something that clearly holds meaning for you. What insights are emerging as you think about this?",
        "There's such thoughtfulness in how you're approaching this topic. Your reflective nature is one of your strengths. What patterns or connections are you noticing?"
      ],
      neutral: [
        "Thank you for sharing that with me. I'm curious to understand more about your perspective on this. What aspects of this topic feel most significant to you?",
        "I appreciate you bringing this up. There's always more to explore beneath the surface. What draws you to think about this particular aspect of your experience?"
      ]
    };

    const moodResponses = contextualResponses[this.context.userMood as keyof typeof contextualResponses] || contextualResponses.neutral;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  }

  private findRelevantEntries(keywords: string[]): any[] {
    if (keywords.length === 0) return [];

    return this.userEntries.filter(entry => {
      const entryText = (entry.content + ' ' + entry.title + ' ' + entry.tags.join(' ')).toLowerCase();
      return keywords.some(keyword => entryText.includes(keyword));
    }).slice(0, 3);
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

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (currentChatSession && chatMessages.length === 0) {
      const welcomeMessage = "Hello! I'm Legacy Scribe, your personal memory companion. I've been studying your journal entries and I'm here to help you explore your memories, reflect on your experiences, and discover deeper insights about your life's journey. I'm designed to listen carefully to what you share and respond thoughtfully to your unique perspective. What would you like to discuss today?";
      addChatMessage({
        text: welcomeMessage,
        sender: 'bot',
        sessionId: currentChatSession.id,
      });
    }
  }, [currentChatSession, chatMessages.length]);

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

    // Generate AI response with enhanced intelligence
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
    }, 1200 + Math.random() * 800);
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