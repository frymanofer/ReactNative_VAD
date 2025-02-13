# ReactNative VAD by Davoice

By [DaVoice.io](https://davoice.io)


Welcome to **Davoice VAD (Voice Activity Detection)** – A solution for detecting speech activity designed by **DaVoice.io**.

## About this project

This is a **Voice Activity Detection (VAD)** package for React Native. VAD determines if a segment of audio contains speech or is just silence or background noise. It enables applications to:

- Activate on detected speech activity.
- Filter out irrelevant parts of audio to focus on meaningful speech.

For example, VAD can monitor audio streams to detect speech segments and trigger specific actions when voice activity is detected.

See full use cases below.

## Full use cases:

- **Speech Recognition Pre-Processing:**

VAD libraries are used to filter out silence and background noise from audio streams, reducing the amount of data sent to speech recognition engines. This optimizes performance and accuracy.

- **Real-Time Voice Communication:**

Applications like video conferencing, online gaming, and telephony use VAD to activate microphones only when voice is detected, saving bandwidth and improving privacy.

- **Voice-Controlled Interfaces:**

These libraries enable web apps with voice-triggered commands, such as controlling smart devices or interacting with apps hands-free.

- **Audio Transcription:**

Developers use VAD to preprocess audio for transcription services by isolating speech segments, ensuring more accurate results.

- **Audio Recording:**

VAD is used in recording applications to automatically start/stop recording based on voice activity, which helps save storage and simplifies editing.

- **Interactive Learning Tools:**

Educational platforms with voice-enabled features (e.g., language learning apps) use VAD to detect when users are speaking for interactive exercises.

- **Accessibility Features:**

VAD helps enable voice-based navigation and control for people with disabilities, allowing them to interact with applications using voice commands.

- **Voice Logging and Monitoring:**

In security, analytics, or call center applications, VAD is used to detect voice activity in recordings for further processing or analysis.

## Latest news

- **New npm install:** Now you can integrate Davoice VAD without any additional integrations by using "npm install react-native-vad". Make sure you install version >= 1.0.25.

- **New Car Parking Example:** Checkout our new Voice Activated Car Parking example, with voice detection both in Foreground and Background: example\_car\_parking/.

## Features

- **High Accuracy:** Our advanced models deliver precise voice activity detection.
- **Easy to deploy with React Native:** Check out our example: "rn\_example/DetectingVAD.js". With a few simple lines of code, you can enable voice activity detection in your app.
- **Cross-Platform Support:** Integrate Davoice VAD into the React-Native Framework. Both iOS and Android are supported.
- **Low Latency:** Experience near-instantaneous voice activity detection.

## Platforms and Supported Languages

- **React-Native Android:** React Native Wrapper for Android.
- **React-Native iOS:** React Native Wrapper for iOS.

## Contact

For any questions, requirements, or support for React-Native, please contact us at [info@davoice.io](mailto\:info@davoice.io).

## Installation and Usage

### Simply using npm install - package

```bash
npm install react-native-vad
```

### On Android:

Please add the following to android/build.gradle:

```gradle
allprojects {
    repositories {
        // react-native-vad added
        maven { url "${project(":react-native-vad").projectDir}/libs" }
    }
}
```

See example\_npm for a specific example of using the code.

### Demo Instructions

To run the demo:

1. Clone the repository:

   ```
   git clone https://[YourGitName]:[Token].com/frymanofer/ReactNative_VAD.git
   ```

2. Navigate to the example directory:

   ```
   cd example_npm
   ```

3. For Android:

   ```
   npx react-native run-android
   ```

   Depending on your system, you may be required to press "a" for Android.

   **Note:** If you don't have an Android environment setup (Gradle, Android device or Emulator, Java, etc.) and need help, please contact us at [ofer@davoice.io](mailto\:ofer@davoice.io).

4. For iOS:

   ```
   npx react-native run-ios
   ```

   Depending on your system, you may be required to press "i" for iOS.

   You may need to:

   ```
   cd ios && pod cache clean --all && pod deintegrate && pod install --repo-update
   ```

   Then open Xcode and run in Xcode.

   **Note:** If you don't have an iOS environment setup (Xcode, CocoaPods, iOS device or Emulator, etc.) and need help, please contact us at [ofer@davoice.io](mailto\:ofer@davoice.io).

## Screenshots from the Demo App

1. **Make sure you allow Audio Permission:**
   The app needs to ask for audio permission; ensure you allow it as it is necessary for voice activity detection.



1. **If You are using Android Emulator - make sure you enable Microphone as below:**
   The settings screen showing virtual microphone configuration in the Android emulator.



1. **Listening for Voice Activity:**
   The app is actively detecting speech activity.



1. **Voice Activity Detected:**
   The app has detected speech activity.



### Usage Example

Below is a simple Voice Activity Detection example using npm install react-native-vad:

```javascript
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Platform, useColorScheme } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppState } from 'react-native';
import { Svg, Polyline } from 'react-native-svg'; // Import SVG components
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { createVADRNBridgeInstance } from 'react-native-vad';

const AudioPermissionComponent = async () => {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
  await request(permission);
  const status = await check(permission);
  if (status !== RESULTS.GRANTED) {
    await request(permission);
  }
  if (Platform.OS !== 'ios') {
    const foregroundServicePermission = await request('android.permission.FOREGROUND_SERVICE');
    if (foregroundServicePermission !== RESULTS.GRANTED) {
      console.log('Foreground service microphone permission is required.');
    }
  }
};

async function addInstance() {
  const instance = await createVADRNBridgeInstance('id1', false);
  if (!instance) {
    console.error(`Failed to create instance`);
    return null;
  }
  instance.createInstance(0.1, 10);
  return instance;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [voiceProbability, setVoiceProbability] = useState(0); // Keep as a number
  const [timeSinceVoice, setTimeSinceVoice] = useState('N/A');
  const [waveformPoints, setWaveformPoints] = useState(''); // Store points for the waveform
  let myInstance: any;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        try {
          await AudioPermissionComponent();
          setIsPermissionGranted(true);
        } catch (error) {
          console.error('Error requesting permissions:', error);
        }
      }
    };

    const eventListener = AppState.addEventListener('change', handleAppStateChange);

    if (AppState.currentState === 'active') {
      handleAppStateChange('active');
    }

    return () => {
      eventListener.remove();
    };
  }, []);

  useEffect(() => {
    const updateVoiceProps = async () => {
      try {
        const voiceProps = await myInstance.getVoiceProps();
        setVoiceProbability(voiceProps.voiceProbability);

        // Update time since last voice
        let lastTime = voiceProps.lastTimeHumanVoiceHeard;
        if (lastTime < 1000) {
          lastTime = 0;
        }
        const currentTime = new Date();
        currentTime.setMilliseconds(currentTime.getMilliseconds() - lastTime);
        const adjustedTime = currentTime.toLocaleTimeString();
        setTimeSinceVoice(adjustedTime);

        // Update waveform points
        setWaveformPoints((prevPoints) => {
          const pointsArray = prevPoints
            .split(' ')
            .filter(Boolean)
            .map((point) => {
              const [x, y] = point.split(',').map(Number);
              return `${x + 10},${y}`; // Shift points to the right
            });
          pointsArray.push(`0,${100 - voiceProps.voiceProbability * 100}`); // Add new point
          if (pointsArray.length > 50) pointsArray.shift(); // Limit points
          return pointsArray.join(' ');
        });
      } catch (error) {
        console.error('Error fetching voice properties:', error);
      }
    };

    const initializeVAD = async () => {
      try {
        await AudioPermissionComponent();

        myInstance = await addInstance();
        if (!myInstance) return;
        console.log("setting License");

        //eventListener = await set_callback(myInstance, keywordCallback);
        const isLicensed = await myInstance.setVADDetectionLicense(
          "MTczOTU3MDQwMDAwMA==-+2/cH2HBQz3/SsDidS6qvIgc8KxGH5cbvSVM/6qmk3Q=");
          console.log("After setting License");
          console.log("After setting License");
          console.log("After setting License");

        await myInstance.startVADDetection();

        setInterval(updateVoiceProps, 200);
      } catch (error) {
        console.error('Error during VAD initialization:', error);
      }
    };

    initializeVAD();
  }, [isPermissionGranted]);

  return (
    <LinearGradient
      colors={isDarkMode ? ['#232526', '#414345'] : ['#e0eafc', '#cfdef3']}
      style={styles.linearGradient}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={styles.title}>Voice Probability: {(voiceProbability * 100).toFixed(2)}%</Text>
          <Text style={styles.title}>Time of last Human Voice: {timeSinceVoice}</Text>
          <Svg height="100" width="500" style={styles.waveform}>
            <Polyline points={waveformPoints} fill="none" stroke="blue" strokeWidth="2" />
          </Svg>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 32,
  },
  linearGradient: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff99',
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  waveform: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default App;
```

## Benchmark

Our customers have benchmarked our technology against leading solutions, including Picovoice Porcupine, Snowboy, Pocketsphinx, Sensory, and others. In several tests, our performance was comparable to Picovoice Porcupine, occasionally surpassing it. For detailed references or specific benchmark results, please contact us at [ofer@davoice.io](mailto\:ofer@davoice.io).

## Activating Microphone while the app operates in the background or during shutdown/closure.

This example in the Git repository enables Android functionality in both the foreground and background, and iOS functionality in the foreground. However, we have developed an advanced SDK that allows the microphone to be activated from a complete shutdown state on Android and from the background state on iOS. If you require this capability for your app, please reach out to us at [ofer@davoice.io](mailto\:ofer@davoice.io).

Can you share in .MD format?



