import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleJoinEvent = () => {
    navigation.navigate('JoinEvent');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.content}>
        <Text style={styles.title}>Real-Time Translator</Text>
        <Text style={styles.subtitle}>
          Connect speakers and listeners for instant translation between English and French
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.speakerButton} onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>I'm a Speaker</Text>
            <Text style={styles.buttonSubtext}>Create a new translation event</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listenerButton} onPress={handleJoinEvent}>
            <Text style={styles.buttonText}>I'm a Listener</Text>
            <Text style={styles.buttonSubtext}>Join an existing event with a code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureContainer}>
          <Text style={styles.featureTitle}>Features:</Text>
          <Text style={styles.featureText}>• Real-time speech translation</Text>
          <Text style={styles.featureText}>• English ↔ French translation</Text>
          <Text style={styles.featureText}>• No account required for listeners</Text>
          <Text style={styles.featureText}>• Simple 4-digit event codes</Text>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
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
  buttonContainer: {
    marginBottom: 40,
  },
  speakerButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listenerButton: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  featureContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default HomeScreen;