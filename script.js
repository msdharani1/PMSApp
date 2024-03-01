// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv86Xh0m4ZPcdnT7w3_nyGO_CBFwrcRtk",
    authDomain: "pmsapp01.firebaseapp.com",
    databaseURL: "https://pmsapp01-default-rtdb.firebaseio.com",
    projectId: "pmsapp01",
    storageBucket: "pmsapp01.appspot.com",
    messagingSenderId: "929505697693",
    appId: "1:929505697693:web:bc72606fcf6470de11d974",
    measurementId: "G-WDFLZR7MQB"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Reference to the Firebase database
  const database = firebase.database();
  
  // Handle form submission
  document.getElementById('reviewForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const review = document.getElementById('review').value;
  
    // Save review data to Firebase
    database.ref('photoshoot_reviews').push({
      name: name,
      email: email,
      review: review
    })
    .then(() => {
      alert('Review submitted successfully!');
      document.getElementById('reviewForm').reset(); // Clear form fields after submission
    })
    .catch((error) => {
      console.error('Error submitting review:', error);
      alert('An error occurred. Please try again later.');
    });
  });
  