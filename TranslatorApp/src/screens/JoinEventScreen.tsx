import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { webSocketService } from '../services/websocketService';

type JoinEventScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JoinEvent'>;

interface Props {
  navigation: JoinEventScreenNavigationProp;
}

const JoinEventScreen: React.FC<Props> = ({ navigation }) => {
  const [eventCode, setEventCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
    setEventCode(numericText);
  };

  const handleJoinEvent = async () => {
    if (eventCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit event code.');
      return;
    }

    setIsJoining(true);

    try {
      // Check if event exists and join it
      const joined = webSocketService.joinEvent(eventCode);
      
      if (joined) {
        // Navigate to listener screen
        navigation.replace('Listener', { eventCode });
      } else {
        Alert.alert(
          'Event Not Found',
          'The event code you entered is not valid or the event has ended. Please check the code and try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join event. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const isCodeComplete = eventCode.length === 4;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join Translation Event</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code provided by the speaker to join the translation session.
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Event Code:</Text>
            <TextInput
              style={styles.codeInput}
              value={eventCode}
              onChangeText={handleCodeChange}
              placeholder="0000"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              maxLength={4}
              autoFocus
            />
            <Text style={styles.codeHint}>Ask the speaker for this code</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.joinButton,
              (!isCodeComplete || isJoining) && styles.disabledButton,
            ]}
            onPress={handleJoinEvent}
            disabled={!isCodeComplete || isJoining}
          >
            {isJoining ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.joinButtonText}>Join Event</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What to expect:</Text>
            <Text style={styles.infoText}>
              • You'll hear real-time translations of the speaker's words
            </Text>
            <Text style={styles.infoText}>
              • Audio will play automatically through your device speakers
            </Text>
            <Text style={styles.infoText}>
              • No account or registration required
            </Text>
            <Text style={styles.infoText}>
              • You can leave the session at any time
            </Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example codes:</Text>
            <View style={styles.exampleCodes}>
              <View style={styles.exampleCode}>
                <Text style={styles.exampleCodeText}>1234</Text>
              </View>
              <View style={styles.exampleCode}>
                <Text style={styles.exampleCodeText}>5678</Text>
              </View>
              <View style={styles.exampleCode}>
                <Text style={styles.exampleCodeText}>9012</Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    marginBottom: 40,
    lineHeight: 22,
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  codeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  codeInput: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 20,
    width: 200,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
  codeHint: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  joinButton: {
    backgroundColor: '#FF9800',
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
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
  exampleContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  exampleCodes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exampleCode: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exampleCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 2,
  },
});

export default JoinEventScreen;