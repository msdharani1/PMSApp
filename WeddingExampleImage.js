import React from 'react';
import { ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const WeddingExampleImage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/1.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/2.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/3.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/4.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/5.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/6.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/7.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/8.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/9.jpg')} style={styles.image}></Image>
      <Image source={require('./assets/10.jpg')} style={styles.image}></Image>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const imageWidth = width * 0.9; // Set the width of the images to 90% of the screen width

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // optional background color
    paddingTop: 60,
  },
  image: {
    width: imageWidth,
    height: imageWidth * 0.8, // Maintain the aspect ratio (adjust the multiplier as needed)
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default WeddingExampleImage;
