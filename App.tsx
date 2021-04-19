import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

enableScreens();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  // uri: __DEV__ ? 'http://localhost:4000' : 'http://104.248.236.245:4000/',
  uri: 'http://104.248.236.245:4000/',
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
  const notificationListener = useRef();
  const [loaded] = useFonts({
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
    ProximaNova: require('./assets/fonts/ProximaNova-Regular.otf'),
  });

  const handleNotification = async (notification) => {
    console.log(notification);
  };

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // setNotification(notification);
        handleNotification(notification);
      }
    );
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <StateProvider>
          <RootStackScreen getAuthToken={getAuthToken} />
        </StateProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
};
export default App;
