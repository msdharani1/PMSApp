import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Video } from 'expo-av'; // Import Video from expo-av
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import app from './firebase';

const Stack = createStackNavigator();

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'User registered successfully.');
      navigation.navigate('Login'); // Navigate to login screen after successful registration
    } catch (error) {
      Alert.alert('Error', 'Failed to register user. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Shrie Photography');
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('./assets/backgroundVideo.mp4')} // Provide the source of your video
        shouldPlay
        isLooping
        resizeMode="cover"
        isMuted={true}
        style={[StyleSheet.absoluteFillObject, styles.video]}
      />
      <View style={styles.overlay}>
        <Image source={require('./assets/logo.png')} style={styles.logo}></Image>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity marginTop={10} onPress={handleLogin}>
          <Text style={styles.regText}>I Have an accont?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  regText: {
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 187, 45, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#3d218b',
    padding: 10,
    borderRadius: 25,
    width: '85%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RegisterScreen;
