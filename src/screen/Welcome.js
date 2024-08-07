import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated } from 'react-native';
import auth from '@react-native-firebase/auth';
const Welcome = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1500, 
        useNativeDriver: true,
      }
    );

    const fadeOut = Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 1500, 
        useNativeDriver: true,
      }
    );

    const sequence = Animated.sequence([fadeIn, Animated.delay(1000), fadeOut, Animated.delay(1000)]);

    const loop = Animated.loop(sequence);
    loop.start();

    return () => loop.stop();
  }, [fadeAnim]);

  return (
    <ImageBackground
      source={require('../red.jpg')} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Animated.Text style={[styles.customText, { opacity: fadeAnim }]}>GameSPY</Animated.Text>
        <TouchableOpacity
          style={styles.button}
            onPress={() => {
              const user = auth().currentUser;
              if (user) {
                navigation.navigate('Home');
              } else {
                navigation.navigate('Login');
              }
          }}
        >
          <Text style={styles.buttonText}>Game ON</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  customText: {
    fontFamily: 'OCR A Extended Regular', 
    fontSize: 50,
    color: '#fff',
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#000', 
  },
});

export default Welcome;