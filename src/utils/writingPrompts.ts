import { WritingPrompt } from '../types';

export const writingPrompts: WritingPrompt[] = [
  // Memory prompts
  { id: 1, text: "What is your earliest childhood memory?", category: 'memory' },
  { id: 2, text: "Describe a moment that changed the course of your life.", category: 'memory' },
  { id: 3, text: "What was your most memorable birthday?", category: 'memory' },
  { id: 4, text: "Describe your first love or significant relationship.", category: 'memory' },
  { id: 5, text: "What family tradition holds the most meaning for you?", category: 'memory' },
  
  // Reflection prompts
  { id: 6, text: "What life achievement are you most proud of?", category: 'reflection' },
  { id: 7, text: "What do you wish you had done differently in life?", category: 'reflection' },
  { id: 8, text: "How has your worldview changed over time?", category: 'reflection' },
  { id: 9, text: "What personal struggles have shaped who you are today?", category: 'reflection' },
  { id: 10, text: "What has been your biggest life lesson so far?", category: 'reflection' },
  
  // Advice prompts
  { id: 11, text: "What advice would you give to your younger self?", category: 'advice' },
  { id: 12, text: "What wisdom would you like to pass on to future generations?", category: 'advice' },
  { id: 13, text: "What financial advice would you share with your loved ones?", category: 'advice' },
  { id: 14, text: "What relationship advice has proven most valuable in your life?", category: 'advice' },
  { id: 15, text: "What life principles have guided your decisions?", category: 'advice' },
  
  // Legacy prompts
  { id: 16, text: "How would you like to be remembered?", category: 'legacy' },
  { id: 17, text: "What values do you hope your family carries forward?", category: 'legacy' },
  { id: 18, text: "What are your wishes for your loved ones' futures?", category: 'legacy' },
  { id: 19, text: "What personal possessions hold special meaning that you'd like explained?", category: 'legacy' },
  { id: 20, text: "What unfinished business or unrealized dreams would you like addressed?", category: 'legacy' },
  
  // General prompts
  { id: 21, text: "What happened today that you want to remember?", category: 'general' },
  { id: 22, text: "What are you grateful for right now?", category: 'general' },
  { id: 23, text: "What recent conversation had a significant impact on you?", category: 'general' },
  { id: 24, text: "Describe a place that holds special meaning for you.", category: 'general' },
  { id: 25, text: "Who has had the biggest influence on your life and why?", category: 'general' },
];

export const getRandomPrompt = (category?: WritingPrompt['category']): WritingPrompt => {
  const filteredPrompts = category 
    ? writingPrompts.filter(prompt => prompt.category === category) 
    : writingPrompts;
  
  const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
  return filteredPrompts[randomIndex];
};

export const getPromptsByCategory = (category: WritingPrompt['category']): WritingPrompt[] => {
  return writingPrompts.filter(prompt => prompt.category === category);
};