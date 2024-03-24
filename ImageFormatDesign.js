import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ImageFormatDesign = () => {
  const navigation = useNavigation();

  // Define an array of objects containing image URLs or URIs
  const images = [
    require('./assets/p1.jpg'),
    require('./assets/p2.jpg'),
    require('./assets/p3.jpg'),
    require('./assets/p4.jpg'),
    require('./assets/p5.jpg'),
    // Add more image objects as needed
  ];

  const handleBookingClick = () => {
    // Navigate to the Packages screen when the button is clicked
    navigation.navigate('Package');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SliderBox
          images={images} // Pass the array of image objects
          dotColor="red"
          inactiveDotColor="black"
          dotStyle={{
            height: 10,
            width: 10,
            borderRadius: 50,
          }}
          imageLoadingColor="black"
          autoplay={true}
          autoplayInterval={3000}
          circleLoop={true}
          // onCurrentImagePressed={(index) => alert(index + 1)}
          firstItem={0}
          paginationBoxVerticalPadding={20}
          style={styles.sliderBox}
          marginLeft={15}
          marginTop={10}
          paddingBottom={60}
        />
        <TouchableOpacity style={styles.button} onPress={handleBookingClick}>
          <Text style={styles.buttonText}>Package Booking</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Reviews')}>
          <Ionicons name="star" size={24} color="black" />
          <Text style={styles.iconText}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={handleBookingClick}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Gallery')}>
          <Ionicons name="people" size={24} color="black" />
          <Text style={styles.iconText}>Customer</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const { height } = Dimensions.get('window'); // Get the device height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: '#3d218b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  sliderBox: {
    height: height * 0.6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ImageFormatDesign;
