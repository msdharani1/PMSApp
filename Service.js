import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PhotographyServiceDetails = () => {
  const navigation = useNavigation();

  const handleEventPress = (eventName) => {
    if (eventName === 'Wedding') {
      // Navigate to another screen where you display the example image
      navigation.navigate('WeddingExampleImage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Photography Services</Text>
      <View style={styles.service}>
        <Text style={styles.heading}>All Event Types</Text>
        <TouchableOpacity onPress={() => handleEventPress('Wedding')}>
          <Text style={styles.eventName}>Weddings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEventPress('Birthday')}>
          <Text style={styles.eventName}>Birthdays</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEventPress('Anniversary')}>
          <Text style={styles.eventName}>Anniversaries</Text>
        </TouchableOpacity>
        {/* Add more event names as needed */}
      </View>
      <View style={styles.service}>
        <Text style={styles.heading}>Album</Text>
        <Text style={styles.detail}>Customized photo albums tailored to your preferences.</Text>
      </View>
      <View style={styles.service}>
        <Text style={styles.heading}>Frame</Text>
        <Text style={styles.detail}>Elegant frames for your cherished memories.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  service: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    color: '#666',
  },
  eventList: {
    marginTop: 10,
  },
  eventName: {
    fontSize: 18,
    marginBottom: 5,
    color: '#555',
  },
});

export default PhotographyServiceDetails;
