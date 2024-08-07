import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Post = ({ route }) => {
    const { postId, postContent } = route.params;
    const [timestamp, setTimestamp] = useState('');
    const [username, setUsername] = useState('');
    const [userProfilePicUrl, setUserProfilePicUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchPostData();
        fetchComments();
    }, []);

    const fetchPostData = async () => {
        try {
            const postSnapshot = await firestore().collection('posts').doc(postId).get();
            const postData = postSnapshot.data();
            if (postData) {
                setTimestamp(postData.timestamp.toDate().toLocaleString());
                const userId = postData.userId;
                const userSnapshot = await firestore().collection('users').doc(userId).get();
                const userData = userSnapshot.data();
                if (userData) {
                    setUsername(userData.username);
                    setUserProfilePicUrl(userData.profilePicture);
                }
            }
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsSnapshot = await firestore().collection('comments').where('postId', '==', postId).get();
            const fetchedComments = [];
            for (const commentDoc of commentsSnapshot.docs) {
                const commentData = commentDoc.data();
                const userId = commentData.userId;
                const userSnapshot = await firestore().collection('users').doc(userId).get();
                const username = userSnapshot.exists ? userSnapshot.data().username : 'Unknown User';
                const timestamp = commentData.timestamp ? commentData.timestamp.toDate().toLocaleString() : 'Unknown Timestamp';
                fetchedComments.push({
                    id: commentDoc.id,
                    username: username,
                    content: commentData.content,
                    timestamp: timestamp
                });
            }
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    
    

    const handleAddComment = async () => {
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                console.error('No user is currently authenticated.');
                return;
            }
    
            await firestore().collection('comments').add({
                postId: postId,
                userId: currentUser.uid,
                content: newComment,
                timestamp: firestore.FieldValue.serverTimestamp()
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentCard}>
                <View>
                    <Text style={styles.commentUser}>{item.username}</Text>
                    <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                    <Text style={styles.commentContent}>{item.content}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <Image source={{ uri: userProfilePicUrl }} style={styles.userImage} />
                    <View>
                        <Text style={styles.postUser}>{username}</Text>
                        <Text style={styles.postTimestamp}>{timestamp}</Text>
                    </View>
                </View>
                <Text style={styles.postContent}>{postContent}</Text>
            </View>
            <View style={styles.commentsContainer}>
                <Text style={styles.commentsTitle}>Comments</Text>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text>No comments</Text>}
                />
            </View>
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
                    <Text style={styles.commentButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    postCard: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    postUser: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postTimestamp: {
        color: '#888888',
        fontSize: 12,
    },
    postContent: {
        fontSize: 18,
    },
    commentsContainer: {
        flex: 1,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentCard: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    commentUserImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    commentContentContainer: {
        flex: 1,
    },
    commentUser: {
        fontWeight: 'bold',
        marginBottom: 5,
        color:'black',
    },
    commentTimestamp:{

        textAlign:'right',
    },
    commentContent: {
        fontSize: 15,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    commentButton: {
        backgroundColor: '#DE3F28',
        padding: 11,
        borderRadius: 10,
    },
    commentButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Post;
