import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TranslationMessage } from '../types';
import { TranslationService } from '../services/translationService';
import { webSocketService } from '../services/websocketService';

type ListenerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Listener'>;
type ListenerScreenRouteProp = RouteProp<RootStackParamList, 'Listener'>;

interface Props {
  navigation: ListenerScreenNavigationProp;
  route: ListenerScreenRouteProp;
}

const ListenerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventCode } = route.params;
  const [translations, setTranslations] = useState<TranslationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [currentTranslation, setCurrentTranslation] = useState<TranslationMessage | null>(null);

  const handleLeaveEvent = () => {
    Alert.alert(
      'Leave Event',
      'Are you sure you want to leave this translation event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            webSocketService.leaveEvent(eventCode);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Set up navigation header
    navigation.setOptions({
      title: `Listener - Code: ${eventCode}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLeaveEvent}
          style={{ marginRight: 15, padding: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Leave</Text>
        </TouchableOpacity>
      ),
    });

    // Set up WebSocket listeners
    const unsubscribeTranslation = webSocketService.onTranslation(
      eventCode,
      (message: TranslationMessage) => {
        setTranslations(prev => [message, ...prev]);
        setCurrentTranslation(message);
        
        // In a real app, you would use text-to-speech here
        console.log('New translation received:', message.translatedText);
        
        // Auto-hide current translation after 10 seconds
        setTimeout(() => {
          setCurrentTranslation(null);
        }, 10000);
      }
    );

    const unsubscribeError = webSocketService.onError((error: string) => {
      Alert.alert('Connection Error', error);
      setIsConnected(false);
    });

    return () => {
      unsubscribeTranslation();
      unsubscribeError();
    };
  }, [eventCode, navigation]);

  const getLanguageInfo = () => {
    if (translations.length === 0) {
      return { original: 'Unknown', target: 'Unknown' };
    }
    
    const latest = translations[0];
    return {
      original: TranslationService.getLanguageDisplayName(latest.originalLanguage),
      target: TranslationService.getLanguageDisplayName(latest.targetLanguage),
    };
  };

  const languageInfo = getLanguageInfo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eventCodeText}>Event: {eventCode}</Text>
        <Text style={styles.languageText}>
          Listening to: {languageInfo.original} → {languageInfo.target}
        </Text>
        <View style={[styles.statusIndicator, isConnected ? styles.connected : styles.disconnected]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
        </View>
      </View>

      {currentTranslation && (
        <View style={styles.currentTranslationContainer}>
          <Text style={styles.currentTranslationLabel}>Now Playing:</Text>
          <Text style={styles.currentTranslationText}>
            {currentTranslation.translatedText}
          </Text>
          <Text style={styles.originalText}>
            Original: "{currentTranslation.originalText}"
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.translationsSection}>
          <Text style={styles.sectionTitle}>Translation History</Text>
          
          {translations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                🎧 Waiting for the speaker to start...
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Make sure you're in the same room and the speaker has started talking.
              </Text>
            </View>
          ) : (
            translations.map((translation, index) => (
              <View key={translation.id} style={styles.translationCard}>
                <View style={styles.translationHeader}>
                  <Text style={styles.timestamp}>
                    {translation.timestamp.toLocaleTimeString()}
                  </Text>
                  <Text style={styles.languageIndicator}>
                    {translation.originalLanguage.toUpperCase()} → {translation.targetLanguage.toUpperCase()}
                  </Text>
                  {index === 0 && <Text style={styles.latestBadge}>Latest</Text>}
                </View>
                
                <View style={styles.translationContent}>
                  <View style={styles.translatedSection}>
                    <Text style={styles.sectionLabel}>Translation:</Text>
                    <Text style={styles.translatedText}>{translation.translatedText}</Text>
                  </View>
                  
                  <View style={styles.originalSection}>
                    <Text style={styles.sectionLabel}>Original:</Text>
                    <Text style={styles.originalTextSmall}>{translation.originalText}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Listening Tips:</Text>
          <Text style={styles.infoText}>• Keep your volume at a comfortable level</Text>
          <Text style={styles.infoText}>• Translations appear automatically when the speaker talks</Text>
          <Text style={styles.infoText}>• You can scroll through previous translations</Text>
          <Text style={styles.infoText}>• The latest translation will be highlighted</Text>
        </View>
      </ScrollView>

      {!isConnected && (
        <View style={styles.reconnectContainer}>
          <TouchableOpacity
            style={styles.reconnectButton}
            onPress={() => {
              const rejoined = webSocketService.joinEvent(eventCode);
              setIsConnected(rejoined);
              if (!rejoined) {
                Alert.alert('Connection Failed', 'Unable to reconnect to the event.');
              }
            }}
          >
            <Text style={styles.reconnectButtonText}>Reconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF9800',
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
    marginBottom: 10,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  connected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  disconnected: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  currentTranslationContainer: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentTranslationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  currentTranslationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    lineHeight: 28,
  },
  originalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
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
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  languageIndicator: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  latestBadge: {
    fontSize: 10,
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  translationContent: {
    gap: 12,
  },
  translatedSection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  originalSection: {
    backgroundColor: '#f1f3f4',
    padding: 12,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  translatedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    lineHeight: 22,
  },
  originalTextSmall: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
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
  reconnectContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  reconnectButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reconnectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListenerScreen;