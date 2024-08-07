/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { name as appName } from './app.json';
import client from './ApolloClient'; // Import the Apollo Client instance

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => Main);
