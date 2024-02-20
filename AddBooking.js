import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
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
  const [eventTypeName, setEventTypeName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [employeeId, setEmployeeId] = useState([]);
  const [alternateNumber, setAlternateNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preShootEvent, setPreShootEvent] = useState(false);
  const [postShootEvent, setPostShootEvent] = useState(false);
  const [eventLocation, setEventLocation] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    customerName: '',
    selectedDate: '',
    selectedTime: '',
    customerNumber: '',
    customerEmail: '',
    address: '',
    eventType: '',
    eventTypeName: '',
    employeeId: '',
    whatsappNumber: '',
    eventLocation: '',
  });

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

    // Phone number validation regex pattern
    const phoneNumberPattern = /^[0-9]{10}$/;
    const whatsappNumberPattern = /^[0-9]{10}$/;
    const alternateNumberPattern = /^[0-9]{10}$/;
    const customerNamepattern = /^[a-zA-Z ]+$/;
    const customerEmailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLength = 2;
    const maxLength = 50;

    if (!customerName) {
      errors.customerName = 'Customer Name is required';
    }
    else if(!customerNamepattern.test(customerName)) {
      errors.customerName="Name must contain only alphabetic characters";
    }
    else if(customerName.length < minLength || customerName.length > maxLength){
      errors.customerName="Name must be between minimum 2  characters";
    }
    if (!selectedDate) {
      errors.selectedDate = 'Event Date is required';
    }
    if (!selectedTime) {
      errors.selectedTime = 'Event Time is required';
    }
    if (!customerNumber) {
      errors.customerNumber = 'Customer Number is required';
    } else if (!phoneNumberPattern.test(customerNumber)) {
      errors.customerNumber = 'phone number must contain 10 digits';
    }
    if (!customerEmail) {
      errors.customerEmail = 'Customer Email is required';
    }else if(!customerEmailpattern.test(customerEmail)){
        errors.customerEmail="Invalid Email format"
    }
    if (!address) {
      errors.address = 'Address is required';
    }
    if (!eventType) {
      errors.eventType = 'Event Type is required';
    }
    if (eventType === 'Others' && !eventTypeName) {
      errors.eventTypeName = 'Event Type Name is required';
    }
    if (!employeeId.length) {
      errors.employeeId = 'Employee ID is required';
    }
    if (!alternateNumberPattern.test(alternateNumber)) {
      errors.alternateNumber = 'phone number must contain 10 digits';
    }
    if (!whatsappNumber) {
      errors.whatsappNumber = 'WhatsApp Number is required';
    }else if (!whatsappNumberPattern.test(whatsappNumber)) {
      errors.whatsappNumber = 'phone number must contain 10 digits';
    }
    if (!eventLocation) {
      errors.eventLocation = 'Event Location is required';
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
      eventType: eventType === 'Others' ? eventTypeName : eventType,
      employeeId,
      alternateNumber,
      whatsappNumber,
      preShootEvent,
      postShootEvent,
      eventLocation,
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
        setEventTypeName('');
        setEmployeeId([]);
        setAlternateNumber('');
        setWhatsappNumber('');
        setPreShootEvent(false);
        setPostShootEvent(false);
        setEventLocation('');
      })
      .catch((error) => console.error("Error writing document: ", error));
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
      <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
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
          minimumDate={new Date()} // Only current and future dates are selectable
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
            keyboardType="numeric"
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
        <View style={[styles.inputContainer, { height: 100 }]}>
          <TextInput
            placeholder="Enter address"
            style={[styles.input, { height: 80 }]} // Increase the height of the input field
            multiline={true} // Allow multiline input
            numberOfLines={4} // Set number of lines to show initially
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
            <Picker.Item label="Others" value="Others" />
            {/* Add more event types as needed */}
          </Picker>
          {errorMessages.eventType && (
            <Text style={styles.errorMessage}>{errorMessages.eventType}</Text>
          )}
        </View>

        {eventType === 'Others' && (
          <>
            <Text style={styles.inputTitle}>Event Type Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Event Type Name"
                style={styles.input}
                value={eventTypeName}
                onChangeText={setEventTypeName}
              />
              {errorMessages.eventTypeName && (
                <Text style={styles.errorMessage}>{errorMessages.eventTypeName}</Text>
              )}
            </View>
          </>
        )}

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
            keyboardType="numeric"
          />
           {errorMessages.alternateNumber && (
            <Text style={styles.errorMessage}>{errorMessages.alternateNumber}</Text>
          )}
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
            keyboardType="numeric"
          />
          {errorMessages.whatsappNumber && (
            <Text style={styles.errorMessage}>{errorMessages.whatsappNumber}</Text>
          )}
        </View>

        <Text style={styles.inputTitle}>Pre-Shoot Event</Text>
<View style={styles.inputContainer}>
  <Picker
    selectedValue={preShootEvent ? 'Yes' : 'No'}
    onValueChange={(value) => setPreShootEvent(value === 'Yes')}
    style={styles.input}
  >
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
  </Picker>
  {errorMessages.preShootEvent && (
    <Text style={styles.errorMessage}>{errorMessages.preShootEvent}</Text>
  )}
</View>

<Text style={styles.inputTitle}>Post-Shoot Event</Text>
<View style={styles.inputContainer}>
  <Picker
    selectedValue={postShootEvent ? 'Yes' : 'No'}
    onValueChange={(value) => setPostShootEvent(value === 'Yes')}
    style={styles.input}
  >
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
  </Picker>
  {errorMessages.postShootEvent && (
    <Text style={styles.errorMessage}>{errorMessages.postShootEvent}</Text>
  )}
</View>


        <Text style={styles.inputTitle}>Event Location
        <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Event Location"
            style={styles.input}
            value={eventLocation}
            onChangeText={setEventLocation}
          />
          {errorMessages.eventLocation && (
            <Text style={styles.errorMessage}>{errorMessages.eventLocation}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={{ color: 'white', fontSize: 15 }}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  safeArea: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  backButton: {
    position: 'absolute',
    top: -43,
    left: -5,
    zIndex: 999,
    padding: 10,
    borderRadius: 20,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
  },
  formContainer: {
    justifyContent: 'center',
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#3d218b',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});

export default AddBooking;
