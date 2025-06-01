import { DiaryEntry, LifeTheme, LifeEvent, Relationship, PersonalValue } from '../types';

// Simulated AI processing of diary entries to extract themes
const extractThemes = (entries: DiaryEntry[]): LifeTheme[] => {
  // In a real implementation, this would use NLP/AI to identify recurring themes
  const themes: LifeTheme[] = [];
  
  // Example theme extraction based on tags and content
  const allTags = entries.flatMap(entry => entry.tags);
  const uniqueTags = [...new Set(allTags)];
  
  uniqueTags.forEach(tag => {
    const relatedEntries = entries
      .filter(entry => entry.tags.includes(tag))
      .map(entry => entry.id);
      
    if (relatedEntries.length >= 2) { // Only create theme if it appears in multiple entries
      themes.push({
        id: crypto.randomUUID(),
        name: tag.charAt(0).toUpperCase() + tag.slice(1),
        description: `Entries related to ${tag}`,
        relevance: relatedEntries.length / entries.length,
        relatedEntries,
        timespan: {
          start: new Date(Math.min(...relatedEntries.map(id => 
            entries.find(e => e.id === id)?.createdAt.getTime() || Date.now()
          ))),
          end: new Date(Math.max(...relatedEntries.map(id => 
            entries.find(e => e.id === id)?.createdAt.getTime() || Date.now()
          ))),
        },
      });
    }
  });
  
  return themes;
};

// Simulated AI processing to identify significant life events
const extractLifeEvents = (entries: DiaryEntry[]): LifeEvent[] => {
  // In a real implementation, this would use AI to identify important events
  return entries.map(entry => ({
    id: crypto.randomUUID(),
    title: entry.title,
    description: entry.content.substring(0, 200) + '...',
    date: entry.createdAt,
    importance: Math.random(), // In real implementation, this would be AI-determined
    relatedEntries: [entry.id],
    tags: entry.tags,
    emotions: [], // In real implementation, this would be AI-determined
  }));
};

// Simulated AI processing to identify relationships
const extractRelationships = (entries: DiaryEntry[]): Relationship[] => {
  // In a real implementation, this would use NLP/AI to identify people mentioned
  const relationships: Relationship[] = [];
  
  // Simple simulation - create relationships based on frequently used words
  const words = entries.flatMap(entry => 
    entry.content.toLowerCase().split(/\s+/)
  );
  
  const commonWords = new Set(['mom', 'dad', 'sister', 'brother', 'friend']);
  
  commonWords.forEach(word => {
    const relatedEntries = entries
      .filter(entry => entry.content.toLowerCase().includes(word))
      .map(entry => entry.id);
      
    if (relatedEntries.length > 0) {
      relationships.push({
        id: crypto.randomUUID(),
        name: word.charAt(0).toUpperCase() + word.slice(1),
        type: word === 'friend' ? 'friend' : 'family',
        significance: relatedEntries.length / entries.length,
        firstMentioned: new Date(Math.min(...relatedEntries.map(id => 
          entries.find(e => e.id === id)?.createdAt.getTime() || Date.now()
        ))),
        lastMentioned: new Date(Math.max(...relatedEntries.map(id => 
          entries.find(e => e.id === id)?.createdAt.getTime() || Date.now()
        ))),
        relatedEntries,
        description: `A ${word} mentioned in multiple entries`,
      });
    }
  });
  
  return relationships;
};

// Simulated AI processing to identify personal values
const extractValues = (entries: DiaryEntry[]): PersonalValue[] => {
  // In a real implementation, this would use AI to identify values from content
  const commonValues = [
    { name: 'Family', keywords: ['family', 'love', 'together'] },
    { name: 'Growth', keywords: ['learn', 'grow', 'improve'] },
    { name: 'Adventure', keywords: ['explore', 'travel', 'discover'] },
  ];
  
  return commonValues.map(value => ({
    id: crypto.randomUUID(),
    name: value.name,
    description: `Values related to ${value.name.toLowerCase()}`,
    examples: [],
    relatedEntries: entries
      .filter(entry => 
        value.keywords.some(keyword => 
          entry.content.toLowerCase().includes(keyword)
        )
      )
      .map(entry => entry.id),
    confidence: Math.random(),
  }));
};

// Main function to generate life story analysis
export const generateLifeStory = (entries: DiaryEntry[]) => {
  const themes = extractThemes(entries);
  const events = extractLifeEvents(entries);
  const relationships = extractRelationships(entries);
  const values = extractValues(entries);
  
  // Generate a narrative summary
  const narrative = `Based on your ${entries.length} journal entries, your life story reveals 
    ${themes.length} major themes, including ${themes.map(t => t.name).join(', ')}. 
    You've documented ${events.length} significant life events and mentioned 
    ${relationships.length} important relationships. Your writing reflects strong values of 
    ${values.map(v => v.name).join(', ')}.`;
  
  return {
    lastGenerated: new Date(),
    narrative,
    themes,
    timeline: events,
    relationships,
    values,
  };
};