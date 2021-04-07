import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Image, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map/Map';
import SideDrawer from './components/SideDrawer';
import SpotBook from './screens/SpotBook/SpotBook';
import NewSpotPage from './screens/NewSpotPage/NewSpotPage';
import LocationSelectorMap from './screens/NewSpotPage/components/LocationSelectorMap';
import Approvals from './screens/Approvals';
import ApprovalSpotPage from './screens/ApprovalSpotPage';
import SpotPage from './screens/SpotPage';
import Administration from './screens/Administration';
import UserSpots from './screens/UserSpots';
import test from './screens/test';

import { MainContext, SET_USER } from './store';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MapStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const AdminStack = createNativeStackNavigator();
const ApprovalStack = createNativeStackNavigator();

const userToken = false;

function CustomDrawerContent(props) {
  return <SideDrawer {...props} />;
}

const MapStackComponent = () => (
  <MapStack.Navigator
    screenOptions={{
      headerShown: false,
      drawerLockMode: 'locked-closed',
    }}
  >
    <MapStack.Screen name="Map" component={Map} />
    <MapStack.Screen
      options={{
        headerShown: true,
        headerTitleStyle: {
          color: 'black',
          fontSize: 20,
          // fontFamily: 'Lobster',
        },
      }}
      name="New Spot Page"
      component={NewSpotPage}
    />
    <MapStack.Screen
      name="LocationSelectorMap"
      component={LocationSelectorMap}
    />
    <MapStack.Screen name="Spot Page" component={SpotPage} />
  </MapStack.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

const AdministrationStack = () => (
  <AdminStack.Navigator
    screenOptions={{
      headerShown: true,
      // headerStyle: {},
      headerTitleStyle: {
        color: 'black',
        fontSize: 25,
        // fontFamily: 'Lobster',
      },
      // headerTitle: (props) => <LogoTitle {...props} />,
      headerLeft: () => (
        <TouchableOpacity onPress={() => console.log('test')}>
          <Icon name="sc-telegram" type="evilicon" color="black" />
        </TouchableOpacity>
      ),
    }}
  >
    <AdminStack.Screen name="Administration" component={Administration} />
    <AdminStack.Screen name="User Spots" component={UserSpots} />
  </AdminStack.Navigator>
);

const ApprovalNavStack = () => (
  <ApprovalStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitleStyle: {
        color: 'black',
        fontSize: 20,
        // fontFamily: 'Lobster',
      },
    }}
  >
    <Drawer.Screen name="Approvals" component={Approvals} />
    <Drawer.Screen name="ApprovalSpotPage" component={ApprovalSpotPage} />
  </ApprovalStack.Navigator>
);

const NavDrawer = ({ navigation, route }) => {
  console.log();
  // console.log(route);
  const getOptions = () => {
    if (getFocusedRouteNameFromRoute(route) === 'My Spots') {
      return {
        headerShown: true,
        headerTitle: getFocusedRouteNameFromRoute(route),
        headerTitleStyle: {
          color: 'black',
          fontSize: 20,
        },
      };
    } else {
      return {
        headerShown: false,
      };
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions(getOptions());
  }, [navigation, route]);

  return (
    <Drawer.Navigator
      headerMode={null}
      initialRouteName="Map"
      drawerContent={(drawerProps) => CustomDrawerContent(drawerProps)}
    >
      <Drawer.Screen name="Map" component={MapStackComponent} />
      <Drawer.Screen name="My Spots" component={SpotBook} />
      <Drawer.Screen name="Approvals" component={ApprovalNavStack} />
      <Drawer.Screen name="Administration" component={AdministrationStack} />
    </Drawer.Navigator>
  );
};

const RootStackScreen = ({ getAuthToken }) => {
  const { state, dispatch } = useContext(MainContext);

  let jwt;
  (async () => {
    jwt = await getAuthToken();
  })().catch((err) => {
    console.error(err);
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('AUTH_TOKEN');
        const user_id = await AsyncStorage.getItem('USER_ID');

        if (token != null) {
          dispatch({ type: SET_USER, payload: { token, user_id } });
        }
      } catch (e) {
        console.error(`userTokenFetchErr: ${e}`);
      }
    };

    bootstrapAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {state.token ? (
          <RootStack.Screen name="App" component={NavDrawer} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreen;
