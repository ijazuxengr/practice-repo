# Real-Time Translator App

A React Native mobile application that provides real-time translation between English and French for speakers and listeners in the same room.

## Features

- **Two User Types**: Speakers (create events) and Listeners (join events)
- **Real-time Translation**: English ↔ French translation
- **Simple Event System**: 4-digit codes for easy joining
- **No Account Required**: Listeners can join without registration
- **Speech-to-Text**: Simulated voice recognition (ready for real implementation)
- **Text-to-Speech**: Ready for audio output (currently console logged)
- **Modern UI**: Clean, intuitive interface with real-time updates

## How It Works

### For Speakers
1. Choose "I'm a Speaker" on the home screen
2. Select your speaking language (English or French)
3. Create an event and get a 4-digit code
4. Share the code with listeners
5. Start speaking - your words will be translated and sent to listeners

### For Listeners
1. Choose "I'm a Listener" on the home screen
2. Enter the 4-digit code provided by the speaker
3. Join the event and start receiving real-time translations
4. View translation history and current translations

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/            # Main app screens
│   ├── HomeScreen.tsx          # Main selection screen
│   ├── CreateEventScreen.tsx   # Speaker event creation
│   ├── JoinEventScreen.tsx     # Listener event joining
│   ├── SpeakerScreen.tsx       # Speaker interface
│   └── ListenerScreen.tsx      # Listener interface
├── services/           # Business logic and APIs
│   ├── translationService.ts  # Translation logic
│   └── websocketService.ts     # Real-time communication
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TranslatorApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (if targeting iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

## Key Technologies

- **React Native 0.80.1**: Cross-platform mobile development
- **React Navigation**: Screen navigation and routing
- **TypeScript**: Type safety and better development experience
- **Mock Services**: Simulated WebSocket and translation services

## Current Implementation Status

### ✅ Implemented
- Complete UI for all screens
- Navigation flow between screens
- Event creation and joining system
- Mock translation service with common phrases
- Simulated real-time communication
- TypeScript types and interfaces
- Clean, modern UI design

### 🔄 Ready for Integration
- **Speech-to-Text**: Currently simulated, ready for `@react-native-voice/voice` integration
- **Translation API**: Mock service ready to be replaced with Google Translate API or similar
- **WebSocket Server**: Mock service ready for real WebSocket implementation
- **Text-to-Speech**: Console logging ready for `react-native-tts` integration

## Production Considerations

### Speech Recognition
Replace the simulated speech recognition in `SpeakerScreen.tsx` with real implementation:
```typescript
import Voice from '@react-native-voice/voice';

// Set up voice recognition
Voice.onSpeechResults = (e) => {
  const spokenText = e.value[0];
  setCurrentText(spokenText);
};
```

### Real Translation API
Replace the mock translation service with a real API:
```typescript
// Example using Google Translate API
const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    q: text,
    source: fromLanguage,
    target: toLanguage,
  })
});
```

### WebSocket Server
Implement a real WebSocket server for production:
```typescript
// Example server setup (Node.js + Socket.io)
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('join-event', (eventCode) => {
    socket.join(eventCode);
  });
  
  socket.on('translation', (data) => {
    socket.to(data.eventCode).emit('translation', data.message);
  });
});
```

### Text-to-Speech
Add audio output for listeners:
```typescript
import Tts from 'react-native-tts';

// Play translated text
Tts.speak(translatedText);
```

## Permissions

For production deployment, add these permissions:

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS (ios/TranslatorApp/Info.plist)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for speech recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs speech recognition to translate your words</string>
```

## Testing the App

1. **Start the app** on two devices or use the simulator
2. **On Device 1**: Choose "I'm a Speaker" → Select language → Create event
3. **Note the 4-digit code** displayed on the speaker screen
4. **On Device 2**: Choose "I'm a Listener" → Enter the code → Join event
5. **On Device 1**: Tap "Start Speaking" → Wait 2 seconds → Tap "Stop"
6. **On Device 2**: You should see the translation appear

## Architecture Highlights

- **Service Layer**: Clean separation between UI and business logic
- **Type Safety**: Full TypeScript implementation with strict types
- **Modular Design**: Easy to swap out mock services for real implementations
- **Responsive UI**: Works on different screen sizes
- **Error Handling**: Comprehensive error states and user feedback

## Future Enhancements

1. **Multiple Languages**: Add support for more language pairs
2. **Voice Training**: Allow users to train the app for their voice
3. **Offline Mode**: Basic translation when internet is unavailable
4. **Audio Recording**: Save and replay translations
5. **User Accounts**: Optional accounts for speakers with event history
6. **Group Management**: Support for multiple listeners per event
7. **Quality Settings**: Adjust translation speed vs accuracy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Note**: This is a demonstration app with mock services. For production use, you'll need to integrate real speech recognition, translation APIs, and WebSocket infrastructure.