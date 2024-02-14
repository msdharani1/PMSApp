import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app'; // Import initializeApp function from the Firebase SDK

const EditBookingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { booking } = route.params;
  const [editedBooking, setEditedBooking] = useState({ ...booking });

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Check if all necessary fields are present in the editedBooking state
    if (
      !editedBooking.customerName ||
      !editedBooking.invoiceNumber ||
      !editedBooking.eventType ||
      !editedBooking.selectedDate ||
      !editedBooking.selectedTime ||
      !editedBooking.status ||
      !editedBooking.customerNumber ||
      !editedBooking.address ||
      !editedBooking.customerEmail ||
      !editedBooking.paymentType
    ) {
      console.error('Missing required fields in edited booking.');
      return;
    }
  
    // Update data in the database
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    if (db) {
      // Use the update method to update the existing booking details
      update(ref(db, `bookings/${booking.id}`), editedBooking)
        .then(() => {
          navigation.goBack(); // If the update is successful, navigate back to the previous screen
        })
        .catch((error) => console.error("Error updating document: ", error));
    } else {
      console.error("Firebase database not available.");
    }
  };

  const handleChange = (key, value) => {
    // Update the editedBooking state when the user changes input fields
    setEditedBooking(prevState => ({
      ...prevState,
      [key]: value
    }));
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {/* Editable fields */}
        <Text style={styles.detailTitle}>Customer Name:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.customerName}
          onChangeText={(text) => handleChange('customerName', text)} // Call handleChange with the field name and new value
        />
        <Text style={styles.detailTitle}>Invoice Number:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.invoiceNumber}
          onChangeText={(text) => handleChange('invoiceNumber', text)}
        />
        <Text style={styles.detailTitle}>Event Type:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.eventType}
          onChangeText={(text) => handleChange('eventType', text)}
        />
        <Text style={styles.detailTitle}>Date:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.selectedDate}
          onChangeText={(text) => handleChange('selectedDate', text)}
        />
        <Text style={styles.detailTitle}>Time:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.selectedTime}
          onChangeText={(text) => handleChange('selectedTime', text)}
        />
        <Text style={styles.detailTitle}>Status:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.status}
          onChangeText={(text) => handleChange('status', text)}
        />
        <Text style={styles.detailTitle}>Customer Number:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.customerNumber}
          onChangeText={(text) => handleChange('customerNumber', text)}
        />
        <Text style={styles.detailTitle}>Address:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.address}
          onChangeText={(text) => handleChange('address', text)}
        />
        <Text style={styles.detailTitle}>Email:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.customerEmail}
          onChangeText={(text) => handleChange('customerEmail', text)}
        />
        <Text style={styles.detailTitle}>Payment Type:</Text>
        <TextInput
          style={styles.input}
          value={editedBooking.paymentType}
          onChangeText={(text) => handleChange('paymentType', text)}
        />
        {/* Add other editable fields here */}
        {/* Check if advancePayment is not empty before displaying */}
        {booking.advancePayment !== '' && (
          <>
            <Text style={styles.detailTitle}>Advance Payment:</Text>
            <TextInput
              style={styles.input}
              value={editedBooking.advancePayment}
              onChangeText={(text) => handleChange('advancePayment', text)}
            />
          </>
        )}
        {/* Check if fullPayment is not empty before displaying */}
        {booking.fullPayment !== '' && (
          <>
            <Text style={styles.detailTitle}>Full Payment:</Text>
            <TextInput
              style={styles.input}
              value={editedBooking.fullPayment}
              onChangeText={(text) => handleChange('fullPayment', text)}
            />
          </>
        )}
        {/* Check if advancePayment or fullPayment is not empty before displaying */}
        {(booking.advancePayment !== '' || booking.fullPayment !== '') && (
          <Text style={styles.detailTitle}>Payment Status: Paid</Text>
        )}
      </View>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 100,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 

export default EditBookingScreen;
