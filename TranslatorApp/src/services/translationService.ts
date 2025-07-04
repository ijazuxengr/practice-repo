// Simple translation service - in production, you would use Google Translate API, AWS Translate, etc.
interface TranslationDict {
  [key: string]: string;
}

const englishToFrench: TranslationDict = {
  'hello': 'bonjour',
  'goodbye': 'au revoir',
  'thank you': 'merci',
  'please': 's\'il vous plaît',
  'yes': 'oui',
  'no': 'non',
  'good morning': 'bonjour',
  'good evening': 'bonsoir',
  'how are you': 'comment allez-vous',
  'my name is': 'je m\'appelle',
  'nice to meet you': 'enchanté de vous rencontrer',
  'excuse me': 'excusez-moi',
  'sorry': 'désolé',
  'where is': 'où est',
  'how much': 'combien',
  'i don\'t understand': 'je ne comprends pas',
  'do you speak english': 'parlez-vous anglais',
  'can you help me': 'pouvez-vous m\'aider',
  'welcome': 'bienvenue',
  'see you later': 'à bientôt'
};

const frenchToEnglish: TranslationDict = {
  'bonjour': 'hello',
  'au revoir': 'goodbye',
  'merci': 'thank you',
  's\'il vous plaît': 'please',
  'oui': 'yes',
  'non': 'no',
  'bonsoir': 'good evening',
  'comment allez-vous': 'how are you',
  'je m\'appelle': 'my name is',
  'enchanté de vous rencontrer': 'nice to meet you',
  'excusez-moi': 'excuse me',
  'désolé': 'sorry',
  'où est': 'where is',
  'combien': 'how much',
  'je ne comprends pas': 'i don\'t understand',
  'parlez-vous anglais': 'do you speak english',
  'pouvez-vous m\'aider': 'can you help me',
  'bienvenue': 'welcome',
  'à bientôt': 'see you later'
};

export class TranslationService {
  static async translate(text: string, from: 'en' | 'fr', to: 'en' | 'fr'): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerText = text.toLowerCase().trim();
    
    if (from === 'en' && to === 'fr') {
      return englishToFrench[lowerText] || `[FR] ${text}`;
    } else if (from === 'fr' && to === 'en') {
      return frenchToEnglish[lowerText] || `[EN] ${text}`;
    }
    
    return text; // Return original if same language
  }

  static getOppositeLanguage(language: 'en' | 'fr'): 'en' | 'fr' {
    return language === 'en' ? 'fr' : 'en';
  }

  static getLanguageDisplayName(language: 'en' | 'fr'): string {
    return language === 'en' ? 'English' : 'French';
  }

  static generateEventCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

// In production, you would use something like this:
/*
export class TranslationService {
  private static API_KEY = 'your-google-translate-api-key';
  
  static async translate(text: string, from: 'en' | 'fr', to: 'en' | 'fr'): Promise<string> {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
}
*/