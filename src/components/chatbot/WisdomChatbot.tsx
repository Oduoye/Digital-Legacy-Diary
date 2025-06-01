import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useDiary } from '../../context/DiaryContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const WisdomChatbot: React.FC = () => {
  const { entries } = useDiary();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Wisdom Assistant. I can help you explore your memories and reflect on your experiences. What would you like to discuss?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [messageContext, setMessageContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setLastUserMessage(input);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg p-3 animate-fade-in-up
                ${message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
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
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            icon={<Send className="h-4 w-4" />}
            className="transform transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 min-w-[80px]"
          >
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WisdomChatbot;