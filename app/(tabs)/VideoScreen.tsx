import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useNavigation } from '@react-navigation/native';

const VideoScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={300}
        videoId="dQw4w9WgXcQ"
        play={true}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoScreen;
