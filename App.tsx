import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import unfetch from 'unfetch';
import { enableScreens } from 'react-native-screens';
import * as TaskManager from 'expo-task-manager';
import { useFonts } from 'expo-font';
import { StateProvider } from './src/store';
import RootStackScreen from './src/navigation';

enableScreens();

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: __DEV__
    ? 'http://localhost:4000/graphql'
    : 'https://sean.software/skatesense/api/',
  fetch: unfetch,
});

const getAuthToken = async () => {
  try {
    const value = await AsyncStorage.getItem('AUTH_TOKEN');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return error;
  }
};

// middleware for requests
const authLink = setContext(async (req, previousContext) => {
  // get the authentication token from local storage if it exists
  const jwt = await getAuthToken();
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
  }
  return previousContext;
});

const errorLink = onError(async ({ graphQLErrors, networkError }) => {
  let shouldLogout = false;
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message === 'Unauthorized') {
        shouldLogout = true;
      }
    });

    if (shouldLogout) {
      try {
        await AsyncStorage.setItem('AUTH_TOKEN', '');
      } catch (e) {
        return e;
      }
    }
  }
  if (networkError) {
    if (networkError.statusCode === 401) {
      try {
        await AsyncStorage.setItem('AUTH_TOKEN', '');
      } catch (e) {
        return e;
      }
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  errorLink,
});

const App = () => {
  const [loaded] = useFonts({
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
    ProximaNova: require('./assets/fonts/ProximaNova-Regular.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <StateProvider>
        <RootStackScreen getAuthToken={getAuthToken} />
      </StateProvider>
    </ApolloProvider>
  );
};
export default App;
