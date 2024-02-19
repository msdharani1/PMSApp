//App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Dashboard from './Dashboard';
import ReviewScreen from './ReviewScreen';
import BookingScreen from './BookingScreen';
import CustomerScreen from './CustomerScreen';
import AddBooking from './AddBooking';
import BookingDetailsScreen from './BookingDetailsScreen';
import EditBookingScreen from './EditBookingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import AddFrame from './addFrame';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Database code
// Here you can add your database related code
// For example, importing necessary functions from Firebase SDK and performing database operations

const Stack = createStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
      } else {
        // User is signed out
        console.log('User is signed out');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    // Check if email and password are not empty
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email and password cannot be empty.');
      return;
    }

    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('Login successful:', user.email);
        // Navigate to Dashboard after successful login
        navigation.navigate('Dashboard');
      })
      .catch((error) => {
        // Handle login errors
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Invalid email or password. Please try again.');
        } else {
          Alert.alert('Error', 'Invalid email or password. Please try again.');
        }
        console.error('Login error:', error.message);
      });
  };

  return (
    <LinearGradient
      colors={['#CAC531', '#fdbb2d']}
      style={styles.container}
    >
      <View style={styles.container}>
        <Image source={require('./assets/logo.png')} style={styles.logo}></Image>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="black" style={styles.eyeicon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch', // Center horizontally within the available space
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000'
  },
  eyeicon: {
    position: 'relative',
    right: 50,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  passwordInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  toggleButton: {
    padding: 10,
  },
  button: {
    backgroundColor: '#3d218b',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Shrie Photography" 
        screenOptions={{
          headerTransparent: true, // Make the header transparent
          headerTintColor: '#000', // Set the text color of the header
          headerTitle: null, // Hide the title text
          headerTitleStyle: { marginLeft: 50 }, // Add margin left to the header title
          ...TransitionPresets.FadeFromBottomAndroid,
        }}
      >
        <Stack.Screen name="Shrie Photography" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerLeft: null }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="Customer" component={CustomerScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="AddBooking" component={AddBooking} options={{ headerLeft: null }} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="EditBooking" component={EditBookingScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="AddFrame" component={AddFrame} options={{ headerLeft: null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
