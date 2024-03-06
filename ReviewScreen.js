import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { firebaseConfig } from './firebaseConfig';
 
const ReviewScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Get database reference
    const db = firebase.database();
    // Get reference to 'photoshoot_reviews' node
    const reviewsRef = db.ref('photoshoot_reviews');

    // Fetch reviews from Firebase
    const fetchData = async () => {
      try {
        const reviewsSnapshot = await reviewsRef.once('value');
        const reviewsData = reviewsSnapshot.val();
        if (reviewsData) {
          const reviewsArray = Object.values(reviewsData); // Convert object to array
          setReviews(reviewsArray);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();

    // Unsubscribe from Firebase listener when component unmounts
    return () => {
      reviewsRef.off();
    };
  }, []);

  const handleMenuPress = () => {
    if (navigation && navigation.openDrawer) {
      navigation.openDrawer();
    } else {
      console.warn('Navigation or openDrawer function is undefined');
    }
  };

  // Render each review item
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItemContainer}>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewTitle}>Name</Text>
        <Text style={styles.reviewContent}>{item.name}</Text>
      </View>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewTitle}>Email</Text>
        <Text style={styles.reviewContent}>{item.email}</Text>
      </View>
      <View style={styles.reviewItem}>
        <Text style={styles.reviewTitle}>Review</Text>
        <Text style={styles.reviewContent}>{item.review}</Text>
      </View>
    </View>
  );

  // Filter reviews based on search input (name or email)
  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(search.toLowerCase()) ||
    review.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Menu Option */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email..."
        onChangeText={setSearch}
        value={search}
      />
      
      {/* Display filtered reviews */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      
      {/* Bottom Navigation/Menu Option */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.iconText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconContainer, styles.reviewIconContainer]} onPress={() => navigation.navigate('Review')}>
          <Ionicons name="star" size={24} color="black" />
          <Text style={[styles.iconText, styles.reviewText ]}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Booking')}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.iconText}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Customer')}>
          <Ionicons name="people" size={24} color="black" />
          <Text style={styles.iconText}>Customer</Text>
        </TouchableOpacity>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EAF2',
    paddingTop: 60,
    paddingBottom: 0,
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  reviewItemContainer: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reviewItem: {
    marginBottom: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  reviewContent: {
    fontSize: 14,
    color: 'black',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
  },
  reviewIconContainer: {
    backgroundColor: '#ffdd00',
    padding: 10,
    borderRadius: 10,
  },
  reviewText: {
    color: '#000',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  flatListContent: {
    paddingBottom: 110, // Adjust based on your bottom navigation height
  },
});

export default ReviewScreen;
