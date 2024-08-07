import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet, Dimensions, Image } from 'react-native';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from 'react-native-heroicons/solid';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [userProfilePic, setUserProfilePic] = useState('');
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');

    const goToPostDetail = (postId, postContent) => {
        navigation.navigate('Post', { postId, postContent }); // Navigate to the post detail screen
    };
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth().currentUser;
            if (user) {
                setUserName(user.displayName || '');

                const userData = await firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get();
                const userDataObj = userData.data();
                if (userDataObj && userDataObj.profilePicture) {
                    setUserProfilePic(userDataObj.profilePicture);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const unsubscribe = firestore().collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const fetchedPosts = snapshot.docs.map(async doc => {
                const postData = doc.data();
                const userProfilePicUrl = await getUserProfilePicUrl(postData.userId);
                const userName = await getUserName(postData.userId);
                return {
                    id: doc.id,
                    ...postData,
                    userProfilePicUrl,
                    userName,
                };
            });
            Promise.all(fetchedPosts).then(posts => setPosts(posts));
        });

        return () => unsubscribe();
    }, []);

    const getUserProfilePicUrl = async (userId) => {
        const userData = await firestore()
            .collection('users')
            .doc(userId)
            .get();
        const userDataObj = userData.data();
        return userDataObj ? userDataObj.profilePicture : null;
    };

    const getUserName = async (userId) => {
        const userData = await firestore()
            .collection('users')
            .doc(userId)
            .get();
        const userDataObj = userData.data();
        return userDataObj ? userDataObj.username : null;
    };

    const openDrawer = () => {
        navigation.openDrawer();
    };

    const goToSearchPage = () => {
        navigation.navigate('Games');
    };

    const handleSignOut = () => {
        auth().signOut()
            .then(() => {
                console.log('User signed out!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }]
                });
            })
            .catch(error => console.error('Error signing out:', error));
    };

    const handlePost = async () => {
        if (!newPostContent.trim()) {
            Alert.alert('Error', 'Please enter something to post.');
            return;
        }

        try {
            await firestore().collection('posts').add({
                content: newPostContent,
                userId: auth().currentUser.uid,
                likes: 0,
                dislikes: 0,
                timestamp: firestore.FieldValue.serverTimestamp()
            });
            setNewPostContent('');
        } catch (error) {
            console.error('Error posting:', error);
            Alert.alert('Error', 'An error occurred while posting. Please try again later.');
        }
    };

    const handleLike = async (postId) => {
        const postRef = firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        const postData = postDoc.data();

        if (postData && postData.likedBy && postData.likedBy.includes(auth().currentUser.uid)) {
            await postRef.update({
                likes: firestore.FieldValue.increment(-1),
                likedBy: firestore.FieldValue.arrayRemove(auth().currentUser.uid)
            });
        } else {
            await postRef.update({
                likes: firestore.FieldValue.increment(1),
                likedBy: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
                dislikes: postData && postData.likedBy && postData.likedBy.includes(auth().currentUser.uid) ? firestore.FieldValue.increment(-1) : 0,
                dislikedBy: postData && postData.likedBy && postData.likedBy.includes(auth().currentUser.uid) ? firestore.FieldValue.arrayRemove(auth().currentUser.uid) : []
            });
        }
    };

    const handleDislike = async (postId) => {
        const postRef = firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        const postData = postDoc.data();

        if (postData && postData.dislikedBy && postData.dislikedBy.includes(auth().currentUser.uid)) {
            await postRef.update({
                dislikes: firestore.FieldValue.increment(-1),
                dislikedBy: firestore.FieldValue.arrayRemove(auth().currentUser.uid)
            });
        } else {
            await postRef.update({
                dislikes: firestore.FieldValue.increment(1),
                dislikedBy: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
                likes: postData && postData.dislikedBy && postData.dislikedBy.includes(auth().currentUser.uid) ? firestore.FieldValue.increment(-1) : 0,
                likedBy: postData && postData.dislikedBy && postData.dislikedBy.includes(auth().currentUser.uid) ? firestore.FieldValue.arrayRemove(auth().currentUser.uid) : []
            });
        }
    };

    const renderPostItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => goToPostDetail(item.id, item.content, item.userProfilePicUrl, item.timestamp )}>
            <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
                        {item.userProfilePicUrl && (
                            <Image source={{ uri: item.userProfilePicUrl }} style={styles.userProfilePic} />
                        )}
                        <Text style={styles.postHeaderTitle}>{item.userName}</Text>
                    </View>
                    <Text style={styles.postHeaderDate}>{item.timestamp ? new Date(item.timestamp.toDate()).toDateString() : ''}</Text>
                </View>
                <View style={styles.postContent}>
                    <Text style={styles.postText}>{item.content}</Text>
                </View>
                <View style={styles.postActions}>
                    <TouchableOpacity style={styles.postAction} onPress={() => handleLike(item.id)}>
                        <HandThumbUpIcon size={20} color="black" />
                        <Text style={styles.actionText}>{item.likes || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postAction} onPress={() => handleDislike(item.id)}>
                        <HandThumbDownIcon size={20} color="black" />
                        <Text style={styles.actionText}>{item.dislikes || 0}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>
        );
    };

    
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>GameSPY</Text>
                <TouchableOpacity onPress={goToSearchPage}>
                    <MagnifyingGlassIcon size={30} strokeWidth={2} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.postInputContainer}>
                <TextInput
                    placeholder="Write something..."
                    value={newPostContent}
                    onChangeText={setNewPostContent}
                    style={styles.postInput}
                />
                <TouchableOpacity onPress={handlePost} style={styles.postButton}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={item => item.id}
                style={styles.postList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 8,
    },
    headerText: {
        color: 'black',
        fontSize: 26,
        fontFamily: 'OCR A Extended Regular',
        paddingLeft:108,
    },
    postInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 16,
    },
    postInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    postButton: {
        backgroundColor: '#DE3F28',
        padding: 11,
        borderRadius: 10,
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
    },
    postList: {
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 16,
    },
    postContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
        padding: 15,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    postHeaderTitle: {
        fontSize:10,
        color:'black',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userProfilePic: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    postHeaderTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postHeaderDate: {
        color: '#888888',
    },
    postContent: {
        marginBottom: 10,
    },
    postText: {
        fontSize: 16,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
    },
});

export default Home;
