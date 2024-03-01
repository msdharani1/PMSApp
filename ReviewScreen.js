import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

// Import Firebase configuration
import { firebaseConfig } from './firebaseConfig';

const ReviewScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Initialize Firebase app
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    // Get database reference
    const db = firebase.getDatabase(firebaseApp);
    // Get reference to 'photoshoot_reviews' node
    const reviewsRef = firebase.ref(db, 'photoshoot_reviews');

    // Fetch reviews from Firebase
    const fetchData = async () => {
      const reviewsSnapshot = await firebase.get(reviewsRef);
      const reviewsData = firebase.val(reviewsSnapshot);
      if (reviewsData) {
        const reviewsArray = Object.keys(reviewsData).map((key) => ({
          id: key,
          ...reviewsData[key]
        }));
        setReviews(reviewsArray);
      }
    };

    fetchData();

    // Unsubscribe from Firebase listener when component unmounts
    return () => {
      firebase.off(reviewsRef);
    };
  }, []);

  const handleMenuPress = () => {
    if (navigation && navigation.openDrawer) {
      navigation.openDrawer();
    } else {
      console.warn('Navigation or openDrawer function is undefined');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.reviewText}>Review Screen</Text>
      
      <FlatList
        style={{ width: '100%' }}
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewItemText}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {item.name}</Text>
            <Text style={styles.reviewItemText}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {item.email}</Text>
            <Text style={styles.reviewItemText}><Text style={{ fontWeight: 'bold' }}>Review:</Text> {item.review}</Text>
          </View>
        )}
      />

      <View style={styles.bottomNav}>
        {/* Bottom Navigation/Menu Options */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 1,
  },
  reviewText: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reviewItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default ReviewScreen;
