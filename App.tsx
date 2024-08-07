import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation/appNavigation';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './screens/HomeScreen';
// import GameStore from './screens/gameStore';

// const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <AppNavigation />
  );
}