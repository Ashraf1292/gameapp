import React, { useState } from 'react';
import { View, Text, Linking, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import YoutubePlayer from 'react-native-youtube-iframe';

const INITIAL_REGION = {
  latitude: 22.330370,
  longitude: 91.832626,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const AboutText = styled.Text`
  font-size: 14px;
  margin-bottom: 10px;
`;

const Link = styled.Text`
  color: blue;
  text-decoration: underline;
`;

const Header = styled.Text`
  font-size: 16px;
  font-weight:bold;
`;

const BoldText = styled.Text`
  font-size: 13px;
  font-weight:bold;
  color:black;
`;

const AboutPage = () => {
  const [playing, setPlaying] = useState(false);


  return (
    <ScrollView>
      <Container>
        <Title>About Our App</Title>
        <AboutText>
          Welcome to GameSPY! Here, you can post about your favorite games, explore a list of video games, view developers' maps, browse YouTube for game trailers and gameplay videos, and even rate our app.
        </AboutText>
        <AboutText>
          This app was created by <BoldText>20701045</BoldText> with the aim of providing a platform for gamers to connect, share their experiences, and discover new games.
        </AboutText>
        <AboutText>
          If you have any feedback, suggestions, or issues, please feel free to contact us. We'd love to hear from you!
        </AboutText>
        <AboutText>
          Thank you for using the app and being a part of our gaming community.
        </AboutText>
        <Header>Developer's HQ :</Header>
        <MapView style={{ height: 200, width: '101%', marginTop: 10, marginBottom:50}} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_REGION} />
        <Header>Developer's Favourite Game :</Header>
        <View style={{ marginTop: 10, width: '101%' }}>
          <YoutubePlayer
            height={200}
            play={playing}
            videoId={"o1igaMv46SY"}
            onChangeState={(state) => console.log(state)}
          />
        </View>
        <View style={{ height: 100 }} />
      </Container>
    </ScrollView>
  );
};

export default AboutPage;
