import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import openMap from 'react-native-open-maps';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const GamePage = () => {
  const [playing, setPlaying] = useState(false);

  const goToEAHeadquarters = () => {
    openMap({ latitude: 37.48464688523748, longitude: -122.22829062087445 }); 
    
  };

  const INITIAL_REGION = {
    latitude: 37.33,
    longitude: -122,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  return (
    <View style={styles.container}>
  
      <View>
        <YoutubePlayer
          height={200}
          play={playing}
          videoId={"o1igaMv46SY"}
          onChangeState={(state) => console.log(state)}
        />
      </View>

      
      <View style={styles.gameDetails}>
        <Text style={styles.title}>FIFA 22</Text>
        <Text style={styles.publisher}>Published by: EA Sports</Text>
        <Text style={styles.platform}>Platform: PlayStation, Xbox, PC</Text>
       
      </View>

      
      <View style={styles.buttonContainer}>
        <Button
          color={'#DE3F28'}
          onPress={goToEAHeadquarters}
          title="EA Sports Headquarters 🗺"
        />
      </View>
      <MapView style={{height: '37%', width: '100%'}} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_REGION}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  gameDetails: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  publisher: {
    fontSize: 20,
    marginBottom: 5,
    color: '#34495e',
  },
  platform: {
    fontSize: 18,
    color: '#34495e',
  },
  buttonContainer: {
    marginHorizontal: 50,
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default GamePage;
