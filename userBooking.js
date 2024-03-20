import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, TouchableWithoutFeedback, TextInput, FlatList, Image } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';
import AddBooking from './AddBooking'; // Import the addBooking.js file
import AddFrame from './addFrame'; // Import the AddFrame component
import AddAlbum from './addAlbum'; // Import the AddAlbum component
import ImageFormatDesign from './ImageFormatDesign'; 
import { SliderBox } from 'react-native-image-slider-box';


const Bookings = () => {
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object
  const [selectedOption, setSelectedOption] = useState(null);
  const images = [
    require('./assets/7.jpg'),
    require('./assets/12.jpg'),
    require('./assets/5.jpg'),
    require('./assets/11.jpg'),
    require('./assets/4.jpg'),
    // Add more image objects as needed
  ];

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
    navigation.navigate('Home');
  };

  const handleReviewPress = () => {
    navigation.navigate('Reviews');
  };

  const handleCustomerPress = () => {
    navigation.navigate('Gallery');
  };

  const handleBookingPress = (item) => {
    navigation.navigate('BookingDetails', { booking: item });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <SliderBox
          images={images} // Pass the array of image objects
          dotColor="red"
          inactiveDotColor="black"
          dotStyle={{
            height: 20,
            width: 20,
            borderRadius: 50,
          }}
          imageLoadingColor="black"
          autoplay={true}
          autoplayInterval={1000}
          circleLoop={true}
          onCurrentImagePressed={(index) => alert(index + 1)}
          firstItem={4}
          paginationBoxVerticalPadding={20}
          height={'200px'}
        />
          <View style={styles.selectionBox}>
            <TouchableOpacity
              style={[styles.selectionButton, selectedOption === 'Event' && styles.selectedButton]}
              onPress={() => setSelectedOption('Event')}
            >
              <Text style={styles.selectionButtonText}>Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectionButton, selectedOption === 'Album' && styles.selectedButton]}
              onPress={() => setSelectedOption('Album')}
            >
              <Text style={styles.selectionButtonText}>Album</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectionButton, selectedOption === 'Frame' && styles.selectedButton]}
              onPress={() => setSelectedOption('Frame')}
            >
              <Text style={styles.selectionButtonText}>Frame</Text>
            </TouchableOpacity>
          </View>

        {/* Render addBooking.js component if "Event" option is selected */}
        {selectedOption === 'Event' && <AddBooking />}
        {selectedOption === 'Frame' && <AddFrame />}
      {selectedOption === 'Album' && <AddAlbum />}
      {selectedOption === null && <ImageFormatDesign />}
      </ScrollView>
      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNav}>
        {/* Dashboard Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleDashboardPress}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Home</Text>
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
          <Ionicons name="camera" size={24} color="black" />
          <Text style={styles.iconText}>Gallery</Text>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  selectionButton: {
    backgroundColor: '#E2EAF2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    color: '#fff'
  },
  selectedButton: {
    backgroundColor: '#3d218b',
    
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#000'
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

export default Bookings;
