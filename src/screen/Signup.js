import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker'; 
import { useQuery, gql } from '@apollo/client';

const COUNTRY_QUERY = gql`
    query CountryQuery{
        countries{
            name
        }
    }

`

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [date, setDate] = useState(new Date()); 
    const [open, setOpen] = useState(false); 

    useEffect(() => {
        
        const checkUsernameAvailability = async (username) => {
            try {
                const usernameSnapshot = await firestore()
                    .collection('users')
                    .where('username', '==', username)
                    .get();

                if (!usernameSnapshot.empty) {
                    setUsernameError('Username already in use');
                } else {
                    setUsernameError('');
                }
            } catch (error) {
                console.error('Error checking username availability:', error);
            }
        };

        
        if (username) {
            checkUsernameAvailability(username);
        }
    }, [username]);

    const handleSignup = () => {
        if (email && password && username && date && phone && !usernameError && !phoneError) {
            
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const uid = user.uid;
    
                    storeUserDataInFirestore(uid, email, username, date, phone); 

                    
                    user.sendEmailVerification().then(() => {
                        Alert.alert('Verification email sent', 'Please verify your email before continuing.');
                    }).catch((error) => {
                        console.error('Error sending verification email:', error);
                    });

                    
                    navigation.navigate('EmailVerificationScreen');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert('Error', 'That email address is already in use!');
                    } else if (error.code === 'auth/invalid-email') {
                        Alert.alert('Error', 'That email address is invalid!');
                    } else {
                        Alert.alert('Error', 'Error creating account. Please try again later.');
                    }
                    console.error(error);
                });
        } else {
            Alert.alert('Error', 'Please enter email, password, a valid username, phone number, and select date of birth.');
        }
    };
    
    const storeUserDataInFirestore = (uid, email, username, date, phone) => {
        firestore()
            .collection('users')
            .doc(uid)
            .set({
                email: email,
                username: username,
                dateOfBirth: date,
                phone: phone,
            })
            .then(() => {
                console.log('User data stored in Firestore');
            })
            .catch(error => {
                console.error('Error storing user data: ', error);
            });
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (phoneNumber.length !== 11) {
            setPhoneError('Phone number must be 11 digits');
            return false;
        } else {
            setPhoneError('');
            return true;
        }
    };

    return (
        <ImageBackground
            source={require('../gamepad.jpg')}
            style={styles.container}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        autoCapitalize="none"
                    />
                    {usernameError ? (
                        <Text style={styles.errorText}>{usernameError}</Text>
                    ) : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text);
                            validatePhoneNumber(text);
                        }}
                        keyboardType="phone-pad"
                        maxLength={11}
                    />
                    {phoneError ? (
                        <Text style={styles.errorText}>{phoneError}</Text>
                    ) : null}
                    <TouchableOpacity style={styles.signupButton} onPress={() => setOpen(true)}>
                        <Text style={styles.buttonText}>Select Date of Birth</Text>
                    </TouchableOpacity>
           
                    <DatePicker
                         mode="date" 
                         modal
                         open={open}
                         date={date}
                         onConfirm={(selectedDate) => {
                         setOpen(false);
                         setDate(selectedDate);
                         }}
                         onCancel={() => setOpen(false)}
                    />
                </View>
                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signUpText}>
                        Already have an account? <Text style={styles.signUpLink}>Click here to login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 30,
        color: '#fff',
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    signupButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#000',
        justifyContent:'center',
        alignItems:'center',
    },
    signUpText: {
        marginTop: 20,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    signUpLink: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'white',
        fontSize: 14,
    },
});

export default Signup;
