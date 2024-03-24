import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar, Animated, Dimensions, TouchableWithoutFeedback, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import Ionicons and MaterialCommunityIcons
import { getDatabase, ref, onValue } from 'firebase/database';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { getAuth, onAuthStateChanged, doc, getDoc } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import app from './firebase';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// import slide from './slide';
import { SliderBox } from 'react-native-image-slider-box';

  // Initialize Firebase app
  // const app = initializeApp(firebaseConfig);

  const UserHome = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false); // State to control menu visibility
  const [userName, setUserName] = useState(''); // State to store user's name
  const [userData, setUserData] = useState({});
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = screenWidth * 0.5; // Width of the menu box

  const menuAnimation = useRef(new Animated.Value(-menuWidth)).current; // Slide animation for the menu

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDocRef = doc(db, 'users', user.uid); // Reference to user's document
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists) {
          const fetchedUserData = userDocSnap.data(); // Get the data from the document
          setUserName(fetchedUserData.name || ''); // Set name or empty string if not present
          setUserData(fetchedUserData); // Set all user data
        } else {
          console.log('No such document!'); // Handle the case where the document doesn't exist
        }
      } else {
        // User is signed out
        setUserName('');
        setUserData({}); // Clear state if user is not authenticated
      }
    });
  
    // Cleanup function to avoid memory leaks
    return () => unsubscribe();
  }, []);
  


  const handleMenuPress = () => {
    setShowMenu(!showMenu); // Toggle menu visibility
    toggleMenu(); // Trigger the menu animation
  };

  const toggleMenu = () => {
    const toValue = showMenu ? -menuWidth : 0;
    Animated.timing(menuAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(); 
  };

  const handleLogout = () => {
    navigation.navigate('Shrie Photography'); // Navigate to the login screen
  };

  const handleService = () => {
    navigation.navigate('Service'); // Navigate to the login screen
  };

  const handlePackage = () => {
    navigation.navigate('Package'); // Navigate to the login screen
  };

  const handleContacts = () => {
    navigation.navigate('Contacts'); // Navigate to the login screen
  };

  const handleReviewPress = () => {
    // Navigate to the Review screen
    navigation.navigate('Reviews');
  };

  const handleBookingPress = () => {
    // Navigate to the Booking screen
    navigation.navigate('Bookings');
  };

  const handleCustomerPress = () => {
    // Navigate to the Customer screen
    navigation.navigate('Gallery');
  };

  const handleDashboardPress = () => {
    // Navigate to the Dashboard screen
    navigation.navigate('Dashboard');
  };

  const handleChatOnWhatsApp = () => {
    const phoneNumber = '9360646732';
    // Replace '91' with the country code if necessary
    const whatsappUrl = `whatsapp://send?phone=91${phoneNumber}`;
    
    Linking.canOpenURL(whatsappUrl).then((supported) => {
      if (supported) {
        return Linking.openURL(whatsappUrl);
      } else {
        console.log("WhatsApp is not installed on your device");
      }
    }).catch((error) => console.log("An error occurred", error));   
  }

  const phoneNumber = '9360646732';

  const handleCallNow = () => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl);
  };

  const handleOverlayPress = () => {
    setShowMenu(false); // Close the menu
    toggleMenu(); // Trigger the menu animation
  };

  const handleEmployeePress = () => {
    navigation.navigate('Employee'); // Navigate to the Employee screen
  };

  const handleBellPress = () => {
    // Handle bell button press
    navigation.navigate('Notification');
  };

  const handlepackage = () => {
    navigation.navigate('Package'); // Navigate to the Package screen
  };

  // Define an array of objects containing image URLs or URIs
  const images = [
    require('./assets/1.jpg'),
    require('./assets/2.jpg'),
    require('./assets/3.jpg'),
    require('./assets/4.jpg'),
    require('./assets/5.jpg'),
    require('./assets/6.jpg'),
    
    // Add more image objects as needed
  ];

  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text marginTop={30}>Hello! {userName}</Text>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
        </View>
        {/* Slider Box */}
        <SliderBox
          images={images} // Pass the array of image objects
          dotColor="red"
          inactiveDotColor="white"
          dotStyle={{
            height: 10,
            width: 10,
            borderRadius: 50,
          }}
          imageLoadingColor="black"
          autoplay={true}
          autoplayInterval={3000}
          circleLoop={true}
        //   onCurrentImagePressed={(index) => alert(index + 1)}
          firstItem={4}
          paginationBoxVerticalPadding={20}
          marginRight={80}
          
        />
        {/* Address */}
       <View style={styles.addressContainer}>
          <Text style={styles.addressText}>No : 701b, Sivakasi Main Road,</Text>
          <Text style={styles.addressText}> Srivilliputhur North, </Text>
          <Text style={styles.addressText}>(Opposite Tmb Bank),</Text>
          <Text style={styles.addressText}>Srivilliputtur - 626125</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCustomerPress}>
          <Text style={styles.buttonText}>Our Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleChatOnWhatsApp}>
          <Text style={styles.buttonText}>Chat on Whatsapp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCallNow}>
          <Text style={styles.buttonText}>Call now!</Text>
      </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNav}>
        {/* Dashboard Icon */}
        <TouchableOpacity style={[styles.iconContainer, styles.dashboardIconContainer]} onPress={handleDashboardPress}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={[styles.iconText, styles.dashboardText]}>    Home    </Text>
        </TouchableOpacity>

        {/* Review Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleReviewPress}>
          <Ionicons name="star" size={24} color="black" />
          <Text style={styles.iconText}>Review</Text>
        </TouchableOpacity>

        {/* Booking Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleBookingPress}> 
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>

        {/* Customer Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleCustomerPress}>
          <Ionicons name="camera" size={24} color="black" />
          <Text style={styles.iconText}>Gallery</Text>
        </TouchableOpacity>
      </View>      
      {/* Menu button */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.bellButton} onPress={handleBellPress}>
        <MaterialCommunityIcons name="bell" size={24} color="black" />
      </TouchableOpacity>

      {/* Menu options */}
      {showMenu && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay}></View>
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
        <TouchableOpacity style={styles.menuItem} onPress={handleService}>
            <Ionicons name="construct" size={24} color="black" style={styles.menuItemText}/>
            <Text style={styles.menuItemText}>Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handlepackage}>
            <Ionicons name="wallet" size={24} color="black" style={styles.menuItemText}/>
            <Text style={styles.menuItemText}>Package</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleContacts}>
          <Ionicons name="person" size={24} color="black" style={styles.menuItemText}/>
          <Text style={styles.menuItemText}>Contacts</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menuItem} onPress={handleEmployeePress}>
           <Ionicons name="person-add" size={24} color="black" style={styles.menuItemText}/>
           <Text style={styles.menuItemText}>Manage Employees</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="black" style={styles.menuItemText}/>
            <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>

        <Text paddingLeft={70} position={'absolute'} bottom={20} color={'gray'}>Version 1.0</Text>
        <Text paddingLeft={50} position={'absolute'} bottom={45} color={'gray'}>Shrie Photography</Text>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
  },
  button: {
    backgroundColor: '#3d218b',
    padding: 10,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 35,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center', // Center the logo horizontally
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  totalBox: {
    backgroundColor: '#3d218b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  totalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  totalNumber: {
    color: '#fff',
    fontSize: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
  },
  dashboardIconContainer: {
    backgroundColor: '#ffdd00',
    padding: 10,
    borderRadius: 10,
  },
  dashboardText: {
    color: '#000',
    fontSize: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
    width: '50%',
    height: '100%',
    paddingTop: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 20,
    marginLeft: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black color
    zIndex: 0,
  },
  bellButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
  },
  imageSliderContainer: {
    paddingLeft: 20, // Add some left padding to the image slider
  },
  imageSliderItem: {
    width:  150, // Adjust the width of each image in the slider
    height: 200, // Adjust the height of each image in the slider
    marginRight: 20, // Add some right margin to separate images
    borderRadius: 10, 
    position:'relative',// Add border radius for rounded corners
  },
  addressContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default UserHome;


