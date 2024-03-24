import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import auth functions

import { firebaseConfig } from './firebaseConfig';

const Packages = ({ navigation }) => {
  const [packages, setPackages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig); // Use initializeApp from firebase/app

  useEffect(() => {
    const db = getDatabase(app); // Pass app to getDatabase
    const packagesRef = ref(db, 'packages');

    // Fetch packages data from Firebase
    const fetchPackages = async () => {
      try {
        onValue(packagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const packageArray = Object.values(data);
            setPackages(packageArray);
          }
        });
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();

    // Check if the user is admin
    const auth = getAuth(app); // Pass app to getAuth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const { email } = user;
        if (email === 'admin@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePackageSelect = (packageData) => {
    navigation.navigate('PackageBooking', { packageData });
  };

  const handlePlusPress = () => {
    navigation.navigate('AddPackages');
  };

  return (
    <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
          <Ionicons name="add-circle" size={32} color="#3d218b" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Photo & Videography Packages</Text>
      {packages.map((packageData, index) => (
        <TouchableOpacity
          key={index}
          style={styles.package}
          onPress={() => handlePackageSelect(packageData)}
        >
          <Text style={styles.packageTitle}>{packageData.title}</Text>
          <Text style={styles.packageDetails}>{packageData.details}</Text>
          <Text style={styles.packagePrice}>₹{packageData.price}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    color: '#3d218b',
    textAlign: 'center',
  },
  package: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packageDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default Packages;
