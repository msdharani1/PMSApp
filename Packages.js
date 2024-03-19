import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Packages = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo & Videography Packages</Text>
      <View style={styles.package}>
        <Text style={styles.packageTitle}>Standard Package</Text>
        <Text style={styles.packageDetails}>Includes 4 hours of photo and videography coverage. 50 edited photos and a highlight video.</Text>
        <Text style={styles.packagePrice}>₹49,000</Text>
      </View>
      <View style={styles.package}>
        <Text style={styles.packageTitle}>Premium Package</Text>
        <Text style={styles.packageDetails}>Includes 8 hours of photo and videography coverage. 100 edited photos, a highlight video, and a full-length video.</Text>
        <Text style={styles.packagePrice}>₹99,999</Text>
      </View>
      <View style={styles.package}>
        <Text style={styles.packageTitle}>Deluxe Package</Text>
        <Text style={styles.packageDetails}>Includes 12 hours of photo and videography coverage. 150 edited photos, a highlight video, a full-length video, and drone coverage.</Text>
        <Text style={styles.packagePrice}>₹1,59,999</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  package: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packageDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default Packages;
