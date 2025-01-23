import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Vibration,
  Platform,
  ToastAndroid,
  Alert,
  StatusBar,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  withSpring,
  useAnimatedStyle 
} from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
type RootStackParamList = {
  Home: undefined;
  Video: undefined;
};
import {Link} from 'expo-router'

const backgrounds = {
  bg1: require('../../assets/bg1.jpg'),
  bg2: require('../../assets/bg2.jpg'),
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentBg, setCurrentBg] = useState('bg1');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const toggleBackground = () => {
    setCurrentBg(prev => prev === 'bg1' ? 'bg2' : 'bg1');
  };

  const playNetworkAudio = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        {uri:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
      );
      setSound(audioSound);
      await audioSound.playAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to play network audio');
    }
  };

  const playLocalAudio = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require('../../assets/ringtone.mp3')
      );
      setSound(audioSound);
      await audioSound.playAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to play local audio');
    }
  };

  const triggerVibration = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(400);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true // Copy file to app's cache directory
      });
      console.log('resuleeet', result)
      // if (result.type === 'success') {
        // File selected successfully
        Alert.alert('File Selected', `Name: ${result.assets[0].name}\nSize: ${result.assets[0].size} bytes`);
        
        // Optional: You can handle the file further
        // console.log('File URI:', result.uri);
      // } else {
      //   // User cancelled file selection
      //   Alert.alert('File Selection', 'No file was selected');
      // }
    } catch (error) {
      console.error('File pick error:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };  

  const showToast = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Hello Toast!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Toast', 'Hello Toast!');
    }
  };

  const navigateToVideo = () => {
    scale.value = withSpring(1.2, {}, () => {
      navigation.navigate('Video');
      scale.value = withSpring(1);
    });
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Check out this video!",
        body: "Tap to watch the video",
        data: { screen: 'Video' },
      },
      trigger: { seconds: 5 },
    });
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={{flex:1}}>
    <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
    <ImageBackground
      source={backgrounds[currentBg]}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.buttonContainer, animatedStyle]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF6B6B' }]}
            onPress={toggleBackground}
          >
            <Text style={styles.buttonText}>Toggle Background</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4ECDC4' }]}
            onPress={playNetworkAudio}
          >
            <Text style={styles.buttonText}>Play Network Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#45B7D1' }]}
            onPress={playLocalAudio}
          >
            <Text style={styles.buttonText}>Play Local Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#96CEB4' }]}
            onPress={triggerVibration}
          >
            <Text style={styles.buttonText}>Vibrate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FFEEAD' }]}
            onPress={pickFile}
          >
            <Text style={styles.buttonText}>Pick File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D4A5A5' }]}
            onPress={showToast}
          >
            <Text style={styles.buttonText}>Show Toast</Text>
          </TouchableOpacity>
          <Link href="/VideoScreen" style={[styles.button, { backgroundColor: '#9B59B6' }]}>
          <Text style={[styles.buttonText, {textAlign:'center'}]}>Go to Video</Text>
          </Link>
        </Animated.View>
      </View>
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
