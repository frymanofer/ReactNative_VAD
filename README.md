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

- **Audio Transcription:

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
import useVAD from 'react-native-vad';

function App(): React.JSX.Element {
    const { stopListening, startVAD } = useVAD();

    const onSpeechDetected = async () => {
        console.log('Voice activity detected!');
        // Handle speech activity
    };

    const initializeVAD = async () => {
        try {
            // Wait for audio permission to be granted
            await startVAD(onSpeechDetected);
        } catch (error) {
            console.error('Error during VAD initialization:', error);
        }
    };

    useEffect(() => {
        initializeVAD();
    }, []);

    return <Text>Voice Activity Detection Active</Text>;
}
```

## Benchmark

Our customers have benchmarked our technology against leading solutions, including Picovoice Porcupine, Snowboy, Pocketsphinx, Sensory, and others. In several tests, our performance was comparable to Picovoice Porcupine, occasionally surpassing it. For detailed references or specific benchmark results, please contact us at [ofer@davoice.io](mailto\:ofer@davoice.io).

## Activating Microphone while the app operates in the background or during shutdown/closure.

This example in the Git repository enables Android functionality in both the foreground and background, and iOS functionality in the foreground. However, we have developed an advanced SDK that allows the microphone to be activated from a complete shutdown state on Android and from the background state on iOS. If you require this capability for your app, please reach out to us at [ofer@davoice.io](mailto\:ofer@davoice.io).

Can you share in .MD format?



