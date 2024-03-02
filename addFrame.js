import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-get-random-values';
import UUIDGenerator from 'react-native-uuid-generator';

// Inside your component...
const generateOrderID = async () => {
  const id = await UUIDGenerator.getRandomUUID();
  setOrderID(id);
};


const AddFrame = () => {
  const navigation = useNavigation();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [address, setAddress] = useState('');
  const [orderID, setOrderID] = useState('');
  const [photosDetails, setPhotosDetails] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [frameSize, setFrameSize] = useState('');
  const [frameType, setFrameType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [isExpectedDatePickerVisible, setExpectedDatePickerVisibility] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    customerName: '',
    customerEmail: '',
    customerNumber: '',
    address: '',
    photosDetails: '',
    orderID: '',
    orderDate: '',
    frameSize: '',
    frameType: '',
    quantity: '',
    totalPrice: '',
    paymentMethod: '',
    deliveryOption: '',
    specialInstructions: '',
    shippingAddress: '',
    shippingMethod: '',
    expectedDeliveryDate: '',
  });

  const handleExpectedDateConfirm = (date) => {
    setExpectedDeliveryDate(date.toDateString());
    setExpectedDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date.toDateString());
    setDatePickerVisibility(false);
  };

  const generateOrderID = () => {
    const id = uuidv4();
    setOrderID(id);
  };

  useEffect(() => {
    generateOrderID();
  }, []);

  const handleSubmit = async () => {
    const errors = {};

    // Validate form fields
    if (!customerName) errors.customerName = 'Name is required';
    if (!customerEmail) errors.customerEmail = 'Email is required';
    if (!customerNumber) errors.customerNumber = 'umber is required';
    if (!address) errors.address = 'Address is required';
    if (!selectedDate) errors.orderDate = 'Order Date is required';
    if (!frameSize) errors.frameSize = 'Frame Size is required';
    if (!photosDetails) errors.photosDetails = 'Photos Details is required';
    if (!frameType) errors.frameType = 'Frame Type is required';
    if (!quantity) errors.quantity = 'Quantity is required';
    if (!totalPrice) errors.totalPrice = 'Total Price is required';
    if (!paymentMethod) errors.paymentMethod = 'Payment Method is required';
    if (!deliveryOption) errors.deliveryOption = 'Delivery Option is required';
    if (!shippingAddress && deliveryOption === 'Courier') errors.shippingAddress = 'Shipping Address is required';
    if (!expectedDeliveryDate && deliveryOption === 'Courier') errors.expectedDeliveryDate = 'Expected Delivery Date is required';

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      // Initialize Firebase app
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getDatabase(firebaseApp);
      const framesRef = ref(db, 'frames');

      // Push new frame data to Firebase
      const newFrameRef = push(framesRef);
      await set(newFrameRef, {
        customerName,
        customerEmail,
        customerNumber,
        address,
        photosDetails,
        orderID,
        orderDate: selectedDate,
        frameSize,
        frameType,
        quantity,
        totalPrice,
        paymentMethod,
        deliveryOption,
        shippingAddress,
        expectedDeliveryDate,
      });

      // Reset form fields after successful submission
      setCustomerName('');
      setCustomerEmail('');
      setCustomerNumber('');
      setAddress('');
      setSelectedDate(null);
      setPhotosDetails('');
      setFrameSize('');
      setFrameType('');
      setQuantity('');
      setTotalPrice('');
      setPaymentMethod('');
      setDeliveryOption('');
      setShippingAddress('');
      setExpectedDeliveryDate('');
      generateOrderID(); // Generate new Order ID

      console.log('Frame data added successfully!');
    } catch (error) {
      console.error('Error adding frame data:', error);
    }
  };

  // Function to calculate total price based on frame size and type
  const calculateTotalPrice = () => {
    let price = 0;
    if (frameSize === '4x6') {
      if (frameType === 'Plastic/MDF') {
        price = 150;
      } else if (frameType === 'Wood') {
        price = 250;
      } else if (frameType === 'Metal') {
        price = 300;
      }
    } else if (frameSize === '5x7') {
      if (frameType === 'Plastic/MDF') {
        price = 200;
      } else if (frameType === 'Wood') {
        price = 300;
      } else if (frameType === 'Metal') {
        price = 400;
      }
    } else if (frameSize === '8x10') {
      if (frameType === 'Plastic/MDF') {
        price = 300;
      } else if (frameType === 'Wood') {
        price = 400;
      } else if (frameType === 'Metal') {
        price = 500;
      }
    } else if (frameSize === '11x14') {
      if (frameType === 'Plastic/MDF') {
        price = 400;
      } else if (frameType === 'Wood') {
        price = 500;
      } else if (frameType === 'Metal') {
        price = 600;
      }
    } else if (frameSize === '16x20') {
      if (frameType === 'Plastic/MDF') {
        price = 500;
      } else if (frameType === 'Wood') {
        price = 700;
      } else if (frameType === 'Metal') {
        price = 800;
      }
    } else if (frameSize === '20x30') {
      if (frameType === 'Plastic/MDF') {
        price = 700;
      } else if (frameType === 'Wood') {
        price = 1000;
      } else if (frameType === 'Metal') {
        price = 1200;
      }
    }
    return price;
  };

  // Call calculateTotalPrice whenever frame size or type changes
  useEffect(() => {
    const price = calculateTotalPrice();
    const totalPrice = price * parseInt(quantity || 0);
    setTotalPrice(totalPrice.toString());
  }, [frameSize, frameType, quantity]);

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
        {/* Customer Details */}
        <Text style={styles.inputTitle}>Name<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Enter customer name"
        />
        {errorMessages.customerName && (<Text style={styles.errorMessage}>{errorMessages.customerName}</Text>)}

        {/* Customer Email */}
        <Text style={styles.inputTitle}>Email<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerEmail}
          onChangeText={setCustomerEmail}
          placeholder="Enter customer email"
        />
        {errorMessages.customerEmail && <Text style={styles.errorMessage}>{errorMessages.customerEmail}</Text>}

        {/* Customer Number */}
        <Text style={styles.inputTitle}>Number<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerNumber}
          onChangeText={setCustomerNumber}
          placeholder="Enter customer number"
          keyboardType="numeric"
        />
        {errorMessages.customerNumber && <Text style={styles.errorMessage}>{errorMessages.customerNumber}</Text>}

        {/* Address */}
        <Text style={styles.inputTitle}>Address<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
        {errorMessages.address && <Text style={styles.errorMessage}>{errorMessages.address}</Text>}

        {/* Order ID */}
        <Text style={styles.inputTitle}>Order ID<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={orderID}
          onChangeText={setOrderID}
          placeholder="Enter order ID"
          editable={false}
        />
        {errorMessages.orderID && <Text style={styles.errorMessage}>{errorMessages.orderID}</Text>}

        <Text style={styles.inputTitle}>
          Order Date
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
      {errorMessages.orderDate && <Text style={styles.errorMessage}>{errorMessages.orderDate}</Text>}


      
        { /* Photos Details */}
        <Text style={styles.inputTitle}>Photos Details<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={photosDetails}
          onValueChange={(itemValue) => setPhotosDetails(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Photos Details" value="" />
          <Picker.Item label="Provided" value="Provided" />
          <Picker.Item label="Our Captured images" value="Our Captured images" />
        </Picker>
        {errorMessages.photosDetails && <Text style={styles.errorMessage}>{errorMessages.photosDetails}</Text>}


        {/* Frame Size */}
        <Text style={styles.inputTitle}>Frame Size<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={frameSize}
          onValueChange={(itemValue) => setFrameSize(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Frame Size" value="" />
          <Picker.Item label="4x6" value="4x6" />
          <Picker.Item label="5x7" value="5x7" />
          <Picker.Item label="8x10" value="8x10" />
          <Picker.Item label="11x14" value="11x14" />
          <Picker.Item label="16x20" value="16x20" />
          <Picker.Item label="20x30" value="20x30" />
        </Picker>
        {errorMessages.frameSize && <Text style={styles.errorMessage}>{errorMessages.frameSize}</Text>}

        {/* Frame Type */}
        <Text style={styles.inputTitle}>Frame Type<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={frameType}
          onValueChange={(itemValue) => setFrameType(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Frame Type" value="" />
          <Picker.Item label="Plastic/MDF" value="Plastic/MDF" />
          <Picker.Item label="Wood" value="Wood" />
          <Picker.Item label="Metal" value="Metal" />
        </Picker>
        {errorMessages.frameType && <Text style={styles.errorMessage}>{errorMessages.frameType}</Text>}

        {/* Quantity */}
        <Text style={styles.inputTitle}>Quantity<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
        {errorMessages.quantity && <Text style={styles.errorMessage}>{errorMessages.quantity}</Text>}

        {/* Total Price */}
        <Text style={styles.inputTitle}>Total Price<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={totalPrice}
          onChangeText={setTotalPrice}
          placeholder="Enter total price"
          keyboardType="numeric"
          editable= {false}
        />
        {errorMessages.totalPrice && <Text style={styles.errorMessage}>{errorMessages.totalPrice}</Text>}

        {/* Payment Method */}
        <Text style={styles.inputTitle}>Payment Method<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Payment Method" value="" />
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="UPI/Debit/Credit Card" value="UPI/Debit/Credit Card" />
        </Picker>
        {errorMessages.paymentMethod && <Text style={styles.errorMessage}>{errorMessages.paymentMethod}</Text>}


        {/* Delivery Option */}
        <Text style={styles.inputTitle}>Delivery Option<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={deliveryOption}
          onValueChange={(itemValue) => setDeliveryOption(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Delivery Option" value="" />
          <Picker.Item label="Studio" value="Studio" />
          <Picker.Item label="Courier" value="Courier" />
        </Picker>
        {errorMessages.deliveryOption && <Text style={styles.errorMessage}>{errorMessages.deliveryOption}</Text>}

        {/* Conditionally render Shipping Address and Expected Delivery Date */}
        {deliveryOption === 'Courier' && (
          <>
            {/* Shipping Address */}
            <Text style={styles.inputTitle}>Shipping Address<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={shippingAddress}
              onChangeText={setShippingAddress}
              placeholder="Enter shipping address"
            />
            {errorMessages.shippingAddress && <Text style={styles.errorMessage}>{errorMessages.shippingAddress}</Text>}

            {/* Expected Delivery Date */}
          <Text style={styles.inputTitle}>Expected Delivery Date<Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.input} onPress={() => setExpectedDatePickerVisibility(true)}>
              <Text>{expectedDeliveryDate || 'Select Date'}</Text>
            </TouchableOpacity>
            {errorMessages.expectedDeliveryDate && (
              <Text style={styles.errorMessage}>{errorMessages.expectedDeliveryDate}</Text>
            )}
          </View>
          <DateTimePickerModal
            isVisible={isExpectedDatePickerVisible}
            mode="date"
            onConfirm={handleExpectedDateConfirm}
            onCancel={() => setExpectedDatePickerVisibility(false)}
            minimumDate={new Date()} // Only current and future dates are selectable
          />

          </>
        )}

        {/* Submit Button */}
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

export default AddFrame;
