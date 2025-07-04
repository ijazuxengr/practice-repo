import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import JoinEventScreen from '../screens/JoinEventScreen';
import SpeakerScreen from '../screens/SpeakerScreen';
import ListenerScreen from '../screens/ListenerScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Real-Time Translator' }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ title: 'Create Event' }}
        />
        <Stack.Screen
          name="JoinEvent"
          component={JoinEventScreen}
          options={{ title: 'Join Event' }}
        />
        <Stack.Screen
          name="Speaker"
          component={SpeakerScreen}
          options={{ title: 'Speaker Mode' }}
        />
        <Stack.Screen
          name="Listener"
          component={ListenerScreen}
          options={{ title: 'Listener Mode' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;