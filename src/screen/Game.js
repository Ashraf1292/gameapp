import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const YourComponent = () => {
    const [imageData, setImageData] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    

    const handleCapturePhoto = () => {
        launchCamera({}, async (response) => {
            if (!response.didCancel && response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                try {
                    const imageBase64 = await convertImageToBase64(imageUri);
                    setImageData(imageBase64);
                } catch (error) {
                    console.log('Error reading image file:', error);
                }
            } else {
                console.log('Image capture cancelled or invalid response:', response);
            }
        });
    };

    const convertImageToBase64 = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsDataURL(blob);
        });
    };

    const predictImage = () => {
        if (!imageData) {
            console.log('Please capture an image first');
            return;
        }

        axios({
            method: 'POST',
            url: 'https://detect.roboflow.com/farcry6-videogame/1',
            params: {
                api_key: '3MBlWAWyM2XjB3bWEYhL'
            },
            data: imageData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(function(response) {
            console.log('Prediction Response:', response.data);
            if (response.data && response.data.predictions && response.data.predictions.length > 0) {
                const predictedClass = response.data.predictions[0].class; // Assuming the first prediction is the most confident
                setPredictionResult(predictedClass);
            } else {
                console.log('No predictions found');
                setPredictionResult(null);
            }
        })
        .catch(function(error) {
            console.log('Error:', error.message);
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={handleCapturePhoto}>
                <Text style={styles.buttonText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={predictImage}>
                <Text style={styles.buttonText}>Predict Image</Text>
            </TouchableOpacity>
            {imageData && (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${imageData}` }}
                    style={{ width: 200, height: 200, marginTop: 20 }}
                />
            )}
            {predictionResult && (
                <View>
                    <Text>Predicted Class:</Text>
                    <Text style={{ justifyContent:'center'}}>{predictionResult}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red',
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default YourComponent;
