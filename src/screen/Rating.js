import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StarIcon } from 'react-native-heroicons/solid'; 

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsSnapshot = await firestore()
          .collection('ratings')
          .orderBy('createdAt', 'desc')
          .limit(3)
          .get();

        const fetchedReviews = [];
        for (const doc of reviewsSnapshot.docs) {
          const reviewData = doc.data();
          const userData = await firestore().collection('users').doc(reviewData.userId).get();
          const userDataObj = userData.data();
          fetchedReviews.push({
            ...reviewData,
            userProfilePicUrl: userDataObj ? userDataObj.profilePicture : null
          });
        }
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const submitRating = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error('Error submitting rating: User not authenticated');
        return;
      }

      if (rating === 0) {
        console.error('Error submitting rating: Rating value is not set');
        return;
      }

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (!userDoc.exists) {
        console.error('Error submitting rating: User document not found');
        return;
      }

      const username = userDoc.data().username;

      const reviewQuerySnapshot = await firestore()
        .collection('ratings')
        .where('userId', '==', currentUser.uid)
        .get();

 
      const reviewDoc = reviewQuerySnapshot.docs[0];

      if (reviewDoc) {
        await firestore()
          .collection('ratings')
          .doc(reviewDoc.id)
          .update({
            rating: rating,
            reviewComment: reviewComment,
            displayName: username,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

        setReviews(prevReviews => {
          const updatedReviews = prevReviews.map(review => {
            if (review.userId === currentUser.uid) {
              return {
                ...review,
                rating: rating,
                reviewComment: reviewComment,
                displayName: username,
                createdAt: new Date().toISOString(),
              };
            }
            return review;
          });
          return updatedReviews;
        });
      } else {
        const newReviewRef = await firestore().collection('ratings').add({
          userId: currentUser.uid,
          email: currentUser.email,
          displayName: username,
          rating: rating,
          reviewComment: reviewComment,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        setReviews(prevReviews => [
          {
            userId: currentUser.uid,
            email: currentUser.email,
            displayName: username,
            rating: rating,
            reviewComment: reviewComment,
            id: newReviewRef.id,
            createdAt: new Date().toISOString(),
          },
          ...prevReviews,
        ]);
      }

      setMessage('Rating submitted successfully');

      setTimeout(() => {
        setMessage('');
      }, 3000);

      setRating(0);
      setReviewComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Rate our App</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <StarIcon
            key={value}
            name="star"
            size={30}
            color={value <= rating ? '#f9ca24' : '#dcdde1'}
            onPress={() => setRating(value)}
          />
        ))}
      </View>
      <TextInput
        placeholder="Add your review comment..."
        value={reviewComment}
        onChangeText={setReviewComment}
        style={styles.input}
      />
      <Button title="Submit Rating" onPress={submitRating} disabled={rating === 0} color={rating === 0 ? '#dcdde1' : '#e74c3c'} style={styles.submitButton} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.reviewsTitle}>Latest Reviews:</Text>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.userProfilePicContainer}>
              {item.userProfilePicUrl && (
                <Image source={{ uri: item.userProfilePicUrl }} style={styles.userProfilePic} />
              )}
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.displayName}>{item.displayName}</Text>
              <Text style={styles.reviewComment}>{item.reviewComment}</Text>
              <Text style={styles.rating}>Rating: {item.rating} Stars</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  submitButton: {
    marginBottom: 16,
    borderRadius: 20,
  },
  message: {
    color: '#2ecc71',
    fontSize: 16,
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userProfilePicContainer: {
    marginRight: 10,
  },
  userProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewContent: {
    flex: 1,
  },
  displayName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
    fontSize: 16,
  },
  reviewComment: {
    marginBottom: 5,
  },
  rating: {
    fontWeight: 'bold',
  },
});

export default Rating;
