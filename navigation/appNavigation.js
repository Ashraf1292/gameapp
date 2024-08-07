import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../src/screen/Welcome';
import Login from '../src/screen/Login';
import Signup from '../src/screen/Signup';
import Home from '../src/screen/Home';
import Games from '../src/screen/Games';
import Profile from '../src/screen/Profile';
import About from '../src/screen/AboutPage';
import Rating from '../src/screen/Rating';
import { HomeIcon, UserIcon, CogIcon, StarIcon, PuzzlePieceIcon } from 'react-native-heroicons/solid';
import { View } from 'react-native';
import Game from '../src/screen/Game';
import GamePage from '../src/screen/GamePage';
import EmailVerificationScreen from '../src/screen/EmailVerificationScreen';
import EditProfile from '../src/screen/EditProfile';
import Post from '../src/screen/Post';
import Country from '../src/screen/Country';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconComponent;

          if (route.name === 'Nexus') {
            iconComponent = focused ? <HomeIcon size={size} color={'#000'} /> : <HomeIcon size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconComponent = focused ? <UserIcon size={size} color={'#000'} /> : <UserIcon size={size} color={color} />;
          } else if (route.name === 'About') {
            iconComponent = focused ? <CogIcon size={size} color={'#000'} /> : <CogIcon size={size} color={color} />;
          } else if (route.name === 'Review') {
            iconComponent = focused ? <StarIcon size={size} color={'#000'} /> : <StarIcon size={size} color={color} />;
          } else if (route.name === 'Game') {
            iconComponent = focused ? <PuzzlePieceIcon size={size} color={'#000'} /> : <PuzzlePieceIcon size={size} color={color} />;
          }

          return <View style={{ alignItems: 'center', justifyContent: 'center' }}>{iconComponent}</View>;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black', 
        inactiveTintColor: 'gray', 
        labelStyle: { fontSize: 12 }, 
        style: { backgroundColor: 'white' }, 
      }}
    >
      <Tab.Screen name="Nexus" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Review" component={Rating} />
      <Tab.Screen name="Game" component={Game} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
        <Stack.Screen name="Login" options={{ headerShown: true }} component={Login} />
        <Stack.Screen name="Signup" options={{ headerShown: true }} component={Signup} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
        <Stack.Screen name="Games" options={{ headerShown: true }} component={Games} />
        <Stack.Screen name="GamePage" options={{ headerShown: true }} component={GamePage} />
        <Stack.Screen name="EditProfile" options={{ headerShown: true }} component={EditProfile} />
        <Stack.Screen name="EmailVerificationScreen" component={EmailVerificationScreen} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Country" component={Country} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
