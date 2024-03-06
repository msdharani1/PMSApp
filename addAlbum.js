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


const AddAlbum = () => {
  const navigation = useNavigation();
  const [customerName, setCustomerName] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderID, setOrderID] = useState('');
  const [albumSize, setAlbumSize] = useState('');
  const [photosDetails, setPhotosDetails] = useState('');
  const [albumType, setAlbumType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Process'); 
  const [totalPrice, setTotalPrice] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [isExpectedDatePickerVisible, setExpectedDatePickerVisibility] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    customerName: '',
    customerEmail: '',
    customerNumber: '',
    address: '',
    orderID: '',
    orderDate: '',
    photosDetails: '',
    albumSize: '',
    albumType: '',
    quantity: '', 
    totalPrice: '',
    paymentMethod: '',
    deliveryOption: '',
    shippingAddress: '',
    shippingMethod: '',
    expectedDeliveryDate: '',
    status: '',
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
    if (!photosDetails) errors.photosDetails = 'Photos Details is required';
    if (!albumSize) errors.albumSize = 'Album Size is required';
    if (!albumType) errors.albumType = 'Album Type is required';
    if (!quantity) errors.quantity = 'Quantity is required';
    if (!totalPrice) errors.totalPrice = 'Total Price is required';
    if (!paymentMethod) errors.paymentMethod = 'Payment Method is required';
    if (!deliveryOption) errors.deliveryOption = 'Delivery Option is required';
    if (!status) {
      errors.captureOption = 'Status option is required';
    }
    if (!shippingAddress && deliveryOption === 'Courier') errors.shippingAddress = 'Shipping Address is required';
    if (!expectedDeliveryDate && deliveryOption === 'Courier') errors.expectedDeliveryDate = 'Expected Delivery Date is required';

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      // Initialize Firebase app
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getDatabase(firebaseApp);
      const framesRef = ref(db, 'albums');

      // Push new frame data to Firebase
      const newFrameRef = push(framesRef);
      await set(newFrameRef, {
        customerName,
        customerEmail,
        customerNumber,
        address,
        orderID,
        orderDate: selectedDate,
        photosDetails,
        albumSize,
        albumType,
        quantity,
        totalPrice,
        paymentMethod,
        deliveryOption,
        shippingAddress,
        expectedDeliveryDate,
        status,
      });

      // Reset form fields after successful submission
      setCustomerName('');
      setCustomerEmail('');
      setCustomerNumber('');
      setAddress('');
      setSelectedDate(null);
      setPhotosDetails('');
      setAlbumSize('');
      setAlbumType('');
      setQuantity('');
      setTotalPrice('');
      setPaymentMethod('');
      setDeliveryOption('');
      setShippingAddress('');
      setExpectedDeliveryDate('');
      generateOrderID(); // Generate new Order ID
      setStatus('');

      console.log('Album data added successfully!');
    } catch (error) {
      console.error('Error adding Album data:', error);
    }
  };

  // Function to calculate total price based on Album Size and type
  const calculateTotalPrice = () => {
    let price = 0;
    if (albumSize === '12x12') {
      if (albumType === 'Standard') {
        price = 3500;
      } else if (albumType === 'Square') {
        price = 2900;
      } else if (albumType === 'Mini') {
        price = 1500;
      } else if (albumType === 'Panoramic') {
        price = 4500;
      }
    } else if (albumSize === '10x10') {
      if (albumType === 'Standard') {
        price = 3500;
      } else if (albumType === 'Square') {
        price = 2900;
      } else if (albumType === 'Mini') {
        price = 1500;
      } else if (albumType === 'Panoramic') {
        price = 4500;
      }
    } else if (albumSize === '8x8') {
      if (albumType === 'Standard') {
        price = 3500;
      } else if (albumType === 'Square') {
        price = 2900;
      } else if (albumType === 'Mini') {
        price = 1500;
      } else if (albumType === 'Panoramic') {
        price = 4500;
      }
    } else if (albumSize === '12x18') {
      if (albumType === 'Standard') {
        price = 3500;
      } else if (albumType === 'Square') {
        price = 2900;
      } else if (albumType === 'Mini') {
        price = 1500;
      } else if (albumType === 'Panoramic') {
        price = 4500;
      }
    }
    return price;
  };

  // Call calculateTotalPrice whenever Album Size or type changes
  useEffect(() => {
    const price = calculateTotalPrice();
    const totalPrice = price * parseInt(quantity || 0);
    setTotalPrice(totalPrice.toString());
  }, [albumSize, albumType, quantity]);

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


      {/* Photos Details */}
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

        {/* Album Size */}
        <Text style={styles.inputTitle}>Album Size<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={albumSize}
          onValueChange={(itemValue) => {
            setAlbumSize(itemValue);
            // Set album type and price based on album size
            switch (itemValue) {
              case '12x12':
                setAlbumType('Standard');
                setTotalPrice('3500');
                break;
              case '10x10':
                setAlbumType('Square');
                setTotalPrice('2900');
                break;
              case '8x8':
                setAlbumType('Mini');
                setTotalPrice('1500');
                break;
              case '12x18':
                setAlbumType('Panoramic');
                setTotalPrice('4500');
                break;
              default:
                break;
            }
          }}
          style={styles.input}
        >
          <Picker.Item label="Select Album Size" value="" />
          <Picker.Item label="12x12" value="12x12" />
          <Picker.Item label="10x10" value="10x10" />
          <Picker.Item label="8x8" value="8x8" />
          <Picker.Item label="12x18" value="12x18" />
        </Picker>
        {errorMessages.albumSize && <Text style={styles.errorMessage}>{errorMessages.albumSize}</Text>}

        {/* Album Type */}
        <Text style={styles.inputTitle}>Album Type<Text style={{ color: 'red' }}>*</Text></Text>
        <Picker
          selectedValue={albumType}
          onValueChange={(itemValue) => setAlbumType(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Album Type" value="" />
          <Picker.Item label="Standard" value="Standard" />
          <Picker.Item label="Square" value="Square" />
          <Picker.Item label="Mini" value="Mini" />
          <Picker.Item label="Panoramic" value="Panoramic" />
        </Picker>
        {errorMessages.albumType && <Text style={styles.errorMessage}>{errorMessages.albumType}</Text>}

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

        {/* Add the Status input field */}
      <Text style={styles.inputTitle}>Status</Text>
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
      </View>

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

export default AddAlbum;
