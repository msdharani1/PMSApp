import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the menu icon
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebase';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false); // State to control menu visibility
  const [reviewCount, setReviewCount] = useState(0); // State to hold review count
  const [customerCount, setCustomerCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [remainderCount, setRemainderCount] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = screenWidth * 0.5; // Width of the menu box
  const [userName, setUserName] = useState('');

  const menuAnimation = useRef(new Animated.Value(-menuWidth)).current; // Slide animation for the menu

  useEffect(() => {
    const auth = getAuth(app);
    const db = getDatabase(app);
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}/name`);
        
        onValue(userRef, (snapshot) => {
          const userName = snapshot.val();
          if (userName) {
            setUserName(userName);
          } else {
            console.log('No user name found');
          }
        });
      } else {
        setUserName('');
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reviewsRef = ref(db, 'photoshoot_reviews');
    const albumsRef = ref(db, 'albums');
    const bookingsRef = ref(db, 'bookings');
    const framesRef = ref(db, 'frames');

    // Fetch review count from Firebase
    onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        const count = Object.keys(reviewsData).length;
        setReviewCount(count);
      }
    });

    // Fetch counts from Firebase and calculate total customer count
    const fetchCounts = () => {
      let totalCustomerCount = 0;
      
      onValue(albumsRef, (snapshot) => {
        if (snapshot.exists()) {
          const albumsData = snapshot.val();
          totalCustomerCount += Object.keys(albumsData).length;
        }
      });

      onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const bookingsData = snapshot.val();
          totalCustomerCount += Object.keys(bookingsData).length;
          Object.values(bookingsData).forEach(booking => {
            // Check if the status is "process"
            if (booking.status === 'process') {
              bookingCount++; // Increment the count
            }
          });
        }
      });

      onValue(framesRef, (snapshot) => {
        if (snapshot.exists()) {
          const framesData = snapshot.val();
          totalCustomerCount += Object.keys(framesData).length;
        }
      });

      setCustomerCount(totalCustomerCount);
    };


    // Fetch counts initially and listen for changes
    fetchCounts();

    // Fetch booking count
    const fetchBookingCount = () => {
      let processBookingCount = 0;

      onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const bookingsData = snapshot.val();
          Object.values(bookingsData).forEach(booking => {
            if (booking.status === 'Process') {
              processBookingCount++;
            }
          });
        }
      });

      setBookingCount(processBookingCount);
    };

    // Fetch booking count initially and listen for changes
    fetchBookingCount();

    // Fetch Complete count
    const fetchCompleteCount = () => {
      let processCompleteCount = 0;

      onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const bookingsData = snapshot.val();
          Object.values(bookingsData).forEach(booking => {
            if (booking.status === 'Complete') {
              processCompleteCount++;
            }
          });
        }
      });

      setCompleteCount(processCompleteCount);
    };

    // Fetch complete count initially and listen for changes
    fetchCompleteCount();

     // Fetch Complete count
     const fetchRemainderCount = () => {
      let processRemainderCount = 0;

      onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const bookingsData = snapshot.val();
          Object.values(bookingsData).forEach(booking => {
            if (booking.status === 'Pending') {
              processRemainderCount++;
            }
          });
        }
      });

      setRemainderCount(processRemainderCount);
    };

    // Fetch complete count initially and listen for changes
    fetchRemainderCount();

    // Cleanup function to remove listeners
    return () => {
      // Remove listeners
    };

  }, []); // Run only once on component mount

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
    const handlepackage = () => {
      navigation.navigate('Package'); // Navigate to the login screen
    };

  const handleContacts = () => {
      navigation.navigate('Contacts'); // Navigate to the login screen
    };

  const handleReviewPress = () => {
    // Navigate to the Review screen
    navigation.navigate('Review');
  };

  const handleBookingPress = () => {
    // Navigate to the Booking screen
    navigation.navigate('Booking');
  };

  const handleCustomerPress = () => {
    // Navigate to the Customer screen
    navigation.navigate('Customer');
  };

  const handleDashboardPress = () => {
    // Navigate to the Dashboard screen
    navigation.navigate('Dashboard');
  };

  const handleOverlayPress = () => {
    setShowMenu(false); // Close the menu
    toggleMenu(); // Trigger the menu animation
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
        </View>

        {/* Total Customer Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Customer</Text>
          <Text style={styles.totalNumber}>{customerCount}</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Booking</Text>
          <Text style={styles.totalNumber}>{bookingCount}</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Completed Event</Text>
          <Text style={styles.totalNumber}>{completeCount}</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Reminder Work</Text>
          <Text style={styles.totalNumber}>{remainderCount}</Text>
        </View>

        {/* Total Reviews Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Review</Text>
          <Text style={styles.totalNumber}>{reviewCount}</Text>
        </View>

        {/* Total Employee Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Employee</Text>
          <Text style={styles.totalNumber}>5</Text>
        </View>

      </ScrollView>

      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNav}>
        {/* Dashboard Icon */}
        <TouchableOpacity style={[styles.iconContainer, styles.dashboardIconContainer]} onPress={handleDashboardPress}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={[styles.iconText, styles.dashboardText]}>Dashboard</Text>
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
          <Ionicons name="people" size={24} color="black" />
          <Text style={styles.iconText}>Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Menu button */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {/* Menu options */}
      {showMenu && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay}></View>
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
      <View style={styles.usercontainer}>
          <Ionicons name="person" style={styles.profile} size={50}/>
          <Text style={styles.userName}>{userName || 'Loading...'}</Text>
        </View>
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
  },userName: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  usercontainer: {
    padding: 10,
    backgroundColor: '#E8ECEA',
    height: 130,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profile: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
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
});

export default WelcomeScreen;


