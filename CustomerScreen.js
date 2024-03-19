import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const CustomerScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [sortBy, setSortBy] = useState('Booking');
  const [serialNumbers, setSerialNumbers] = useState([]);

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

  useEffect(() => {
    const serialNums = Array.from({ length: bookings.length }, (_, index) => index + 1);
    setSerialNumbers(serialNums);
  }, [bookings]);

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

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    const currentDate = new Date();
    let startDate = new Date();
    switch (value) {
      case 'Last 7 days':
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'Last 28 days':
        startDate.setDate(currentDate.getDate() - 28);
        break;
      case 'Last 90 days':
        startDate.setDate(currentDate.getDate() - 90);
        break;
      case 'Last 365 days':
        startDate.setDate(currentDate.getDate() - 365);
        break;
      default:
        return;
    }
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.selectedDate);
      return bookingDate >= startDate && bookingDate <= currentDate;
    });
    setBookings(filteredBookings);
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    let dataRef;
    switch (value) {
      case 'Booking':
        dataRef = ref(db, 'bookings');
        break;
      case 'Frame':
        dataRef = ref(db, 'frames');
        break;
      case 'Album':
        dataRef = ref(db, 'albums');
        break;
      default:
        return;
    }
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataList = Object.values(data);
        setBookings(dataList);
      }
    });
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={timeRange}
          style={[styles.picker, styles.leftPicker]}
          onValueChange={(itemValue, itemIndex) =>
            handleTimeRangeChange(itemValue)
          }>
          <Picker.Item label="Last 7 days" value="Last 7 days" />
          <Picker.Item label="Last 28 days" value="Last 28 days" />
          <Picker.Item label="Last 90 days" value="Last 90 days" />
          <Picker.Item label="Last 365 days" value="Last 365 days" />
          <Picker.Item label="Lifetime" value="Lifetime" />
        </Picker>
        <Picker
          selectedValue={sortBy}
          style={[styles.picker, styles.rightPicker]}
          onValueChange={(itemValue, itemIndex) =>
            handleSortByChange(itemValue)
          }>
          <Picker.Item label="Booking" value="Booking" />
          <Picker.Item label="Frame" value="Frame" />
          <Picker.Item label="Album" value="Album" />
        </Picker>
      </View>
      <ScrollView horizontal={true}>
        <ScrollView style={styles.scrollContainer} >
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { flex: 2.5 }]}>S.no</Text>
              <Text style={[styles.columnHeader, { flex: 2 }]}>Name</Text>
              <Text style={[styles.columnHeader, { flex: 1.9 }]}>Phone</Text>
              <Text style={[styles.columnHeader, { flex: 2.3 }]}>Event</Text>
              <Text style={[styles.columnHeader, { flex: 2.3 }]}>Date</Text>
              <Text style={[styles.columnHeader, { flex: 1.5 }]}>Tot. Pay</Text>
              <Text style={[styles.columnHeader, { flex: 1.5 }]}>Adv. Pay</Text>
              <Text style={[styles.columnHeader, { flex: 1.5 }]}>Bal. Pay</Text>
            </View>

            {bookings.map((booking, index) => (
              <View key={index} style={styles.tableRow}>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 0.5 }]}>
                  {serialNumbers[index]}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 4.5 }]}>
                  {booking.customerName}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 1.5 }]}>
                  {booking.customerNumber}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 2.5 }]}>
                  {booking.eventType}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 2 }]}>
                  {booking.selectedDate}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 1.5 }]}>
                  {booking.totalPrice}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 1.5 }]}>
                  {booking.advancePayment || booking.fullPayment
                    ? `₹${booking.advancePayment}${booking.fullPayment}`
                    : 'N/A'}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 1.5 }]}>
                  {booking.totalPrice
                    ? (booking.advancePayment || booking.fullPayment)
                      ? `₹${parseFloat(booking.totalPrice) -
                        parseFloat(booking.advancePayment || booking.fullPayment)}`
                      : `₹${booking.totalPrice}`
                    : 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        
    </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleDashboardPress}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={handleReviewPress}>
          <Ionicons name="star" size={24} color="black" />
          <Text style={styles.iconText}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={handleBookingPress}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>
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
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    flex: 1,
    marginRight: 5,
  },
  leftPicker: {
    marginRight: 5,
  },
  rightPicker: {
    marginLeft: 5,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '250%',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 50,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3d218b',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    fontSize: 14,
    width: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  active: {
    backgroundColor: '#ffdd00',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  activeText: {
    color: '#000',
    fontSize: 12,
  },
});

export default CustomerScreen;