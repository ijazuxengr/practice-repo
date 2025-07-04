export interface TranslationEvent {
  id: string;
  code: string;
  speakerLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
  createdAt: Date;
  isActive: boolean;
}

export interface TranslationMessage {
  id: string;
  eventId: string;
  originalText: string;
  translatedText: string;
  originalLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
  timestamp: Date;
  isFromSpeaker: boolean;
}

export interface User {
  id: string;
  type: 'speaker' | 'listener';
  eventCode?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Speaker: { eventCode: string };
  Listener: { eventCode: string };
  CreateEvent: undefined;
  JoinEvent: undefined;
};

export interface WebSocketMessage {
  type: 'translation' | 'join' | 'leave' | 'error';
  payload: any;
  eventCode: string;
}