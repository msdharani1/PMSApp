  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { firebaseConfig } from './firebaseConfig';
  import { initializeApp } from 'firebase/app';
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
  import { Video } from 'expo-av'; // Import Video from expo-av
  import Icon from 'react-native-vector-icons/Ionicons';
  import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
  import Dashboard from './Dashboard';
  import ReviewScreen from './ReviewScreen';
  import BookingScreen from './BookingScreen';
  import CustomerScreen from './CustomerScreen';
  import BookingDetailsScreen from './BookingDetailsScreen';
  import EditBookingScreen from './EditBookingScreen';
  import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
  import AddFrame from './addFrame';
  import AddBooking from './AddBooking'; // Adjust the file path as necessary
  import AddAlbum from './addAlbum';
  import Service from './Service';
  import Contacts from './Contacts';
  import WeddingExampleImage from './WeddingExampleImage';
  import PackageScreen from './Packages';
  import Table from './table';
  import RegisterScreen from './register';
  import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
  import UserHome from './userHome';
  import { AppRegistry } from 'react-native';
  import userReview from './userReview';
  import Bookings from './userBooking';
  import Gallery from './Gallery';
  import PackageBooking from './PackageBooking';
  import ImageFormatDesign from './ImageFormatDesign';
  import UserAddBookings from './userAddBookings';
  import AddPackages from './AddPackages';
  import UserBookingStatus from './UserBookingStatus';

  AppRegistry.registerComponent('PMSApp', () => App);

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);

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

    const handleRegister = () => {
      navigation.navigate('RegisterScreen');
    };
    const handleLogin = async () => {
      try {
        // Check if email and password are not empty
        if (!email.trim() || !password.trim()) {
          Alert.alert('Error', 'Email and password cannot be empty.');
          return;
        }
    
        // Sign in with email and password
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, email, password);
    
        // Check if the user is authenticated
        const user = auth.currentUser;
        if (!email === 'admin@gmail.com' && !password === '12345678') {
          console.log('User is signed in:', user.email);
          // Navigate to UserHome if authenticated
          navigation.navigate('Home');
        } else {
          // Check if the email and password match the admin credentials in Firebase authentication
          if (email === 'admin@gmail.com' && password === '12345678') {
            console.log('Admin credentials detected');
            navigation.navigate('Dashboard');
          } else if (user) {
            console.log('User credentials detected');
            navigation.navigate('Home');
          } else {
            Alert.alert('Error', 'Invalid email or password. Please try again.');
          }
        }
    
        // Reset the form data
        setEmail('');
        setPassword('');
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      }
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
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
                style={styles.eyeicon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity marginTop={10} onPress={handleRegister}>
            <Text style={styles.regText}>Don't Have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // paddingLeft: 100, // Add margin for the container
    },
    regText:{
      marginTop: 10,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(253, 187, 45, 0.6)', // Add overlay for better readability of text
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      shadowColor: 'yellow', // Add yellow shadow for the video background
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10,
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
      width: '85%',
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '85%',
      marginBottom: 10,
    },
    passwordInput: {
      height: 40,
      borderColor: 'black',
      borderWidth: 1,
      padding: 10,
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    toggleButton: {
      padding: 10,
    },
    button: {
      backgroundColor: '#3d218b',
      padding: 10,
      borderRadius: 5,
      width: '85%',
      alignItems: 'center',
      borderRadius: 20,
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
            headerTransparent: true,
            headerTintColor: '#000',
            headerTitle: null,
            headerTitleStyle: { marginLeft: 50 },
            ...TransitionPresets.FadeFromBottomAndroid,
          }}
        >
          <Stack.Screen name="Shrie Photography" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerLeft: null }} />
          <Stack.Screen name="Review" component={ReviewScreen} options={{ headerLeft: null }} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Customer" component={CustomerScreen} />
          <Stack.Screen name="AddBooking" component={AddBooking} options={{ headerLeft: null }} />
          <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
          <Stack.Screen name="EditBooking" component={EditBookingScreen} options={{ headerLeft: null }} />
          <Stack.Screen name="AddFrame" component={AddFrame} options={{ headerLeft: null }} />
          <Stack.Screen name="AddAlbum" component={AddAlbum} options={{ headerLeft: null }} />
          <Stack.Screen name="Service" component={Service}  />
          <Stack.Screen name="Contacts" component={Contacts} />
          <Stack.Screen name="WeddingExampleImage" component={WeddingExampleImage} />
          <Stack.Screen name="Package" component={PackageScreen} /> 
          <Stack.Screen name="Home" component={UserHome} options={{ headerLeft: null }}/> 
          <Stack.Screen name="Table" component={Table} /> 
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/> 
          <Stack.Screen name="Reviews" component={userReview}/> 
          <Stack.Screen name="Bookings" component={Bookings}/> 
          <Stack.Screen name="ImageFormatDesign" component={ImageFormatDesign}/> 
          <Stack.Screen name="PackageBooking" component={PackageBooking}/> 
          <Stack.Screen name="Gallery" component={Gallery}/> 
          <Stack.Screen name="userAddBookings" component={UserAddBookings}/> 
          <Stack.Screen name="AddPackages" component={AddPackages}/> 
          <Stack.Screen name="UserBookingStatus" component={UserBookingStatus}/> 
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
