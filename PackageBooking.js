import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Alert } from 'react-native';
import { firebaseConfig } from './firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as MailComposer from 'expo-mail-composer';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PackageBooking = ({ navigation }) => {
  const route = useRoute();
  const { packageData } = route.params;

  const [customerName, setCustomerName] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [totalAmount, setTotalAmount] = useState(packageData.price);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('noPaid');
  const [advancePayment, setAdvancePayment] = useState('');
  const [fullPayment, setFullPayment] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventTypeName, setEventTypeName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    customerName: '',
    selectedDate: '',
    selectedTime: '',
    customerNumber: '',
    customerEmail: '',
    address: '',
    paymentType: '',
    totalAmount: '',
    balanceAmount: '',
    eventType: '',
    eventTypeName: '',
    invoiceNumber: '',
    eventLocation: '',
  });
  
  // Firebase initialization
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getDatabase(firebaseApp);
  const auth = getAuth(); // Initialize Firebase Authentication

  const [bookingData, setBookingData] = useState({
    userID: '', // Initialize userID
  });


  useEffect(() => {
    // Listen for authentication state changes and get user's UID
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUID = user.uid;
        // Generate invoice number
        generateInvoiceNumber();
        // Fetch total amount from package data
        setTotalAmount(packageData.price);
        // Update booking data with user's UID
        setBookingData({ ...bookingData, userID: userUID });
      } else {
        // User is signed out
        // Clear booking data if needed
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []); // Run only once on component mount

  useEffect(() => {
    generateInvoiceNumber();
    setTotalAmount(packageData.price);
  }, [packageData]);

  useEffect(() => {
    // Recalculate balance amount whenever payment type or payment amounts change
    calculateBalanceAmount(paymentType, advancePayment || fullPayment || 0);
  }, [paymentType, advancePayment, fullPayment]);

  
  const handleSubmit = async () => {
    const phoneNumberPattern = /^[0-9]{10}$/;
    const customerNamepattern = /^[a-zA-Z ]+$/;
    const customerEmailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLength = 2;
    const maxLength = 50;

    // Initialize errors object
    const errors = {};

    if (!customerName) {
      errors.customerName = 'Name is required';
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
      errors.customerNumber = 'Number is required';
    } else if (!phoneNumberPattern.test(customerNumber)) {
      errors.customerNumber = 'Phone number must contain 10 digits';
    }
    if (!customerEmail) {
      errors.customerEmail = 'Email is required';
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
    if (!eventLocation) {
      errors.eventLocation = 'Event Location is required';
    }
    if (!paymentType) {
      errors.captureOption = 'Payment Type option is required';
    }
    if (paymentType === 'fullPayment' && parseFloat(fullPayment) !== parseFloat(totalAmount)) {
      // If payment type is full payment, but full payment amount doesn't match total amount, show error
      errors.fullPayment = 'Full payment amount must match total amount';
      setErrorMessages(errors);
      return; // Stop further execution
    }

    // If payment type is full payment, set balance amount equal to total amount
    if (paymentType === 'fullPayment') {
      bookingData.balanceAmount = totalAmount;
    }

    setErrorMessages(errors);
    if (Object.keys(errors).length === 0) {
    
    const subject = `Your Booking Confirmation - Welcome to ${customerName}!`;
        const recipientEmail = customerEmail;
        const htmlContent =   `Dear ${customerName},
        
        We are thrilled to inform you that your booking has been successfully confirmed at Shire Photography! Thank you for choosing us for your happy moments capture. We are looking forward to serving you and ensuring that your experience with us exceeds your expectations.
        
Here are the details of your booking:
        
Booking Reference Number: ${invoiceNumber}
Name: ${customerName}
Phone: ${customerNumber} 
Date:  ${selectedDate}
Time: ${selectedTime}
Service: ${eventType}
Location: ${eventLocation}

    Please take a moment to review the details above and ensure they align with your requirements. If you have any questions or need to make any changes to your booking, please don't hesitate to contact us at +91 9884315160.
        
        At Shire Photography, we strive to provide exceptional service and create memorable experiences for our valued customers. Our team is dedicated to making your visit with us as enjoyable and stress-free as possible.
        
        We kindly ask that you arrive at least ${selectedTime} before your scheduled appointment to allow ample time for check-in and preparation. If you require any special accommodations or have specific preferences, please let us know in advance, and we will do our best to accommodate your requests.
        
        Once again, thank you for choosing Shire Photography. We are honored to have the opportunity to serve you, and we can't wait to welcome you soon!
        
Warm regards,
        
Shrie Photography
Wedding photographer in Srivilliputhur, Tamil Nadu
+91 9884315160`;
    
        // const htmlContent = `<html lang="en">
        //     <head>
        //       <meta charset="UTF-8">
        //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //       <title>Booking Confirmation</title>
        //       <style>
        //         /* Styles for the email body */
        //         body {
        //           font-family: Arial, sans-serif;
        //           padding: 20px;
        //         }
        //         /* Styles for the container */
        //         .container {
        //           text-align: center;
        //                     display: flex;
        //                     justify-content: center;
        //                     align-items: center;
        //                     flex-direction: column;
        //         }
        //         /* Styles for the logo */
        //         .logo {
        //           width: 150px;
        //           height: auto;
        //           margin-bottom: 20px;
        //         }
        //         /* Styles for the details */
        //         .details {
        //           text-align: left;
        //           margin-bottom: 20px;
        //         }
        //         .details p {
        //           margin: 5px 0;
        //         }
        //         /* Styles for the QR code image */
        //         .qr-code {
        //           width: 200px;
        //           height: auto;
        //           margin: 20px auto;
        //         }
        //       </style>
        //     </head>
        //     <body>
        //       <div class="container">
        //         <!-- Logo -->
        //         <img src="${logoImage}" alt="Logo" class="logo">
        //         <!-- Customer details -->
        //         <div class="details">
        //           <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
        //           <p><strong>Customer Name:</strong> ${customerName}</p>
        //           <p><strong>Email:</strong> ${customerEmail}</p>
        //           <p><strong>Phone:</strong> ${customerNumber}</p>
        //           <p><strong>Address:</strong> ${address}</p>     
        //           <p><strong>Event Name:</strong> ${eventType}</p>
        //           <p><strong>Event Date:</strong> ${selectedDate}</p>
        //           <p><strong>Event Time:</strong> ${selectedTime}</p>
        //           <p><strong>Capture:</strong> ${captureOption}</p>
        //           <p><strong>Location:</strong> ${eventLocation}</p>
        //           <p><strong>Pre-shoot:</strong> ${preShootEvent}</p>
        //           <p><strong>Post-shoot:</strong> ${postShootEvent}</p>
        //           <p><strong>Total Amount:</strong> ${totalPrice}</p>
        //           <p><strong>Payment Type:</strong> ${paymentType}</p>
        //           <p><strong>Full payment:</strong> ${fullPayment}</p>
        //           <p><strong>Advance payment:</strong> ${advancePayment}</p>
        //           <p><strong>Balance payment:</strong> ${balanceAmount}</p>
        //           <!-- Add more details as needed -->
        //         </div>
        //         <!-- QR code image -->
        //         <img src="${qrImage}" alt="QR Code" class="qr-code">
        //         <!-- Thank you message -->
        //         <p>Thank you for booking with us, ${customerName} Your booking has been confirmed.</p>
        //       </div>
        //     </body>
        //     </html>
        // `;
      

        // Call sendEmail function to notify the user via email
        await sendEmail(subject, recipientEmail, htmlContent);
    }
    // Define and initialize bookingData
  const bookingData = {
    customerName,
    selectedDate,
    selectedTime,
    customerNumber,
    customerEmail,
    address,
    paymentType,
    advancePayment,
    fullPayment,
    totalAmount,
    balanceAmount,
    eventType: eventType === 'Others' ? eventTypeName : eventType,
    invoiceNumber,
    eventLocation,
  };

    try {
      // Reference to the 'packagebookings' collection under user's UID
      const packageBookingRef = ref(db, `users/${bookingData.userID}/packagebookings`);
      // Push new booking data to Firebase
      await set(packageBookingRef, bookingData);
      console.log('Booking data added successfully!');
      // Clear form fields and error messages
      // Clear form fields after successful submission
      setCustomerName('');
      setSelectedDate('');
      setSelectedTime('');
      setCustomerNumber('');
      setCustomerEmail('');
      setAddress('');
      setPaymentType('noPaid');
      setAdvancePayment('');
      setFullPayment('');
      setBalanceAmount('');
      setEventType('');
      setEventTypeName('');
      setEventLocation('');
      // Reset error messages
      setErrorMessages({});
    } catch (error) {
      console.error('Error adding booking data:', error);
      // Handle error, show alert, etc.
    }
  };

  useEffect(() => {
    generateInvoiceNumber();
    setTotalAmount(packageData.price);
  }, [packageData]);
  
  useEffect(() => {
    // Recalculate balance amount whenever payment type or payment amounts change
    calculateBalanceAmount(paymentType, advancePayment || fullPayment || 0);
  }, [paymentType, advancePayment, fullPayment]);

  const handlePaymentTypeChange = (value) => {
    // Update payment type state
    setPaymentType(value);
  
    // Calculate balance amount based on payment type and payment amounts
    calculateBalanceAmount(value, advancePayment || fullPayment || 0);
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
  const sendEmail = async (subject, recipientEmail, htmlContent) => {
    try {
      await MailComposer.composeAsync({
        recipients: [recipientEmail],
        subject: subject,
        body: htmlContent, // Use 'body' instead of 'isHtml' if it expects HTML content directly
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
    
   
  const calculateBalanceAmount = (type, amount) => {
    let balance = 0;
    if (type === 'noPaid') {
      balance = parseFloat(amount);
    } else if (type === 'advancePayment') {
      balance = parseFloat(totalAmount) - parseFloat(amount);
    } else if (type === 'fullPayment') {
      // If payment type is full payment, balance amount is the same as total amount
      balance = parseFloat(totalAmount);
    }
    setBalanceAmount(balance.toFixed(2));
  };
    
    
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <SafeAreaView style={styles.safeArea}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}
      </SafeAreaView>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.inputTitle}>
            Name
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
  
          <Text style={styles.inputTitle}>Number
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
  
          <Text style={styles.inputTitle}>Email
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
  
  
          <Text style={styles.inputTitle}>
          Total Amount
            <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              
              style={styles.input}
              value= {totalAmount.toString()}
              onChangeText={setTotalAmount}
              placeholder="Enter Total Amount"
              editable={false}
            />
            {errorMessages.totalAmount && (
              <Text style={styles.errorMessage}>{errorMessages.totalAmount}</Text>
            )}
          </View>
          <Text style={styles.inputTitle}>
            Payment Type
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
                  keyboardType="numeric"
                  style={styles.input}
                  value={advancePayment}
                  onChangeText={setAdvancePayment}
                />
              </View>
            </>
          )}
  
  {paymentType === 'fullPayment' && (
  <>
    {/* Original Full Payment input field */}
    {/* <Text style={styles.inputTitle}>Full Payment</Text>
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        style={styles.input}
        value={fullPayment}
        onChangeText={setFullPayment}
      />
    </View> */}
  </>
)}
  
          <Text style={styles.inputTitle}>
            Balance Amount
            <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Total Amount"
              keyboardType="numeric"
              style={styles.input}
              value={balanceAmount}
              editable={false}
            />
            {errorMessages.totalAmount && (
              <Text style={styles.errorMessage}>{errorMessages.balanceAmount}</Text>
            )}
          </View>
  
          {/* Add the Status input field */}
        {/* <Text style={styles.inputTitle}>Status</Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            style={styles.input}
          >
            <Picker.Item label="Process" value="Process" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Complete" value="Complete" />
          </Picker>
        </View> */}
  
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
    inputTitle: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: 'bold',
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    },
    submitButton: {
      backgroundColor: '#3d218b',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 20,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
    },
    addButton: {
      backgroundColor: '#3d218b',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 20,
    },
    errorMessage: {
      color: 'red',
    },
  });

export default PackageBooking;