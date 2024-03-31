import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { firebaseConfig } from './firebaseConfig';

const UserMyBooking = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [filter, setFilter] = useState('Booking');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    // Get current user's email
    const user = auth.currentUser;
    if (user) {
      setCurrentUserEmail(user.email);
    }

    let dataRef;

    switch (filter) {
      case 'Booking':
        dataRef = ref(db, 'bookings');
        break;
      case 'Package Booking':
        dataRef = ref(db, 'packagebookings');
        break;
      case 'Album':
        dataRef = ref(db, 'albums');
        break;
      case 'Frame':
        dataRef = ref(db, 'frames');
        break;
      default:
        dataRef = ref(db, 'bookings');
        break;
    }

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataList = Object.values(data);
        setData(dataList);
      } else {
        setData([]);
      }
    });
  }, [filter]);

  const handleBookingPress = (item) => {
    navigation.navigate('BookingDetails', { booking: item });
  };

  const filteredData = data.filter(item => {
    return (
      item.customerName &&
      item.status &&
      item.customerName.toLowerCase().includes(searchName.toLowerCase()) &&
      item.status.toLowerCase().includes(searchStatus.toLowerCase())
    );
  }).filter(item => currentUserEmail === item.customerEmail);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingBox} onPress={() => handleBookingPress(item)}>
      <View style={styles.topLeft}>
        <Text style={styles.name}>{item.customerName}</Text>
        <Text style={styles.eventName}>{filter === 'Booking' ? item.eventType : (filter === 'Album' ? item.albumType : item.frameType)}</Text>
      </View>
      <View style={styles.topRight}>
        <Text style={styles.date}>{filter === 'Booking' ? item.selectedDate : (filter === 'Album' ? item.orderDate : item.orderDate)}</Text>
        <Text style={styles.time}>{filter === 'Booking' ? item.selectedTime : (filter === 'Album') ? item.albumSize : item.frameSize}</Text>
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
      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by name"
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by status"
          value={searchStatus}
          onChangeText={setSearchStatus}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity style={[styles.filterButton, filter === 'Booking' && styles.activeFilter]} onPress={() => setFilter('Booking')}>
            <Text>Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'Package Booking' && styles.activeFilter]} onPress={() => setFilter('Package Booking')}>
            <Text>Package Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'Album' && styles.activeFilter]} onPress={() => setFilter('Album')}>
            <Text>Album</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'Frame' && styles.activeFilter]} onPress={() => setFilter('Frame')}>
            <Text>Frame</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredData}
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
  searchFilterContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilter: {
    backgroundColor: 'lightblue',
  },
});

export default UserMyBooking;
