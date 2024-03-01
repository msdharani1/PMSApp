import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';
import BookingDetailsScreen from './BookingDetailsScreen';

const BookingScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    const bookingsRef = ref(db, 'bookings');

    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingList = Object.values(data);
        setBookings(bookingList);
      }
    });
  }, []);

  const handleAddBooking = () => {
    navigation.navigate('AddBooking');
    setShowOptions(false); // Close the options menu when navigating
  };
  const handleAddFrame = () => {
    navigation.navigate('AddFrame');
    setShowOptions(false); // Close the options menu when navigating
  };
  const handleAddAlbum = () => {
    navigation.navigate('AddAlbum');
    setShowOptions(false); // Close the options menu when navigating
  };
  const handleBookingPress = (booking) => {
    navigation.navigate('BookingDetails', { booking });
  };

  const handleDashboardPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleReviewPress = () => {
    navigation.navigate('Review');
  };

  const handleCustomerPress = () => {
    navigation.navigate('Customer');
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <TouchableOpacity style={styles.menuIcon} onPress={() => setShowOptions(!showOptions)}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionItem} onPress={handleAddBooking}>
              <Ionicons name="add" size={24} color="black" />
              <Text style={styles.optionText}>Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={handleAddFrame}>
              <Ionicons name="add" size={24} color="black" />
              <Text style={styles.optionText}>Frame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={handleAddAlbum}>
              <Ionicons name="add" size={24} color="black" />
              <Text style={styles.optionText}>Album</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {bookings.map((booking, index) => (
            <TouchableOpacity key={index} style={styles.bookingBox} onPress={() => handleBookingPress(booking)}>
              <View style={styles.topLeft}>
                <Text style={styles.name}>{booking.customerName}</Text>
                <Text style={styles.eventName}>{booking.eventType}</Text>
              </View>
              <View style={styles.topRight}>
                <Text style={styles.date}>{booking.selectedDate}</Text>
                <Text style={styles.time}>{booking.selectedTime}</Text>
                <View style={styles.status}>
                  <View style={[styles.dot, { backgroundColor: booking.status === 'Pending' ? 'orange' : 'green' }]}></View>
                  <Text style={[styles.statusText, { color: booking.status === 'Pending' ? 'orange' : 'green' }]}>
                    Status: {booking.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Navigation Icons */}
        <View style={styles.bottomNav}>
          {/* Dashboard Icon */}
          <TouchableOpacity style={styles.iconContainer} onPress={handleDashboardPress}>
            <Ionicons name="home" size={24} color="black" />
            <Text style={styles.iconText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Review Icon */}
          <TouchableOpacity style={styles.iconContainer} onPress={handleReviewPress}>
            <Ionicons name="star" size={24} color="black" />
            <Text style={styles.iconText}>Review</Text>
          </TouchableOpacity>

          {/* Booking Icon */}
          <TouchableOpacity style={[styles.iconContainer, styles.bookingIconContainer]} onPress={handleBookingPress}>
            <Ionicons name="calendar" size={24} color="black" />
            <Text style={styles.iconText}>Booking</Text>
          </TouchableOpacity>

          {/* Customer Icon */}
          <TouchableOpacity style={styles.iconContainer} onPress={handleCustomerPress}>
            <Ionicons name="people" size={24} color="black" />
            <Text style={styles.iconText}>Customer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  optionsContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  bookingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },
  topLeft: {
    flex: 1,
  },
  topRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventName: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align the icons evenly
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20, // Add horizontal padding
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  bookingIconContainer: {
    backgroundColor: '#ffdd00', // Yellow background color for Booking icon
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  iconText: {
    color: '#000',
    fontSize: 12,
    marginTop: 5,
  },
});

export default BookingScreen;
