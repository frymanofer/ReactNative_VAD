/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import LinearGradient from 'react-native-linear-gradient';

import { VADRNBridgeInstance } from 'react-native-vad'; 
import removeAllRNBridgeListeners from 'react-native-vad'; 
import { createVADRNBridgeInstance } from 'react-native-vad'; 

//import RNFS from 'react-native-fs';

import { NativeModules } from 'react-native';
import { AppState } from 'react-native';

const AudioPermissionComponent = async () => {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
  await request(permission);
  const status = await check(permission);
  if (status !== RESULTS.GRANTED) {
      await request(permission);
  }
  if (Platform.OS === 'ios' )
  {

  }
  else {
    // Bug FOREGROUND_SERVICE does not exist
    const foregroundServicePermission = await request('android.permission.FOREGROUND_SERVICE');
    if (foregroundServicePermission === RESULTS.GRANTED) {
      console.log("Permissions granted", "Microphone and foreground service permissions granted.");
        // Start your service or perform other actions
    } else {
      console.log("Permission denied", "Foreground service microphone permission is required.");
    }
  }
}


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type DetectionCallback = (event: any) => void;

const myVADID = "id1"
const threshold = 0.9;
const msWindow = 1000;

// Function to add a new instance dynamically
//async function addInstance(conf: instanceConfig) 
async function addInstance(): Promise<VADRNBridgeInstance> {
  const instance = await createVADRNBridgeInstance(myVADID, false);
  if (!instance) {
      console.error(`Failed to create instance ${myVADID}`);
  }
  instance.createInstance(threshold, msWindow);
  console.log(`Instance ${myVADID} created ${instance}`);
  console.log(`Instance ${myVADID} createInstance() called`);
  return instance;
}

async function set_callback(instance: VADRNBridgeInstance, callback: (phrase: string) => void) { 
  const eventListener = instance.onVADDetectionEvent((phrase: string) => {
    console.log(`Instance ${instance.instanceId} detected: ${instance.instanceId} with phrase`, phrase);
    // callback(phrase); Does not work on IOS
    callback(phrase);
  });
  console.log("eventListener == ", eventListener);
  return eventListener;
}

// Function to remove the event listener
function removeEventListener(eventListener: any) {
  if (eventListener && typeof eventListener.remove === 'function') {
    eventListener.remove();
  }
  else {
    console.error("event listener.remove does not exist!!!!");
  }
}


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFlashing, setIsFlashing] = useState(false);
  const [voiceProbability, setVoiceProbability] = useState("0%");
  const [timeSinceVoice, setTimeSinceVoice] = useState("N/A");

// If you use useModel
//  console.log("useModel == ", useModel)
//  const { stopListening, startListening, loadModel, setKeywordDetectionLicense} = useModel();
  let myInstance: VADRNBridgeInstance;
  let eventListener: any;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isPermissionGranted, setIsPermissionGranted] = useState(false); // Track permission status
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        try {
          await AudioPermissionComponent();
          setIsPermissionGranted(true);
        } catch (error) {
          console.error("Error requesting permissions:", error);
        }
      }
    };
  
    const eventListener = AppState.addEventListener("change", handleAppStateChange);
  
    // If the app is *already* active on mount:
    if (AppState.currentState === 'active') {
      handleAppStateChange('active');
    }
  
    return () => {
      eventListener.remove();
    };
  }, []);

  // State to handle the display message
  const [message, setMessage] = useState(`Listening...`);

  useEffect(() => {

   /* const keywordCallback = async (keywordIndex: any) => {
      // Stop detection
      await myInstance.stopVADDetection();
      // remove the listener and callback
      removeEventListener(eventListener);

      console.log ("detected keyword: ", keywordIndex);
      setMessage(`WakeWord '${keywordIndex}' DETECTED`);
      setIsFlashing(true);  // Start flashing effect (Line 122)

      const timeout = setTimeout(async () => {
        console.log('5 seconds have passed!');
        setMessage(`Listening to Voice Activation`);
        setIsFlashing(false);  // Start flashing effect (Line 122)
        // Perform your action here
        // Stop detection
        eventListener = await set_callback(myInstance, keywordCallback);
        await myInstance.startVADDetection(threshold);
        // remove the listener and callback
      }, 5000);
    }*/
    const updateVoiceProps = async () => {
      try {
        const voiceProps = await myInstance.getVoiceProps();
        setVoiceProbability((voiceProps.voiceProbability * 100).toFixed(2) + '%');
        var lastTime = voiceProps.lastTimeHumanVoiceHeard;
        if (lastTime < 1000) {
          lastTime = 0;
        }
        const currentTime = new Date();
        currentTime.setMilliseconds(currentTime.getMilliseconds() - lastTime);
        
        const adjustedTime = currentTime.toLocaleTimeString();
        setTimeSinceVoice(adjustedTime);//voiceProps.lastTimeHumanVoiceHeard);
      } catch (error) {
        console.error("Error fetching voice properties:", error);
      }
    };
    
    const initializeVAD = async () => {
      try {
        // Wait for audio permission to be granted
        await AudioPermissionComponent();
        // Add all instances:
        
        try {
          myInstance = await addInstance();
          console.log("Created Instance", myInstance);
          console.log("Created Instance ID", myInstance.instanceId);
        } catch (error) {
            console.error("Error loading model:", error);
            return;
        }
        console.log("setting License");

        //eventListener = await set_callback(myInstance, keywordCallback);
        const isLicensed = await myInstance.setVADDetectionLicense(
          "MTczOTU3MDQwMDAwMA==-+2/cH2HBQz3/SsDidS6qvIgc8KxGH5cbvSVM/6qmk3Q=");
          console.log("After setting License");
          console.log("After setting License");
          console.log("After setting License");

        await myInstance.startVADDetection();
        console.log("After myInstance.startVADDetection");

        /* Using use_model.tsx:
        await setKeywordDetectionLicense(
          "MTczNDIxMzYwMDAwMA==-tNV5HJ3NTRQCs5IpOe0imza+2PgPCJLRdzBJmMoJvok=");
          
        await loadModel(instanceConfigs, keywordCallback);
  */
        const interval = setInterval(updateVoiceProps, 200);
        //return () => clearInterval(interval);
        
      } catch (error) {
        console.error('Error during keyword detection initialization:', error);
      }
    };

    initializeVAD();  // Call the async function inside useEffect
    // Call your native bridge function
  //KeyWordRNBridge.initKeywordDetection("bla", 0.9999, 2);
  //loadModel();
}, [isPermissionGranted]);  // Empty dependency array ensures it runs once when the component mounts


return (
  <LinearGradient
    colors={isDarkMode ? ['#232526', '#414345'] : ['#e0eafc', '#cfdef3']}
    style={styles.linearGradient}>
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <View 
      style={[styles.container, 
      { backgroundColor: 
        isFlashing ? (isDarkMode ? '#ff4d4d' : '#ffcccc') : isDarkMode ? Colors.black : Colors.white }]}>
        <Text style={styles.title}>Voice Probability: {voiceProbability}</Text>
        <Text style={styles.title}>Time of last Human Voice: {timeSinceVoice}</Text>
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
  elevation: 4, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
});

export default App;

