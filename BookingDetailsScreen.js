import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { update, initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';

const BookingDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { booking } = route.params;
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    navigation.navigate('EditBooking', { booking });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleStatusChange = (status) => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);
    update(ref(db, `bookings/${booking.id}`), { status })
      .then(() => {
        booking.status = status;
      })
      .catch((error) => console.error("Error updating document: ", error));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons name="create-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Customer Name: {booking.customerName}</Text>
        <Text style={styles.detailTitle}>Invoice Number: {booking.invoiceNumber}</Text>
        <Text style={styles.detail}>Event Type: {booking.eventType}</Text>
        <Text style={styles.detail}>Date: {booking.selectedDate}</Text>
        <Text style={styles.detail}>Time: {booking.selectedTime}</Text>
        <Text style={styles.detail}>Status: {booking.status}</Text>
        <Text style={styles.detail}>Customer Number: {booking.customerNumber}</Text>
        <Text style={styles.detail}>Address: {booking.address}</Text>
        <Text style={styles.detail}>Email: {booking.customerEmail}</Text>
        <Text style={styles.detail}>Payment Type: {booking.paymentType}</Text>
        {/* Check if advancePayment is not empty before displaying */}
        {booking.advancePayment !== '' && (
          <Text style={styles.detail}>Advance Payment: {booking.advancePayment}</Text>
        )}
        {/* Check if fullPayment is not empty before displaying */}
        {booking.fullPayment !== '' && (
          <Text style={styles.detail}>Full Payment: {booking.fullPayment}</Text>
        )}
        {/* Check if advancePayment or fullPayment is not empty before displaying */}
        {(booking.advancePayment !== '' || booking.fullPayment !== '') && (
          <Text style={styles.detail}>Payment Status: Paid</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleStatusChange('Cancel')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pendingButton} onPress={() => handleStatusChange('Pending')}>
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.successButton} onPress={() => handleStatusChange('Success')}>
          <Text style={styles.buttonText}>Success</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  pendingButton: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  successButton: {
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

export default BookingDetailsScreen;
