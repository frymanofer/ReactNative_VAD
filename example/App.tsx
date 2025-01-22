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
