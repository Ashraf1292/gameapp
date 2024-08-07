import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PencilIcon, CameraIcon } from 'react-native-heroicons/outline';
import { PowerIcon } from 'react-native-heroicons/solid';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";

const Profile = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null); 
    const [profilePic, setProfilePic] = useState('');
    const [selectedConsole, setSelectedConsole] = useState('');
    const [selectedPhone, setSelectedPhone] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth().currentUser;
            if (user) {
                setUserName(user.displayName || '');
                setUserEmail(user.email || '');
    
                const userData = await firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get();
                const userDataObj = userData.data();
                if (userDataObj) {
                    setProfilePic(userDataObj.profilePicture || '');
                    setUserName(userDataObj.username || ''); 
                    setSelectedConsole(userDataObj.console || '');
                    setSelectedPhone(userDataObj.phone || '');  
                    setCountry(userDataObj.country || ''); 
                    
                    if (userDataObj.dateOfBirth) {
                        const dob = userDataObj.dateOfBirth.toDate();
                        const formattedDOB = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
                        setDateOfBirth(formattedDOB);
                    }
                }
            }
        };
    
        fetchUserData();
    }, []);

    const goBack = () => {
        navigation.goBack();
    };

    const goToEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleChoosePhoto = () => {
        launchImageLibrary({ noData: true }, async (response) => {
            if (response && response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0]; 
    
                const user = auth().currentUser;
                if (user) {
                    const uid = user.uid;
                    const imageUri = selectedImage.uri;
    
                    const imageName = `profile_picture_${uid}`;
                    const storageRef = storage().ref(`profile_pictures/${imageName}`);
                    try {
                        await storageRef.putFile(imageUri);
                        console.log('Image uploaded to Firebase Storage');
    
                        const imageUrl = await storageRef.getDownloadURL();
    
                        await firestore()
                            .collection('users')
                            .doc(uid)
                            .update({
                                profilePicture: imageUrl,
                            });
                        console.log('Profile picture URL updated in Firestore');
                        setProfilePic(imageUrl); 
                    } catch (error) {
                        console.error('Error uploading image to Firebase Storage:', error);
                    }
                }
            } else {
                console.error('Invalid image response:', response);
            }
        });
    };
    
    const handleSignOut = () => {
        auth()
            .signOut()
            .then(() => {
                console.log('User signed out!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }]
                });
            })
            .catch(error => console.error('Error signing out:', error));
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 8 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 24, fontFamily: 'OCR A Extended Regular' }}>
                        Profile
                    </Text>
                </View>
                <TouchableOpacity onPress={goToEditProfile} style={{ position: 'absolute', right: -10, top: 8 }}>
                    <PencilIcon size={26} strokeWidth={2} color="black" />
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Image source={{ uri: profilePic }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                <Text style={{ color: 'gray', fontSize: 18, marginTop: 8, fontWeight:'bold' }}>
                    {userName} 
                </Text>
                <Text style={{ color: 'gray', fontSize: 16, marginTop: 8 }}>
                    {userEmail} 
                </Text>
                <Text style={{ color: 'gray', fontSize: 16, marginTop: 8 }}>
                    Phone Number: {selectedPhone} 
                </Text>
                {dateOfBirth && (
                    <Text style={{ color: 'gray', fontSize: 16, marginTop: 8 }}>
                        Date of Birth: {dateOfBirth.toDateString()} 
                    </Text>
                )}
                {selectedConsole && (
                    <Text style={{ color: 'gray', fontSize: 16, marginTop: 8 }}>
                        Favourite Console: {selectedConsole} 
                    </Text>
                )}
                {country && (
                    <Text style={{ color: 'gray', fontSize: 16, marginTop: 8 }}>
                        Country: {country} 
                    </Text>
                )}
            </View>
            <TouchableOpacity onPress={handleChoosePhoto} style={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: '#DE3F28', padding: 10, borderRadius: 10 }}>
                <CameraIcon size={30} strokeWidth={2} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={{ position: 'absolute', left: 16, top: 12 }}>
                <PowerIcon style={{ color: 'black'}} />
            </TouchableOpacity>
            <Text style={{ position: 'absolute', left: 16, top: 40, color: 'black', fontSize: 14 }}>Logout</Text>
        </View>
    );
};

export default Profile;
