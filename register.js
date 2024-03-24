import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, addDoc, collection } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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
      if (!name.trim()) {
        Alert.alert('Error', 'Name cannot be empty.');
        return;
      }else if(!name == /^[a-zA-Z ]+$/){
        Alert.alert('Error', 'Please Enter Characters only');
        return;
      }
      if (!phone.trim()){
        Alert.alert('Error', 'Phone cannot be empty.');
        return;
      }else if(!phone == /^[0-9]{10}$/){
        Alert.alert('Error', 'Please Enter 10 digit number');
        return;
      }
      if(!email.trim()){
        Alert.alert('Error', 'Email cannot be empty.');
        return;
      }else if(!email == /^[^\s@]+@[^\s@]+\.[^\s@]+$/){
        Alert.alert('Error', 'Please Enter Valid Email.');
        return;
      }
      if(!password.trim()){
        Alert.alert('Error', 'Password Number cannot be empty.');
        return;
      }
      const auth = getAuth(app);
      const db = getFirestore(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the newly created user object

          // Create a data object for Firestore
    const userData = {
      name: name, // Assuming you have state variables for name, phone, etc.
      phone: phone,
      // Add other fields as needed
    };

    // Create a reference to the users collection (adjust path if needed)
    const usersCollectionRef = collection(db, 'users');

    // Use setDoc (recommended for new writes) to create a new document
    await setDoc(doc(usersCollectionRef, user.uid), userData); // Use user.uid as document ID


      Alert.alert('Success', 'User registered successfully.');
      navigation.navigate('Shrie Photography'); // Navigate to login screen after successful registration
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
          <Text style={styles.regText}>I Have an account?  Login Here!</Text>
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
