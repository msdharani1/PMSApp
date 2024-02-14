import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ReviewScreen = () => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    // Check if navigation and openDrawer function are available
    if (navigation && navigation.openDrawer) {
      navigation.openDrawer();
    } else {
      console.warn('Navigation or openDrawer function is undefined');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Menu Option */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.reviewText}>Review Screen</Text>
      
      {/* Bottom Navigation/Menu Option */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconContainer, styles.reviewIconContainer]} onPress={() => navigation.navigate('Review')}>
          <Ionicons name="star" size={24} color="black" />
          <Text style={[styles.iconText, styles.reviewText ]}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Booking')}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Customer')}>
          <Ionicons name="people" size={24} color="black" />
          <Text style={styles.iconText}>Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 1,
  },
  reviewText: {
    fontSize: 14,
    marginTop: 20,
    color: 'black',
    padding: 10,
    borderRadius: 5,
  },
  reviewIconContainer: {
    backgroundColor: '#ffdd00',
    padding: 10,
    borderRadius: 10,
  },
  reviewText: {
    color: '#000',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
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
    paddingLeft: 5,
    paddingRight: 5,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ReviewScreen;
