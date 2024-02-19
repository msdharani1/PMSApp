import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

const AddFrame = () => {
  const navigation = useNavigation();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [address, setAddress] = useState('');
  const [orderID, setOrderID] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [frameSize, setFrameSize] = useState('');
  const [frameType, setFrameType] = useState('');
  const [frameColor, setFrameColor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const handleSubmit = async () => {
    const errors = {};

    if (!customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!customerEmail) {
      errors.customerEmail = 'Customer Email is required';
    }
    if (!customerNumber) {
      errors.customerNumber = 'Customer Number is required';
    }
    if (!address) {
      errors.address = 'Address is required';
    }
    if (!orderID) {
      errors.orderID = 'Order ID is required';
    }
    if (!orderDate) {
      errors.orderDate = 'Order Date is required';
    }
    if (!frameSize) {
      errors.frameSize = 'Frame Size is required';
    }
    if (!frameType) {
      errors.frameType = 'Frame Type is required';
    }
    if (!frameColor) {
      errors.frameColor = 'Frame Color is required';
    }
    if (!quantity) {
      errors.quantity = 'Quantity is required';
    }
    if (!totalPrice) {
      errors.totalPrice = 'Total Price is required';
    }
    if (!paymentMethod) {
      errors.paymentMethod = 'Payment Method is required';
    }
    if (!deliveryOption) {
      errors.deliveryOption = 'Delivery Option is required';
    }
    if (!shippingAddress) {
      errors.shippingAddress = 'Shipping Address is required';
    }
    if (!shippingMethod) {
      errors.shippingMethod = 'Shipping Method is required';
    }
    if (!expectedDeliveryDate) {
      errors.expectedDeliveryDate = 'Expected Delivery Date is required';
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Your database code goes here
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
        {/* Customer Details */}
        <Text style={styles.inputTitle}>Customer Name<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Enter customer name"
        />
        {/* {errorMessages.customerName && <Text style={styles.errorMessage}>{errorMessages.customerName}</Text>} */}

        {/* Customer Email */}
        <Text style={styles.inputTitle}>Customer Email<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerEmail}
          onChangeText={setCustomerEmail}
          placeholder="Enter customer email"
        />
        {/* {errorMessages.customerEmail && <Text style={styles.errorMessage}>{errorMessages.customerEmail}</Text>} */}

        {/* Customer Number */}
        <Text style={styles.inputTitle}>Customer Number<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={customerNumber}
          onChangeText={setCustomerNumber}
          placeholder="Enter customer number"
          keyboardType="numeric"
        />
        {/* {errorMessages.customerNumber && <Text style={styles.errorMessage}>{errorMessages.customerNumber}</Text>} */}

        {/* Address */}
        <Text style={styles.inputTitle}>Address<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
        {/* {errorMessages.address && <Text style={styles.errorMessage}>{errorMessages.address}</Text>} */}

        {/* Order ID */}
        <Text style={styles.inputTitle}>Order ID<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={orderID}
          onChangeText={setOrderID}
          placeholder="Enter order ID"
        />
        {/* {errorMessages.orderID && <Text style={styles.errorMessage}>{errorMessages.orderID}</Text>} */}

        {/* Order Date */}
        <Text style={styles.inputTitle}>Order Date<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={orderDate}
          onChangeText={setOrderDate}
          placeholder="Enter order date"
        />
        {/* {errorMessages.orderDate && <Text style={styles.errorMessage}>{errorMessages.orderDate}</Text>} */}

        {/* Frame Size */}
        <Text style={styles.inputTitle}>Frame Size<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={frameSize}
          onChangeText={setFrameSize}
          placeholder="Enter frame size"
        />
        {/* {errorMessages.frameSize && <Text style={styles.errorMessage}>{errorMessages.frameSize}</Text>} */}

        {/* Frame Type */}
        <Text style={styles.inputTitle}>Frame Type<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={frameType}
          onChangeText={setFrameType}
          placeholder="Enter frame type"
        />
        {/* {errorMessages.frameType && <Text style={styles.errorMessage}>{errorMessages.frameType}</Text>} */}

        {/* Frame Color */}
        <Text style={styles.inputTitle}>Frame Color<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={frameColor}
          onChangeText={setFrameColor}
          placeholder="Enter frame color"
        />
        {/* {errorMessages.frameColor && <Text style={styles.errorMessage}>{errorMessages.frameColor}</Text>} */}

        {/* Quantity */}
        <Text style={styles.inputTitle}>Quantity<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
        {/* {errorMessages.quantity && <Text style={styles.errorMessage}>{errorMessages.quantity}</Text>} */}

        {/* Total Price */}
        <Text style={styles.inputTitle}>Total Price<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={totalPrice}
          onChangeText={setTotalPrice}
          placeholder="Enter total price"
          keyboardType="numeric"
        />
        {/* {errorMessages.totalPrice && <Text style={styles.errorMessage}>{errorMessages.totalPrice}</Text>} */}

        {/* Payment Method */}
        <Text style={styles.inputTitle}>Payment Method<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder="Enter payment method"
        />
        {/* {errorMessages.paymentMethod && <Text style={styles.errorMessage}>{errorMessages.paymentMethod}</Text>} */}

        {/* Delivery Option */}
        <Text style={styles.inputTitle}>Delivery Option<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={deliveryOption}
          onChangeText={setDeliveryOption}
          placeholder="Enter delivery option"
        />
        {/* {errorMessages.deliveryOption && <Text style={styles.errorMessage}>{errorMessages.deliveryOption}</Text>} */}

        {/* Special Instructions */}
        <Text style={styles.inputTitle}>Special Instructions</Text>
        <TextInput
          style={styles.input}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Enter special instructions"
        />

        {/* Gift Message */}
        <Text style={styles.inputTitle}>Gift Message</Text>
        <TextInput
          style={styles.input}
          value={giftMessage}
          onChangeText={setGiftMessage}
          placeholder="Enter gift message"
        />

        {/* Shipping Address */}
        <Text style={styles.inputTitle}>Shipping Address<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Enter shipping address"
        />
        {/* {errorMessages.shippingAddress && <Text style={styles.errorMessage}>{errorMessages.shippingAddress}</Text>} */}

        {/* Shipping Method */}
        <Text style={styles.inputTitle}>Shipping Method<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={shippingMethod}
          onChangeText={setShippingMethod}
          placeholder="Enter shipping method"
        />
        {/* {errorMessages.shippingMethod && <Text style={styles.errorMessage}>{errorMessages.shippingMethod}</Text>} */}

        {/* Expected Delivery Date */}
        <Text style={styles.inputTitle}>Expected Delivery Date<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={expectedDeliveryDate}
          onChangeText={setExpectedDeliveryDate}
          placeholder="Enter expected delivery date"
        />
        {/* {errorMessages.expectedDeliveryDate && <Text style={styles.errorMessage}>{errorMessages.expectedDeliveryDate}</Text>} */}

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
});

export default AddFrame;
