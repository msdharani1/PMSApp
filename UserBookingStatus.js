import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const UserBookingStatus = ({ userId }) => {
  const navigation = useNavigation();
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const bookingsRef = ref(db, 'bookings');

    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userBookings = Object.values(data).filter(item => item.userId === userId);
        setUserBookings(userBookings);
      } else {
        setUserBookings([]);
      }
    });
  }, [userId]);

  const handleBookingPress = (item) => {
    navigation.navigate('BookingDetails', { booking: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingBox} onPress={() => handleBookingPress(item)}>
      <View style={styles.topLeft}>
        <Text style={styles.name}>{item.customerName}</Text>
        <Text style={styles.eventName}>{item.eventType}</Text>
      </View>
      <View style={styles.topRight}>
        <Text style={styles.date}>{item.selectedDate}</Text>
        <Text style={styles.time}>{item.selectedTime}</Text>
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: item.status === 'Pending' ? 'orange' : 'green' }]}></View>
          <Text style={[styles.statusText, { color: item.status === 'Pending' ? 'orange' : 'green' }]}>
            Status: {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userBookings}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    paddingTop: 60,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 280,
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
});

export default UserBookingStatus;
