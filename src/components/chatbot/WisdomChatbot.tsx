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
  conversationHistory: string[];
  lastResponseType: string | null;
  userPersonality: {
    isReflective: boolean;
    prefersDeepConversation: boolean;
    respondsWellToQuestions: boolean;
    sharesPersonalStories: boolean;
  };
  sessionMemory: {
    mentionedPeople: string[];
    discussedTopics: string[];
    emotionalMoments: string[];
  };
}

// Enhanced response generation system
class LegacyScribeAI {
  private context: ConversationContext;
  private conversationHistory: ChatMessage[];
  private userEntries: any[];
  private responseVariations: Map<string, string[]>;
  private conversationStarters: string[];
  private followUpQuestions: Map<string, string[]>;

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
      emotionalCues: [],
      conversationHistory: [],
      lastResponseType: null,
      userPersonality: {
        isReflective: false,
        prefersDeepConversation: false,
        respondsWellToQuestions: false,
        sharesPersonalStories: false
      },
      sessionMemory: {
        mentionedPeople: [],
        discussedTopics: [],
        emotionalMoments: []
      }
    };

    // Initialize diverse response variations
    this.responseVariations = new Map([
      ['greeting', [
        "Hello! I'm Legacy Scribe, your personal memory companion. I've been getting to know you through your journal entries, and I'm genuinely excited to explore your life's journey with you. What's been on your mind lately?",
        "Welcome! I'm Legacy Scribe, and it's wonderful to meet you. I've been learning about your unique story through your writings, and I'm here to help you reflect, discover insights, and preserve your wisdom. What would you like to talk about today?",
        "Hi there! I'm Legacy Scribe, your AI companion for memory exploration. I've been studying your journal entries with great interest, and I'm here to help you uncover the deeper meanings in your experiences. What's drawing your attention today?",
        "Greetings! I'm Legacy Scribe, and I'm honored to be part of your legacy journey. Through your writings, I've glimpsed the richness of your experiences, and I'm here to help you explore them further. What's on your heart today?"
      ]],
      ['encouragement', [
        "That's such a beautiful way to look at it. Your perspective shows real wisdom.",
        "I can feel the depth of meaning in what you're sharing. There's something profound here.",
        "Your reflection touches on something really important. This kind of insight is precious.",
        "What you're expressing shows such thoughtfulness. These are the moments that define us.",
        "There's real beauty in how you're processing this experience.",
        "Your words carry such authenticity. This is exactly the kind of wisdom worth preserving."
      ]],
      ['curiosity', [
        "I'm genuinely curious about that. What emotions come up when you think about it now?",
        "That sounds like it holds special significance. What made that moment stand out for you?",
        "I'd love to understand this better. How did that experience shape your perspective?",
        "That's fascinating. What would you want future generations to know about this?",
        "I can sense there's more to this story. What details make it particularly meaningful to you?",
        "That resonates deeply. What lessons emerged from that experience?"
      ]],
      ['validation', [
        "Your feelings about this are completely valid and show your humanity.",
        "Anyone would be moved by an experience like that. Your response makes perfect sense.",
        "It's completely natural to feel this way about something so significant.",
        "Your reaction shows how much this meant to you, and that's beautiful.",
        "These feelings honor the importance of what you experienced.",
        "Your emotional response reflects the depth of your caring nature."
      ]],
      ['memory_exploration', [
        "That memory seems to hold special power for you. What makes it so vivid even now?",
        "I can tell this memory is important to you. What feelings does it bring up today?",
        "There's something magical about how certain memories stay with us. What keeps drawing you back to this one?",
        "That sounds like a defining moment. How do you think it influenced who you became?",
        "Memories like this are treasures. What would you want your loved ones to understand about this experience?"
      ]],
      ['wisdom_seeking', [
        "Your question touches on something profound. What insights have you gathered about this over time?",
        "That's the kind of question that reveals deep thinking. What's your heart telling you?",
        "You're exploring something really meaningful here. What wisdom have your experiences taught you?",
        "That's a beautiful question to ponder. What patterns do you notice in your own journey?",
        "Your curiosity about this shows real wisdom. What truths have you discovered along the way?"
      ]]
    ]);

    // Conversation starters for when the bot needs to gently guide
    this.conversationStarters = [
      "I've been thinking about something you wrote recently. Would you like to explore it together?",
      "Your journal entries reveal such interesting patterns. What themes do you notice in your own writing?",
      "I'm curious about a memory that seems particularly meaningful to you. Would you like to dive deeper into it?",
      "There's a beautiful thread running through your entries about relationships. What insights have you gained about connection?",
      "I notice you often write about growth and change. What's been the most significant transformation in your life?",
      "Your writing shows such appreciation for life's small moments. What recent experience brought you joy?"
    ];

    // Follow-up questions based on topics
    this.followUpQuestions = new Map([
      ['family', [
        "What family traditions mean the most to you?",
        "How has your understanding of family evolved over time?",
        "What values do you hope to pass down to future generations?",
        "What family stories do you want to make sure are never forgotten?"
      ]],
      ['growth', [
        "What moment taught you the most about yourself?",
        "How do you think you've changed in the past few years?",
        "What challenges helped shape who you are today?",
        "What advice would you give to someone facing similar growth?"
      ]],
      ['relationships', [
        "What makes a relationship truly meaningful to you?",
        "How have your closest relationships shaped your worldview?",
        "What have you learned about love and connection over the years?",
        "What relationship wisdom would you want to share?"
      ]],
      ['memories', [
        "What makes certain memories stay so vivid while others fade?",
        "Which of your memories do you return to most often?",
        "What memory always makes you smile when you think of it?",
        "What experience do you wish you could relive?"
      ]]
    ]);
  }

  // Analyze user input with enhanced emotional intelligence
  private analyzeUserInput(message: string): {
    emotion: string;
    intent: string;
    keywords: string[];
    urgency: 'low' | 'medium' | 'high';
    needsValidation: boolean;
    isRepeatTopic: boolean;
    personalityClues: string[];
    topicCategory: string;
  } {
    const lowercaseMessage = message.toLowerCase();
    
    // Check if this is a repeat topic
    const isRepeatTopic = this.context.conversationHistory.some(prev => 
      this.calculateSimilarity(prev, lowercaseMessage) > 0.6
    );
    
    // Enhanced emotional analysis
    const emotionalIndicators = {
      sadness: ['sad', 'grief', 'loss', 'mourning', 'heartbroken', 'melancholy', 'depressed', 'down', 'upset', 'crying', 'miss', 'gone', 'died'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'fearful', 'scared', 'panic', 'afraid', 'uncertain', 'doubt'],
      anger: ['angry', 'frustrated', 'irritated', 'furious', 'annoyed', 'mad', 'rage', 'hate', 'unfair', 'injustice'],
      joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'elated', 'wonderful', 'amazing', 'great', 'love', 'beautiful', 'perfect'],
      confusion: ['confused', 'lost', 'unclear', 'don\'t understand', 'puzzled', 'bewildered', 'uncertain', 'mixed up'],
      gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'thank you', 'fortunate', 'lucky'],
      loneliness: ['lonely', 'alone', 'isolated', 'nobody', 'empty', 'disconnected', 'solitary'],
      hope: ['hope', 'optimistic', 'looking forward', 'excited about', 'can\'t wait', 'future', 'dreams', 'possibilities'],
      nostalgia: ['remember', 'used to', 'back then', 'childhood', 'younger', 'past', 'memories', 'miss those days'],
      pride: ['proud', 'accomplished', 'achieved', 'success', 'overcome', 'persevered', 'strong']
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

    // Enhanced intent analysis
    const intentPatterns = {
      seeking_advice: ['what should i', 'how do i', 'advice', 'help me', 'what would you', 'recommend', 'suggest', 'guidance'],
      sharing_memory: ['remember', 'when i', 'back then', 'used to', 'memory', 'childhood', 'happened', 'time when'],
      asking_question: ['?', 'why', 'how', 'what', 'when', 'where', 'who', 'wonder', 'curious'],
      expressing_feeling: ['feel', 'feeling', 'emotion', 'think', 'believe', 'sense', 'experience'],
      seeking_validation: ['am i', 'is it okay', 'is this normal', 'do you think', 'right or wrong', 'should i feel'],
      wanting_to_talk: ['tell you', 'share', 'talk about', 'discuss', 'want to say'],
      expressing_gratitude: ['thank', 'grateful', 'appreciate', 'blessed'],
      expressing_disagreement: ['no', 'but', 'however', 'disagree', 'not really', 'actually', 'different'],
      reflecting: ['realize', 'understand', 'learned', 'discovered', 'insight', 'perspective', 'growth'],
      storytelling: ['story', 'happened', 'experience', 'event', 'situation', 'encounter']
    };

    let detectedIntent = 'general_conversation';
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => lowercaseMessage.includes(pattern))) {
        detectedIntent = intent;
        break;
      }
    }

    // Personality clues detection
    const personalityClues = [];
    if (lowercaseMessage.includes('think') || lowercaseMessage.includes('reflect') || lowercaseMessage.includes('consider')) {
      personalityClues.push('reflective');
    }
    if (lowercaseMessage.includes('deep') || lowercaseMessage.includes('meaning') || lowercaseMessage.includes('purpose')) {
      personalityClues.push('deep_thinker');
    }
    if (lowercaseMessage.includes('story') || lowercaseMessage.includes('experience') || lowercaseMessage.includes('happened')) {
      personalityClues.push('storyteller');
    }

    // Topic categorization
    const topicCategories = {
      family: ['family', 'mother', 'father', 'parent', 'child', 'sibling', 'relative', 'mom', 'dad', 'son', 'daughter'],
      relationships: ['friend', 'love', 'partner', 'relationship', 'marriage', 'dating', 'connection'],
      work: ['job', 'work', 'career', 'profession', 'business', 'colleague', 'boss'],
      health: ['health', 'illness', 'doctor', 'medical', 'sick', 'recovery', 'healing'],
      growth: ['learn', 'grow', 'change', 'develop', 'improve', 'progress', 'evolution'],
      memories: ['memory', 'remember', 'past', 'childhood', 'nostalgia', 'reminisce'],
      future: ['future', 'plan', 'goal', 'dream', 'hope', 'aspiration', 'tomorrow']
    };

    let topicCategory = 'general';
    for (const [category, keywords] of Object.entries(topicCategories)) {
      if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        topicCategory = category;
        break;
      }
    }

    // Extract meaningful keywords
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
    const words = message.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !commonWords.has(word) && /^[a-zA-Z]+$/.test(word)
    );

    // Determine urgency and validation needs
    const urgencyIndicators = ['urgent', 'emergency', 'crisis', 'help', 'desperate', 'immediately', 'struggling'];
    const validationIndicators = ['am i', 'is it okay', 'normal', 'right', 'wrong', 'should i', 'worried about'];

    const urgency = urgencyIndicators.some(indicator => lowercaseMessage.includes(indicator)) ? 'high' :
                   ['worried', 'anxious', 'confused', 'struggling'].some(word => lowercaseMessage.includes(word)) ? 'medium' : 'low';

    const needsValidation = validationIndicators.some(indicator => lowercaseMessage.includes(indicator)) ||
                           detectedIntent === 'seeking_validation';

    return {
      emotion: detectedEmotion,
      intent: detectedIntent,
      keywords: words,
      urgency,
      needsValidation,
      isRepeatTopic,
      personalityClues,
      topicCategory
    };
  }

  // Calculate similarity between two strings
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  // Get varied response to avoid repetition
  private getVariedResponse(category: string): string {
    const responses = this.responseVariations.get(category) || [];
    if (responses.length === 0) return '';
    
    // Avoid using the same response type consecutively
    let availableResponses = responses;
    if (this.context.lastResponseType === category && responses.length > 1) {
      // Remove the first response if it was used last time
      availableResponses = responses.slice(1);
    }
    
    const response = availableResponses[Math.floor(Math.random() * availableResponses.length)];
    this.context.lastResponseType = category;
    return response;
  }

  // Update conversation context with enhanced tracking
  private updateContext(analysis: any, userMessage: string) {
    this.context.lastUserIntent = analysis.intent;
    this.context.emotionalCues = [...this.context.emotionalCues.slice(-3), analysis.emotion];
    this.context.recentKeywords = [...this.context.recentKeywords.slice(-8), ...analysis.keywords];
    this.context.conversationHistory = [...this.context.conversationHistory.slice(-6), userMessage.toLowerCase()];

    // Update personality insights
    if (analysis.personalityClues.includes('reflective')) {
      this.context.userPersonality.isReflective = true;
    }
    if (analysis.personalityClues.includes('deep_thinker')) {
      this.context.userPersonality.prefersDeepConversation = true;
    }
    if (analysis.personalityClues.includes('storyteller')) {
      this.context.userPersonality.sharesPersonalStories = true;
    }

    // Update session memory
    if (analysis.topicCategory !== 'general') {
      this.context.sessionMemory.discussedTopics = [
        ...new Set([...this.context.sessionMemory.discussedTopics, analysis.topicCategory])
      ];
    }

    // Update mood based on emotional analysis
    if (['sadness', 'anxiety', 'anger', 'loneliness'].includes(analysis.emotion)) {
      this.context.userMood = 'negative';
    } else if (['joy', 'gratitude', 'hope', 'pride'].includes(analysis.emotion)) {
      this.context.userMood = 'positive';
    } else if (['confusion'].includes(analysis.emotion)) {
      this.context.userMood = 'seeking_advice';
    } else if (['nostalgia'].includes(analysis.emotion)) {
      this.context.userMood = 'reflective';
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

  // Generate contextually appropriate response with enhanced intelligence
  generateResponse(userMessage: string): string {
    const analysis = this.analyzeUserInput(userMessage);
    this.updateContext(analysis, userMessage);

    // Handle repeat topics with thoughtful acknowledgment
    if (analysis.isRepeatTopic) {
      return this.generateVariedFollowUp(analysis, userMessage);
    }

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

    // Handle specific intents with enhanced responses
    switch (analysis.intent) {
      case 'seeking_advice':
        return this.generateAdviceResponse(analysis, userMessage);
      case 'sharing_memory':
        return this.generateMemoryResponse(analysis, userMessage);
      case 'asking_question':
        return this.generateQuestionResponse(analysis, userMessage);
      case 'expressing_gratitude':
        return this.generateGratitudeResponse(analysis, userMessage);
      case 'reflecting':
        return this.generateReflectionResponse(analysis, userMessage);
      case 'storytelling':
        return this.generateStoryResponse(analysis, userMessage);
      default:
        return this.generateContextualResponse(analysis, userMessage);
    }
  }

  private generateVariedFollowUp(analysis: any, userMessage: string): string {
    const followUps = [
      "I can see this topic continues to resonate with you. What new layers are you discovering as you think about it more?",
      "You're returning to something that clearly holds deep meaning. What's drawing you back to explore this further?",
      "This seems to be unfolding for you in new ways. What insights are emerging as you revisit this?",
      "I notice we've touched on this before, and that tells me it's significant. What feels different about it now?",
      "This clearly has staying power in your thoughts. What would you like to understand better about it?",
      "You're circling back to something important here. What new questions or feelings are coming up?"
    ];
    
    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  private generateEmotionalSupportResponse(analysis: any, userMessage: string): string {
    const supportiveResponses = {
      sadness: [
        "I can feel the weight of sadness in your words, and I want you to know that what you're experiencing is deeply human and valid. Sadness often reflects the depth of our love and connection. Would you like to share what's weighing on your heart?",
        "Your sadness speaks to something profound - perhaps a loss, a change, or a deep caring that's been touched. These feelings honor what matters to you. I'm here to listen and walk through this with you.",
        "I sense you're carrying some heavy emotions right now. Sadness can be one of our most honest feelings, showing us what truly matters. What would feel most supportive for you in this moment?"
      ],
      anxiety: [
        "I can hear the worry and uncertainty in your message. Anxiety often signals that something important to us feels at risk or unknown. You're not alone in feeling this way. What's the main concern that's stirring these feelings?",
        "The anxiety you're experiencing makes complete sense - our minds naturally try to protect us by anticipating challenges. Let's take this one piece at a time. What feels most pressing right now?",
        "I notice the tension and worry in what you're sharing. Sometimes when we're anxious, it helps to focus on what we can influence. What aspects of this situation feel within your control?"
      ],
      anger: [
        "I can sense the fire of anger in your words, and that energy is telling us something important - perhaps about boundaries, values, or injustices that matter deeply to you. What's at the core of this anger?",
        "Your anger is a powerful signal that something significant has been violated or threatened. These feelings deserve to be heard and understood. What feels most important to address?",
        "I hear the intensity and frustration you're feeling. Anger often emerges when we care deeply about something that's been harmed or threatened. What would feel most empowering for you right now?"
      ],
      loneliness: [
        "I can feel the isolation and loneliness in your words, and I want you to know that reaching out here shows incredible courage. Feeling disconnected is one of the most difficult human experiences, but you're not as alone as it might feel.",
        "Loneliness can feel so overwhelming, but the fact that you're sharing this with me shows your strength and desire for connection. What kinds of connections have brought you comfort in the past?",
        "I sense you're feeling quite alone right now, and that's such a painful place to be. Sometimes sharing our stories can help us feel more connected to ourselves and others. What's one memory that makes you feel most like yourself?"
      ]
    };

    const responses = supportiveResponses[analysis.emotion as keyof typeof supportiveResponses];
    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return "I can sense you're going through something challenging right now. Your feelings are completely valid and important. I'm here to listen and support you. What would feel most helpful for you in this moment?";
  }

  private generateValidationResponse(analysis: any, userMessage: string): string {
    return this.getVariedResponse('validation') || 
           "What you're feeling and thinking is completely valid. There's no 'right' or 'wrong' way to experience life's complexities. Your perspective and emotions make sense given your unique journey.";
  }

  private generateAdaptiveResponse(analysis: any, userMessage: string): string {
    const adaptiveResponses = [
      "I hear you, and I really appreciate you sharing your perspective. You know your experience better than anyone else. Help me understand what feels most important to you about this.",
      "Thank you for that insight - you're absolutely right to guide our conversation in the direction that feels most meaningful to you. What would you like to explore instead?",
      "I value your perspective and want to make sure I'm truly understanding you. It sounds like there's something different you'd like to focus on. What feels most relevant to you right now?",
      "You're the expert on your own life and experiences. I appreciate you steering our conversation toward what matters most to you. What's really on your mind today?",
      "I hear you redirecting our conversation, and that's completely valid. You know what you need to discuss. What would feel most helpful to talk about?"
    ];

    return adaptiveResponses[Math.floor(Math.random() * adaptiveResponses.length)];
  }

  private generateAdviceResponse(analysis: any, userMessage: string): string {
    // Look for relevant entries based on keywords
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      const entry = relevantEntries[0];
      return `That's such an important question you're asking. Looking at your journey, I'm reminded of something you wrote in "${entry.title}" where you reflected on similar themes. Your own experiences have given you wisdom about this. What insights have you gained from navigating similar situations before?`;
    }

    const adviceResponses = [
      "That's a profound question that deserves thoughtful consideration. From what I've learned about your journey through your writings, you have a strong sense of wisdom and intuition. What does your inner voice tell you about this situation?",
      "You're asking about something that clearly matters deeply to you. Sometimes the best guidance comes from reflecting on our own values and past experiences. What principles have helped guide you through difficult decisions before?",
      "This is such an important question, and I can sense how much thought you've put into it. Based on your life experiences and the wisdom you've shared in your journal, what approach feels most aligned with who you are?",
      "You're seeking guidance on something significant, and that shows your thoughtfulness. Looking at the patterns in your life and the lessons you've learned, what path feels most authentic to you?"
    ];

    return adviceResponses[Math.floor(Math.random() * adviceResponses.length)];
  }

  private generateMemoryResponse(analysis: any, userMessage: string): string {
    return this.getVariedResponse('memory_exploration') || 
           "Thank you for sharing that memory with me. There's something beautiful about how our past experiences shape who we are today. What emotions or insights does this memory bring up for you now?";
  }

  private generateQuestionResponse(analysis: any, userMessage: string): string {
    // Try to find relevant context from user's entries
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      return `That's a thoughtful question. I notice you've written about related themes in your journal entries. Your own reflections might hold some insights. What connections do you see between this question and your life experiences?`;
    }

    return this.getVariedResponse('curiosity') || 
           "That's such a meaningful question. Questions like this often lead to the most important discoveries about ourselves. What draws you to explore this particular aspect of life?";
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

  private generateReflectionResponse(analysis: any, userMessage: string): string {
    const reflectionResponses = [
      "I can feel the depth of your reflection in what you're sharing. There's real wisdom emerging from your thoughtfulness. What insights are crystallizing for you?",
      "Your reflective nature is one of your greatest strengths. The way you process experiences shows such maturity and self-awareness. What patterns are you noticing?",
      "There's something beautiful about how you're examining this experience. Reflection like this is how we transform events into wisdom. What understanding is emerging for you?",
      "I'm struck by the thoughtfulness you bring to your experiences. This kind of reflection is what turns life into legacy. What truths are you discovering?"
    ];

    return reflectionResponses[Math.floor(Math.random() * reflectionResponses.length)];
  }

  private generateStoryResponse(analysis: any, userMessage: string): string {
    const storyResponses = [
      "I love how you're sharing this story. There's something powerful about the way you weave experiences into narrative. What makes this story particularly meaningful to you?",
      "Thank you for bringing this story to life. I can feel the significance it holds for you. What emotions or insights does telling it bring up?",
      "Your storytelling reveals so much about what matters to you. Stories like this are treasures that deserve to be preserved. What would you want future generations to understand about this experience?",
      "There's real artistry in how you're sharing this experience. Stories have the power to connect us across time. What lessons or wisdom does this story hold?"
    ];

    return storyResponses[Math.floor(Math.random() * storyResponses.length)];
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
      return `I can see this topic continues to resonate with you, and I appreciate how you're exploring it from different angles. What new insights or feelings are emerging as we discuss this together?`;
    }

    // Look for relevant entries
    const relevantEntries = this.findRelevantEntries(analysis.keywords);
    
    if (relevantEntries.length > 0) {
      const entry = relevantEntries[Math.floor(Math.random() * Math.min(relevantEntries.length, 3))];
      return `What you're sharing connects beautifully with something you wrote in "${entry.title}." There's a wonderful thread running through your experiences. How do these thoughts feel different or similar to what you were experiencing then?`;
    }

    // Use varied responses based on mood and personality
    if (this.context.userPersonality.isReflective) {
      return this.getVariedResponse('wisdom_seeking') || 
             "Your thoughtful approach to this topic shows real wisdom. What insights are you discovering as you explore this?";
    }

    return this.getVariedResponse('encouragement') || 
           "Thank you for sharing that with me. I'm curious to understand more about your perspective on this. What aspects of this topic feel most significant to you?";
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
  const [hasInitialized, setHasInitialized] = useState(false);
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

  // Initialize with welcome message immediately when component mounts
  useEffect(() => {
    if (currentChatSession && !hasInitialized && chatMessages.length === 0) {
      setHasInitialized(true);
      
      // Add welcome message immediately without delay
      const welcomeMessages = [
        "Hello! I'm Legacy Scribe, your personal memory companion. I've been getting to know you through your journal entries, and I'm genuinely excited to explore your life's journey with you. What's been on your mind lately?",
        "Welcome! I'm Legacy Scribe, and it's wonderful to meet you. I've been learning about your unique story through your writings, and I'm here to help you reflect, discover insights, and preserve your wisdom. What would you like to talk about today?",
        "Hi there! I'm Legacy Scribe, your AI companion for memory exploration. I've been studying your journal entries with great interest, and I'm here to help you uncover the deeper meanings in your experiences. What's drawing your attention today?",
        "Greetings! I'm Legacy Scribe, and I'm honored to be part of your legacy journey. Through your writings, I've glimpsed the richness of your experiences, and I'm here to help you explore them further. What's on your heart today?"
      ];
      
      const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      
      addChatMessage({
        text: welcomeMessage,
        sender: 'bot',
        sessionId: currentChatSession.id,
      });
    }
  }, [currentChatSession, hasInitialized, chatMessages.length, addChatMessage]);

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

    // Generate AI response with enhanced intelligence and natural timing
    const responseDelay = 1000 + Math.random() * 1200; // 1000-2200ms for more natural feel
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
    }, responseDelay);
  };

  const handleNewSession = async () => {
    await createNewChatSession();
    setShowSessionMenu(false);
    setHasInitialized(false); // Reset initialization for new session
  };

  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentChatSession(session);
    await loadChatHistory(session.id);
    setShowSessionMenu(false);
    setHasInitialized(true); // Mark as initialized since we're loading existing session
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
      setHasInitialized(false); // Reset for potential new session
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