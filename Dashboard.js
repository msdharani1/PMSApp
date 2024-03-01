import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the menu icon

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false); // State to control menu visibility
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = screenWidth * 0.5; // Width of the menu box

  const menuAnimation = useRef(new Animated.Value(-menuWidth)).current; // Slide animation for the menu

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
          <Text style={styles.totalNumber}>203</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Booking</Text>
          <Text style={styles.totalNumber}>22</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Completed Event</Text>
          <Text style={styles.totalNumber}>15</Text>
        </View>

        {/* Booking Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Reminder Work</Text>
          <Text style={styles.totalNumber}>7</Text>
        </View>

        {/* Total Reviews Box */}
        <View style={styles.totalBox}>
          <Text style={styles.totalTitle}>Review</Text>
          <Text style={styles.totalNumber}>55</Text>
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
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="black" style={styles.menuItemText}/>
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
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
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 20,
    marginTop: 50,
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
});

export default WelcomeScreen;
