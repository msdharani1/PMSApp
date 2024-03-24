import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { firebaseConfig } from './firebaseConfig';

const AddPackages = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();
  const packagesRef = db.ref('packages');

  const handleSubmit = () => {
    // Check if any input field is empty
    if (!title.trim() || !details.trim() || !price.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Push new package data to Firebase
    packagesRef.push({
      title: title,
      details: details,
      price: price,
    });

    // Clear input fields after submission
    setTitle('');
    setDetails('');
    setPrice('');

    // Show success message
    Alert.alert('Success', 'Package added successfully');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Package</Text>
      <TextInput
        style={styles.input}
        placeholder="Package Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Package Details"
        value={details}
        onChangeText={setDetails}
      />
      <TextInput
        style={styles.input}
        placeholder="Package Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3d218b',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPackages;
