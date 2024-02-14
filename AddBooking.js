import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app'; // Import Firebase app
import { getDatabase, ref, push } from 'firebase/database'; // Import Firebase database functions
import { firebaseConfig } from './firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddBooking = () => {
  const navigation = useNavigation();
  const [paymentType, setPaymentType] = useState('noPaid');
  const [advancePayment, setAdvancePayment] = useState('');
  const [fullPayment, setFullPayment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [eventType, setEventType] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [employeeId, setEmployeeId] = useState([]);
  const [alternateNumber, setAlternateNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    generateInvoiceNumber();
  }, []);

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date.toDateString());
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time.toTimeString());
    setTimePickerVisibility(false);
  };

  const generateInvoiceNumber = async () => {
    const timestamp = Date.now();
    setInvoiceNumber(`INV${timestamp}`);
  };

  const handleSubmit = async () => {
    const errors = {};

    if (!customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!selectedDate) {
      errors.selectedDate = 'Event Date is required';
    }
    if (!selectedTime) {
      errors.selectedTime = 'Event Time is required';
    }
    if (!customerNumber) {
      errors.customerNumber = 'Customer Number is required';
    }
    if (!customerEmail) {
      errors.customerEmail = 'Customer Email is required';
    }
    if (!address) {
      errors.address = 'Address is required';
    }
    if (!eventType) {
      errors.eventType = 'Event Type is required';
    }
    if (!employeeId.length) {
      errors.employeeId = 'Employee ID is required';
    }
    if (!whatsappNumber) {
      errors.whatsappNumber = 'WhatsApp Number is required';
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await generateInvoiceNumber();

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);

    push(ref(db, 'bookings'), {
      customerName,
      selectedDate,
      selectedTime,
      customerNumber,
      invoiceNumber,
      customerEmail,
      address,
      paymentType,
      advancePayment,
      fullPayment,
      eventType,
      employeeId,
      alternateNumber,
      whatsappNumber,
    })
      .then(() => {
        setCustomerName('');
        setSelectedDate('');
        setSelectedTime('');
        setCustomerNumber('');
        setCustomerEmail('');
        setAddress('');
        setPaymentType('noPaid');
        setAdvancePayment('');
        setFullPayment('');
        setEventType('');
        setEmployeeId([]);
        setAlternateNumber('');
        setWhatsappNumber('');
      })
      .catch((error) => console.error("Error writing document: ", error));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 15, left: 25, zIndex: 999 }}>
          <Ionicons name="arrow-back" size={24} color="black"/>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.inputTitle}>
          Customer Name
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter customer name"
            style={styles.input}
            value={customerName}
            onChangeText={setCustomerName}
          />
          {errorMessages.customerName && (
            <Text style={styles.errorMessage}>{errorMessages.customerName}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>
          Event Date
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisibility(true)}>
            <Text>{selectedDate || 'Select Date'}</Text>
          </TouchableOpacity>
          {errorMessages.selectedDate && (
            <Text style={styles.errorMessage}>{errorMessages.selectedDate}</Text>
          )}
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <Text style={styles.inputTitle}>
          Event Time
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.input} onPress={() => setTimePickerVisibility(true)}>
            <Text>{selectedTime || 'Select Time'}</Text>
          </TouchableOpacity>
          {errorMessages.selectedTime && (
            <Text style={styles.errorMessage}>{errorMessages.selectedTime}</Text>
          )}
        </View>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisibility(false)}
        />

        <Text style={styles.inputTitle}>Customer Number
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter customer number"
            style={styles.input}
            value={customerNumber}
            onChangeText={setCustomerNumber}
          />
          {errorMessages.customerNumber && (
            <Text style={styles.errorMessage}>{errorMessages.customerNumber}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>Customer Email
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter customer email"
            style={styles.input}
            value={customerEmail}
            onChangeText={setCustomerEmail}
          />
          {errorMessages.customerEmail && (
            <Text style={styles.errorMessage}>{errorMessages.customerEmail}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>Address
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          {errorMessages.address && (
            <Text style={styles.errorMessage}>{errorMessages.address}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>Payment Type
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <Picker
          selectedValue={paymentType}
          onValueChange={handlePaymentTypeChange}
          style={styles.input}  
        >
          <Picker.Item label="Not Paid" value="noPaid" />
          <Picker.Item label="Advance Payment" value="advancePayment" />
          <Picker.Item label="Full Payment" value="fullPayment" />
        </Picker>

        {paymentType === 'advancePayment' && (
          <>
            <Text style={styles.inputTitle}>Advance Payment</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Amount"
                style={styles.input}
                value={advancePayment}
                onChangeText={setAdvancePayment}
              />
            </View>
          </>
        )}

        {paymentType === 'fullPayment' && (
          <>
            <Text style={styles.inputTitle}>Full Payment</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Amount"
                style={styles.input}
                value={fullPayment}
                onChangeText={setFullPayment}
              />
            </View>
          </>
        )}

        <Text style={styles.inputTitle}>
          Event Type
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={eventType}
            onValueChange={(value) => setEventType(value)}
            style={styles.input}
          >
            <Picker.Item label="select" value="select" />
            <Picker.Item label="Birthday Party" value="Birthday Party" />
            <Picker.Item label="Corporate Event" value="Corporate Event" />
            <Picker.Item label="Marriage Event" value="Marriage Event" />
            <Picker.Item label="Housewarming Event" value="Housewarming Event" />
            <Picker.Item label="Baby Shower Event" value="Baby Shower Event" />
            {/* Add more event types as needed */}
          </Picker>
          {errorMessages.eventType && (
            <Text style={styles.errorMessage}>{errorMessages.eventType}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>
          Invoice Number
          <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Invoice Number"
            style={styles.input}
            value={invoiceNumber}
            editable={false}
          />
        </View>

        <Text style={styles.inputTitle}>Employee ID
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={employeeId}
            onValueChange={(value) => setEmployeeId(value)}
            style={styles.input}
            mode="dropdown"
            multiple={true}
          >
            <Picker.Item label="Select Employee ID" value="" />
            <Picker.Item label="Emp1" value="Emp1" />
            <Picker.Item label="Emp2" value="Emp2" />
            <Picker.Item label="Emp3" value="Emp3" />
            {/* Add more employee IDs as needed */}
          </Picker>
          {errorMessages.employeeId && (
            <Text style={styles.errorMessage}>{errorMessages.employeeId}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>Alternate Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Alternate Number"
            style={styles.input}
            value={alternateNumber}
            onChangeText={setAlternateNumber}
          />
        </View>

        <Text style={styles.inputTitle}>WhatsApp Number
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter WhatsApp Number"
            style={styles.input}
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
          />
          {errorMessages.whatsappNumber && (
            <Text style={styles.errorMessage}>{errorMessages.whatsappNumber}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 200
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    padding: 15,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    paddingBottom: 60,
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#3d218b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
});

export default AddBooking;
