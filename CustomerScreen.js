import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';

const CustomerInfoScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);

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

  const handleDashboardPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleReviewPress = () => {
    navigation.navigate('Review');
  };

  const handleBookingPress = () => {
    navigation.navigate('Booking');
  };

  const handleCustomerPress = () => {
    navigation.navigate('Customer');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.headerText]}>Customer Name</Text>
            <Text style={[styles.columnHeader, styles.headerText]}>Phone Number</Text>
            <Text style={[styles.columnHeader, styles.headerText]}>Event Name</Text>
            <Text style={[styles.columnHeader, styles.headerText]}>Date</Text>
            <Text style={[styles.columnHeader, styles.headerText]}>Payment</Text>
          </View>

          {bookings.map((booking, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.cell]}>{booking.customerName}</Text>
              <Text style={[styles.tableCell, styles.cell]}>{booking.customerNumber}</Text>
              <Text style={[styles.tableCell, styles.cell]}>{booking.eventType}</Text>
              <Text style={[styles.tableCell, styles.cell]}>{booking.selectedDate}</Text>
              <Text style={[styles.tableCell, styles.cell]}>
                {booking.advancePayment || booking.fullPayment ? `₹${booking.advancePayment}${booking.fullPayment}` : 'N/A'}
              </Text>
            </View>
          ))}
        </View>
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
        <TouchableOpacity style={styles.iconContainer} onPress={handleBookingPress}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>

        {/* Customer Icon */}
        <TouchableOpacity style={[styles.iconContainer, styles.active]} onPress={handleCustomerPress}>
          <Ionicons name="people" size={24} color="black" />
          <Text style={[styles.iconText, styles.activeText]}>Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    paddingTop: 50,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3d218b',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#E0E0E0',
  },
  tableCell: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  cell: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
  },
  active: {
    backgroundColor: '#ffdd00',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingTop:10,
    paddingBottom: 10,
  },
  activeText: {
    color: '#000',
    fontSize: 12,
  },
});

export default CustomerInfoScreen;