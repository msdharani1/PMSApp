import React, { useState, useEffect , useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for making HTTP requests
import * as MailComposer from 'expo-mail-composer';


const UserAddBookings = () => {
  const navigation = useNavigation();
  const [customerName, setCustomerName] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('noPaid');
  const [advancePayment, setAdvancePayment] = useState('');
  const [fullPayment, setFullPayment] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventTypeName, setEventTypeName] = useState('');
  const [captureOption, setCaptureOption] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  // const [employeeId, setEmployeeId] = useState([]);
  const [alternateNumber, setAlternateNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [status, setStatus] = useState('Process'); 
  const [preShootEvent, setPreShootEvent] = useState('No');
  const [postShootEvent, setPostShootEvent] = useState('No');
  const [eventLocation, setEventLocation] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    customerName: '',
    selectedDate: '',
    selectedTime: '',
    customerNumber: '',
    customerEmail: '',
    address: '',
    paymentType: '',
   // totalPrice: '',
    balanceAmount: '',
    eventType: '',
    eventTypeName: '',
    captureOption: '',
    invoiceNumber: '',
    // employeeId: '',
    alternateNumber: '',
    whatsappNumber: '',
    eventLocation: '',
    status: '',
  });

  

  useEffect(() => {
    generateInvoiceNumber();
  }, []);

  useEffect(() => {
    // Recalculate balance amount whenever payment type or payment amounts change
    calculateBalanceAmount(paymentType, advancePayment || fullPayment || 0);
  }, [paymentType, advancePayment, fullPayment]);

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
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
  
  const handleSubmit = async () => {

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
        const errors = {};

        // Call sendEmail function to notify the user via email
        await sendEmail(subject, recipientEmail, htmlContent);

    // Phone number validation regex pattern
    const phoneNumberPattern = /^[0-9]{10}$/;
    const whatsappNumberPattern = /^[0-9]{10}$/;
    const customerNamepattern = /^[a-zA-Z ]+$/;
    const customerEmailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLength = 2;
    const maxLength = 50;

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
    // if (!employeeId.length) {
    //   errors.employeeId = 'Employee ID is required';
    // }
    if (!whatsappNumber) {
      errors.whatsappNumber = 'WhatsApp Number is required';
    }else if (!whatsappNumberPattern.test(whatsappNumber)) {
      errors.whatsappNumber = 'Phone number must contain 10 digits';
    }
    if (!eventLocation) {
      errors.eventLocation = 'Event Location is required';
    }
    if (!captureOption) {
      errors.captureOption = 'Capture option is required';
    }
    if (!status) {
      errors.captureOption = 'Status option is required';
    }
    if (!paymentType) {
      errors.captureOption = 'Payment Type option is required';
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
      customerEmail,
      address,
      paymentType,
      advancePayment,
      fullPayment,
      //totalPrice,
      balanceAmount,
      eventType: eventType === 'Others' ? eventTypeName : eventType,
      captureOption,
      invoiceNumber,
      // employeeId,
      alternateNumber,
      whatsappNumber,
      preShootEvent,
      postShootEvent,
      eventLocation,
      status,
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
        //setTotalPrice('');
        setBalanceAmount('');
        setEventType('');
        setEventTypeName('');
        setCaptureOption('');
        // setEmployeeId([]);
        setAlternateNumber('');
        setWhatsappNumber('');
        setPreShootEvent('No');
        setPostShootEvent('No');
        setEventLocation('');
        setStatus('');
      })
      .catch((error) => console.error("Error writing document: ", error));

  };

  const calculateBalanceAmount = (type, amount) => {
    let balance = 0;
    if (type === 'noPaid') {
      balance = parseFloat(amount);
    } else if (type === 'advancePayment') {
      balance = parseFloat(totalPrice) - parseFloat(amount);
    } else if (type === 'fullPayment') {
      balance = parseFloat(amount);
    }
    setBalanceAmount(balance.toFixed(2));
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

        {/* Implement a Picker component to allow the user to select the capture option */}
        <Text style={styles.inputTitle}>Capture<Text style={{ color: 'red' }}>*</Text></Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={captureOption}
            onValueChange={(value) => setCaptureOption(value)}
            style={styles.input}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Photography" value="Photography" />
            <Picker.Item label="Videography" value="Videography" />
            <Picker.Item label="Both" value="Both" />
          </Picker>
          {errorMessages.employeeId && (
            <Text style={styles.errorMessage}>{errorMessages.captureOption}</Text>
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

        {/* <Text style={styles.inputTitle}>Employee ID
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
            
          </Picker>
          {errorMessages.employeeId && (
            <Text style={styles.errorMessage}>{errorMessages.employeeId}</Text>
          )}
        </View> */}

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
        {/* <Text style={styles.inputTitle}>
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
            <Text style={styles.inputTitle}>Full Payment</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Amount"
                keyboardType="numeric"
                style={styles.input}
                value={fullPayment}
                onChangeText={setFullPayment}
              />
            </View>
          </>
        )} */}

        {/* <Text style={styles.inputTitle}>
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
          {errorMessages.totalPrice && (
            <Text style={styles.errorMessage}>{errorMessages.balanceAmount}</Text>
          )}
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

export default UserAddBookings;
