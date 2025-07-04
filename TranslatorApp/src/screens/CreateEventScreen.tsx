import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { TranslationService } from '../services/translationService';
import { webSocketService } from '../services/websocketService';

type CreateEventScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateEvent'>;

interface Props {
  navigation: CreateEventScreenNavigationProp;
}

const CreateEventScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr' | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleLanguageSelect = (language: 'en' | 'fr') => {
    setSelectedLanguage(language);
  };

  const handleCreateEvent = async () => {
    if (!selectedLanguage) {
      Alert.alert('Language Required', 'Please select your speaking language first.');
      return;
    }

    setIsCreating(true);

    try {
      // Generate event code
      const eventCode = TranslationService.generateEventCode();
      
      // Create event in WebSocket service
      webSocketService.createEvent(eventCode);

      // Navigate to speaker screen
      navigation.replace('Speaker', { eventCode });
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const getTargetLanguage = () => {
    if (!selectedLanguage) return '';
    return TranslationService.getOppositeLanguage(selectedLanguage);
  };

  const getTargetLanguageDisplay = () => {
    const targetLang = getTargetLanguage();
    return TranslationService.getLanguageDisplayName(targetLang as 'en' | 'fr');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Translation Event</Text>
        <Text style={styles.subtitle}>
          Select the language you'll be speaking in. Listeners will hear the translation.
        </Text>

        <View style={styles.languageContainer}>
          <Text style={styles.sectionTitle}>I will speak in:</Text>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              selectedLanguage === 'en' && styles.selectedLanguageButton,
            ]}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text style={[
              styles.languageButtonText,
              selectedLanguage === 'en' && styles.selectedLanguageButtonText,
            ]}>
              🇺🇸 English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              selectedLanguage === 'fr' && styles.selectedLanguageButton,
            ]}
            onPress={() => handleLanguageSelect('fr')}
          >
            <Text style={[
              styles.languageButtonText,
              selectedLanguage === 'fr' && styles.selectedLanguageButtonText,
            ]}>
              🇫🇷 French
            </Text>
          </TouchableOpacity>
        </View>

        {selectedLanguage && (
          <View style={styles.translationInfo}>
            <Text style={styles.translationText}>
              Listeners will hear translations in{' '}
              <Text style={styles.targetLanguage}>{getTargetLanguageDisplay()}</Text>
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.createButton,
            (!selectedLanguage || isCreating) && styles.disabledButton,
          ]}
          onPress={handleCreateEvent}
          disabled={!selectedLanguage || isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. You'll get a 4-digit code to share with listeners
          </Text>
          <Text style={styles.infoText}>
            2. Speak into your device microphone
          </Text>
          <Text style={styles.infoText}>
            3. Listeners will hear real-time translations
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  languageContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  languageButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedLanguageButton: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  languageButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  selectedLanguageButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  translationInfo: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  translationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  targetLanguage: {
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default CreateEventScreen;