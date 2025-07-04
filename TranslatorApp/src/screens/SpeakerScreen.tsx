import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TranslationMessage } from '../types';
import { TranslationService } from '../services/translationService';
import { webSocketService } from '../services/websocketService';

type SpeakerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Speaker'>;
type SpeakerScreenRouteProp = RouteProp<RootStackParamList, 'Speaker'>;

interface Props {
  navigation: SpeakerScreenNavigationProp;
  route: SpeakerScreenRouteProp;
}

const SpeakerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventCode } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [translations, setTranslations] = useState<TranslationMessage[]>([]);
  const [speakerLanguage] = useState<'en' | 'fr'>('en'); // In real app, this would come from CreateEventScreen
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [recordingTimer, setRecordingTimer] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleEndEvent = () => {
    Alert.alert(
      'End Event',
      'Are you sure you want to end this translation event? All listeners will be disconnected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Event',
          style: 'destructive',
          onPress: () => {
            webSocketService.closeEvent(eventCode);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Set up navigation header with event code
    navigation.setOptions({
      title: `Speaker - Code: ${eventCode}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleEndEvent}
          style={{ marginRight: 15, padding: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>End Event</Text>
        </TouchableOpacity>
      ),
    });

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [handleEndEvent]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    startPulseAnimation();

    // Start timer
    recordingInterval.current = setInterval(() => {
      setRecordingTimer(prev => prev + 1);
    }, 1000);

    // Simulate speech recognition - in real app, you'd use @react-native-voice/voice
    setTimeout(() => {
      const mockText = getSampleText();
      setCurrentText(mockText);
    }, 2000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    stopPulseAnimation();
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }

    if (currentText.trim()) {
      try {
        // Translate the text
        const targetLanguage = TranslationService.getOppositeLanguage(speakerLanguage);
        const translatedText = await TranslationService.translate(
          currentText,
          speakerLanguage,
          targetLanguage
        );

        // Create translation message
        const message: TranslationMessage = {
          id: Date.now().toString(),
          eventId: eventCode,
          originalText: currentText,
          translatedText,
          originalLanguage: speakerLanguage,
          targetLanguage,
          timestamp: new Date(),
          isFromSpeaker: true,
        };

        // Add to local translations list
        setTranslations(prev => [message, ...prev]);

        // Send to listeners via WebSocket
        webSocketService.sendTranslation(eventCode, message);
        
        // Clear current text
        setCurrentText('');
      } catch (error) {
        Alert.alert('Translation Error', 'Failed to translate speech. Please try again.');
      }
    }
  };

  const getSampleText = (): string => {
    const sampleTexts = [
      'Hello everyone, welcome to our presentation',
      'Thank you for joining us today',
      'Let me explain the main features',
      'Do you have any questions?',
      'This is an important point to remember',
      'Let\'s move on to the next topic',
      'I hope this information is helpful',
      'Please feel free to ask questions',
    ];
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const targetLanguage = TranslationService.getOppositeLanguage(speakerLanguage);
  const speakerLanguageDisplay = TranslationService.getLanguageDisplayName(speakerLanguage);
  const targetLanguageDisplay = TranslationService.getLanguageDisplayName(targetLanguage);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eventCodeText}>Event Code: {eventCode}</Text>
          <Text style={styles.languageText}>
            Speaking: {speakerLanguageDisplay} → Translating to: {targetLanguageDisplay}
          </Text>
        </View>

        <View style={styles.recordingSection}>
          <Animated.View style={[styles.recordButton, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordingButton,
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              activeOpacity={0.8}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? '🛑 Stop' : '🎤 Start Speaking'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {isRecording && (
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingText}>Recording... {formatTime(recordingTimer)}</Text>
              <Text style={styles.instructionText}>Speak clearly and tap Stop when finished</Text>
            </View>
          )}

          {currentText && !isRecording && (
            <View style={styles.currentTextContainer}>
              <Text style={styles.currentTextLabel}>Processing:</Text>
              <Text style={styles.currentText}>{currentText}</Text>
            </View>
          )}
        </View>

        <View style={styles.translationsSection}>
          <Text style={styles.sectionTitle}>Recent Translations</Text>
          {translations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start speaking to see translations appear here
              </Text>
            </View>
          ) : (
            translations.map((translation) => (
              <View key={translation.id} style={styles.translationCard}>
                <View style={styles.translationHeader}>
                  <Text style={styles.timestamp}>
                    {translation.timestamp.toLocaleTimeString()}
                  </Text>
                  <Text style={styles.languageIndicator}>
                    {translation.originalLanguage.toUpperCase()} → {translation.targetLanguage.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.originalText}>{translation.originalText}</Text>
                <Text style={styles.translatedText}>{translation.translatedText}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  eventCodeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  languageText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  recordingSection: {
    padding: 20,
    alignItems: 'center',
  },
  recordButton: {
    marginBottom: 20,
  },
  recordButtonInner: {
    backgroundColor: '#2196F3',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  recordButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  recordingInfo: {
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  currentTextContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currentTextLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  currentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  translationsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  translationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  languageIndicator: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  originalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  translatedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    lineHeight: 22,
  },
});

export default SpeakerScreen;