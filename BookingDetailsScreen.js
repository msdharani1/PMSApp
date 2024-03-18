import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';


const BookingDetailsScreen = ({ route }) => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const { booking } = route.params;
  const [editMode, setEditMode] = useState(false);


  // State variables for edited values
  const [editedCustomerName, setEditedCustomerName] = useState(booking.customerName);
  const [editedSelectedDate, setEditedSelectedDate] = useState(booking.selectedDate);
  const [editedSelectedTime, setEditedSelectedTime] = useState(booking.selectedTime);
  const [editedCustomerNumber, setEditedCustomerNumber] = useState(booking.customerNumber);
  const [editedCustomerEmail, setEditedCustomerEmail] = useState(booking.customerEmail);
  const [editedAddress, setEditedAddress] = useState(booking.address);
  const [editedPaymentType, setEditedPaymentType] = useState(booking.paymentType);
  const [editedAdvancePayment, setEditedAdvancePayment] = useState(booking.advancePayment);
  const [editedFullPayment, setEditedFullPayment] = useState(booking.fullPayment);
  const [editedEventType, setEditedEventType] = useState(booking.eventType);
  // const [editedEventTypeName, setEditedEventTypeName] = useState('');
  const [editedEmployeeId, setEditedEmployeeId] = useState(booking.employeeId);
  const [editedAlternateNumber, setEditedAlternateNumber] = useState(booking.alternateNumber);
  const [editedWhatsappNumber, setEditedWhatsappNumber] = useState(booking.whatsappNumber);
  const [editedPreShootEvent, setEditedPreShootEvent] = useState(booking.preShootEvent);
  const [editedPostShootEvent, setEditedPostShootEvent] = useState(booking.postShootEvent);
  const [editedEventLocation, setEditedEventLocation] = useState(booking.eventLocation);
  const [editedtotalPrice, setEditedtotalPrice] = useState(booking.totalPrice);
  const [editedBalanceAmount, setEditedBalanceAmount] = useState(booking.totalPrice);
  const [editedStatus, setEditedStatus] = useState(booking.status);

  const handleSaveChanges = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);

    // Update the local state with the edited values
    const updatedBooking = {
      ...booking,
      customerName: editedCustomerName,
      selectedDate: editedSelectedDate,
      selectedTime: editedSelectedTime,
      customerNumber: editedCustomerNumber,
      customerEmail: editedCustomerEmail,
      address: editedAddress,
      paymentType: editedPaymentType,
      advancePayment: editedAdvancePayment,
      fullPayment: editedFullPayment,
      eventType: editedEventType === 'Others' ? editedEventTypeName : editedEventType,
      employeeId: editedEmployeeId,
      alternateNumber: editedAlternateNumber,
      whatsappNumber: editedWhatsappNumber,
      preShootEvent: editedPreShootEvent,
      postShootEvent: editedPostShootEvent,
      eventLocation: editedEventLocation,
      totalPrice: editedtotalPrice,
      balanceAmount: editedBalanceAmount,
      status: editedStatus,
    };

    // Update the booking details in the database
    update(ref(db, `bookings/${booking.id}`), updatedBooking)
      .then(() => {
        // Exit edit mode
        setEditMode(false);
      })
      .catch((error) => console.error("Error updating document: ", error));
  };

  const handlePrint = async () => {
    try {
      const htmlContent = generateHtmlContent(); // Implement this function to generate HTML content
      const pdf = await Print.printToFileAsync({ html: htmlContent });

      if (pdf.uri) {
        await savePdfToDownloads(pdf.uri);
        Alert.alert('Success', 'PDF saved to Download folder');
      } else {
        Alert.alert('Error', 'Failed to save PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const savePdfToDownloads = async (pdfFilePath) => {
    try {
      await FileSystem.moveAsync({
        from: pdfFilePath,
        to: `${FileSystem.documentDirectory}booking.pdf`,
      });
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  };

  const generateHtmlContent = () => {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #3d218b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Booking Details</h1>
        <table>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Customer Name</td>
            <td>${editMode ? editedCustomerName : booking.customerName}</td>
          </tr>
          <!-- Add more rows for other booking details -->
        </table>
      </body>
    </html>
  `;
  };
  

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
        <Ionicons name="create-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>

        {/* Customer Name */}
        <Text style={styles.detailTitle}>Customer Name:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedCustomerName}
            onChangeText={setEditedCustomerName}
          />
        ) : ( 
          <Text style={styles.detail}>{booking.customerName}</Text>
        )}
       
       {/* Event Date */}
       <Text style={styles.detailTitle}>Event Date:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedSelectedDate}
            onChangeText={setEditedSelectedDate}
          />
        ) : (
          <Text style={styles.detail}>{booking.selectedDate}</Text>
        )}

        {/* Event Time */}
       <Text style={styles.detailTitle}>Event Time:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedSelectedTime}
            onChangeText={setEditedSelectedTime}
          />
        ) : (
          <Text style={styles.detail}>{booking.selectedTime}</Text>
        )}

        {/* Number */}
       <Text style={styles.detailTitle}>Number:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedCustomerNumber}
            onChangeText={setEditedCustomerNumber}
          />
        ) : (
          <Text style={styles.detail}>{booking.customerNumber}</Text>
        )}


        {/* Email */}
       <Text style={styles.detailTitle}>Email:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedCustomerEmail}
            onChangeText={setEditedCustomerEmail}
          />
        ) : (
          <Text style={styles.detail}>{booking.customerEmail}</Text>
        )}


        {/* Address */}
       <Text style={styles.detailTitle}>Address:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedAddress}
            onChangeText={setEditedAddress}
          />
        ) : (
          <Text style={styles.detail}>{booking.address}</Text>
        )}

        {/* Event Type */}
       <Text style={styles.detailTitle}>Event Type:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedEventType}
            onChangeText={setEditedEventType}
          />
        ) : (
          <Text style={styles.detail}>{booking.eventType}</Text>
        )}

        {/* Employee Id */}
       <Text style={styles.detailTitle}>Employee Id:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedEmployeeId}
            onChangeText={setEditedEmployeeId}
          />
        ) : (
          <Text style={styles.detail}>{booking.employeeId}</Text>
        )}

        {/* Alternate Number */}
       <Text style={styles.detailTitle}>Alternate Number:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedAlternateNumber}
            onChangeText={setEditedAlternateNumber}
          />
        ) : (
          <Text style={styles.detail}>{booking.alternateNumber}</Text>
        )}

        {/* Whatsapp Number */}
       <Text style={styles.detailTitle}>Whatsapp Number:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedWhatsappNumber}
            onChangeText={setEditedWhatsappNumber}
          />
        ) : (
          <Text style={styles.detail}>{booking.whatsappNumber}</Text>
        )}

        {/* Pre-Shoot Event */}
       <Text style={styles.detailTitle}>Pre-Shoot Event:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedPreShootEvent}
            onChangeText={setEditedPreShootEvent}
          />
        ) : (
          <Text style={styles.detail}>{booking.preShootEvent}</Text>
        )}

        {/* Post-Shoot Event*/}
       <Text style={styles.detailTitle}>Post-Shoot Event:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedPostShootEvent}
            onChangeText={setEditedPostShootEvent}
          />
        ) : (
          <Text style={styles.detail}>{booking.postShootEvent}</Text>
        )}

        {/* Event Location*/}
       <Text style={styles.detailTitle}>Location:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedEventLocation}
            onChangeText={setEditedEventLocation}
          />
        ) : (
          <Text style={styles.detail}>{booking.eventLocation}</Text>
        )}

        {/* Pament Type */}
       <Text style={styles.detailTitle}>Pament Type:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedPaymentType}
            onChangeText={setEditedPaymentType}
          />
        ) : (
          <Text style={styles.detail}>{booking.paymentType}</Text>
        )}

        {/* Advance Payment */}
       <Text style={styles.detailTitle}>Advance Payment:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedAdvancePayment}
            onChangeText={setEditedAdvancePayment}
          />
        ) : (
          <Text style={styles.detail}>{booking.advancePayment}</Text>
        )}

        {/* Full Payment */}
       <Text style={styles.detailTitle}>Full Payment:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedFullPayment}
            onChangeText={setEditedFullPayment}
          />
        ) : (
          <Text style={styles.detail}>{booking.fullPayment}</Text>
        )}
        
        {/* Total Amount */}
       <Text style={styles.detailTitle}>Total Amount:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedtotalPrice}
            onChangeText={setEditedtotalPrice}
          />
        ) : (
          <Text style={styles.detail}>{booking.totalPrice}</Text>
        )}

        {/* Balance Amount */}
       <Text style={styles.detailTitle}>Balance Amount:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedBalanceAmount}
            onChangeText={setEditedBalanceAmount}
          />
        ) : (
          <Text style={styles.detail}>{booking.balanceAmount}</Text>
        )}

        {/* Status */}
       <Text style={styles.detailTitle}>Status:</Text>
        {editMode ? (
          <TextInput
            style={styles.detailInput}
            value={editedStatus}
            onChangeText={setEditedStatus}
          />
        ) : (
          <Text style={styles.detail}>{booking.status}</Text>
        )}

      </View>
      {editMode && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
        <Text style={styles.buttonText}>Print</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 250,
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
  detailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#3d218b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  printButton: {
    backgroundColor: '#3d218b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 100, // Adjusted marginBottom
  },
});

export default BookingDetailsScreen;
