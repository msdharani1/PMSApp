import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';

const BookingScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [filter, setFilter] = useState('Booking');

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    let dataRef;

    switch (filter) {
      case 'Booking':
        dataRef = ref(db, 'bookings');
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

  const handleDashboardPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleReviewPress = () => {
    navigation.navigate('Review');
  };

  const handleCustomerPress = () => {
    navigation.navigate('Customer');
  };

  const handleBookingPress = (item) => {
    navigation.navigate('BookingDetails', { booking: item });
  };

  const filteredData = data.filter(item => {
    return item.customerName.toLowerCase().includes(searchName.toLowerCase()) &&
           item.status.toLowerCase().includes(searchStatus.toLowerCase());
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingBox} onPress={() => handleBookingPress(item)}>
      <View style={styles.topLeft}>
        <Text style={styles.name}>{filter === 'Booking' ? item.customerName : (filter === 'Album' ? item.customerName : item.customerName)}</Text>
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
      <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
        <View>
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
          {filteredData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.bookingBox} onPress={() => handleBookingPress(item)}>
              <View style={styles.topLeft}>
                <Text style={styles.name}>{filter === 'Booking' ? item.customerName : (filter === 'Album' ? item.customerName : item.customerName)}</Text>
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
          ))}

          {/* </FlatList> */}
        </View>
      </TouchableWithoutFeedback>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    paddingTop: StatusBar.currentHeight || 0,
    paddingTop: 60,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 280,
  },
  menuIcon: {
    position: 'absolute',
    top: -40,
    right: 20,
    zIndex: 1,
  },
  optionsContainer: {
    position: 'absolute',
    top: -10,
    right: 12,
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
  }
});

export default BookingScreen;
