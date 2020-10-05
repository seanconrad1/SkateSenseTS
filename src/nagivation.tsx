import React, { useContext, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map/Map';
import SideDrawer from './components/SideDrawer';
import SpotBook from "./screens/SpotBook/SpotBook";
import NewSpotPage from "./screens/NewSpotPage/NewSpotPage";
// import LocationSelectorMap from "./screens/NewSpotPage/LocationSelectorMap";
import Approvals from "./screens/Approvals";
import { store, SET_USER } from './store';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const userToken = false;

function CustomDrawerContent(props) {
  return <SideDrawer {...props} />;
}

const NavDrawer = () => {
  return (
    <Drawer.Navigator
      headerMode={null}
      initialRouteName="Map"
      drawerContent={(drawerProps) => CustomDrawerContent(drawerProps)}
    >

      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="New Spot Page" component={NewSpotPage} />
      <Drawer.Screen name="My Spots" component={SpotBook} />
      <Drawer.Screen name="Approvals" component={Approvals} />
    </Drawer.Navigator>
  );
};

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

const RootStackScreen = ({ getAuthToken }) => {
  const { state, dispatch } = useContext(store);

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
