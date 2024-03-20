import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Contacts = () => {
  const navigation = useNavigation(); // Add this line to access navigation

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Contact Details</Text>
      <View style={styles.contactContainer}>
        <Ionicons name="person-circle-outline" size={24} color="#333" style={styles.icon} />
        <Text style={styles.info}>Jeyaganesan</Text>
      </View>
      <View style={styles.contactContainer}>
        <Ionicons name="call-outline" size={24} color="#333" style={styles.icon} />
        <Text style={styles.info}>9944282442</Text>
      </View>
      <View style={styles.contactContainer}>
        <Ionicons name="mail-outline" size={24} color="#333" style={styles.icon} />
        <Text style={styles.info}>shriedigital@gmail.com</Text>
      </View>
      <View style={styles.contactContainer}>
        <Ionicons name="location-outline" size={24} color="#333" style={styles.icon} />
        <Text style={[styles.info, { textAlign: 'left' }]}>701b, Sivakasi Main Road, Srivilliputhur North, (Opposite Tmb Bank), Srivilliputtur - 626125</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
        <Text style={styles.buttonText}>View Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 10,
  },
  info: {
    fontSize: 18,
    color: '#333',
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#3d218b',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Contacts;
