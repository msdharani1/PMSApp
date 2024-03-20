import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Gallery = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);

  // Dummy data for images
  useEffect(() => {
    // Dummy image URLs
    const imageUrls = [
      require('./assets/g00.jpg'),
      require('./assets/g1.jpg'),
      require('./assets/g2.jpg'),
      require('./assets/g3.jpg'),
      require('./assets/g4.jpg'),
      require('./assets/g5.jpg'),
      require('./assets/g6.jpg'),
      require('./assets/g7.jpg'),
      require('./assets/g8.jpg'),
      require('./assets/g9.jpg'),
      // require('./assets/g10.jpg'),
      // require('./assets/g11.jpg'),
      // require('./assets/g12.jpg'),
      // require('./assets/g13.jpg'),
      require('./assets/g14.jpg'),
      // require('./assets/g15.jpg'),
      // require('./assets/g16.jpg'),
      // require('./assets/g17.jpg'),
      // require('./assets/g18.jpg'),
      require('./assets/g19.jpg'),
      require('./assets/g20.jpg'),
    ];
    setImages(imageUrls);
  }, []);

  const handleDashboardPress = () => {
    navigation.navigate('Home');
  };

  const handleReviewPress = () => {
    navigation.navigate('Reviews');
  };

  const handleBookingPress = () => {
    navigation.navigate('Bookings');
  };

  const handleCustomerPress = () => {
    navigation.navigate('Customer');
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleDashboardPress}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Home</Text>
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
          <Ionicons name="camera" size={24} color="black"/>
          <Text style={[styles.iconText, styles.activeText]}>Gallery</Text>
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
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100px',
    height: '100px',
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 10,
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

export default Gallery;
