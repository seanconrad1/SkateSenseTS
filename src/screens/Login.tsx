import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Text } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-community/async-storage';
//Context
import { MainContext } from '../store';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../styles';
import { loginUser } from '../api/api';
import jwt_decode from 'jwt-decode';

interface Decoded {
  user_id: string;
  email: string;
  admin: boolean;
  name: string;
  iat: number;
  exp: number;
}

const Login = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState(
    __DEV__ ? 'seanconrad123@gmail.com' : ''
  );
  const [password, setPassword] = useState(__DEV__ ? 'skateaz' : '');
  const [disableButton, setDisableButton] = useState(false);
  const [errors, setErrors] = useState('');
  const { state, dispatch } = useContext(MainContext);

  useEffect(() => {
    // // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     console.log('got here');
    //     setNotification(notification);
    //   }
    // );
    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener);
    //   Notifications.removeNotificationSubscription(responseListener);
    // };
  }, []);

  const onSubmit = useCallback(async () => {
    setDisableButton(true);
    try {
      const response = await loginUser(emailAddress, password);

      console.log('what is my response to logging in ', response);

      if (response.error) {
        setDisableButton(false);
        console.log(response.error.message);
        setErrors(response.error.message);
      }

      if (response.token) {
        setDisableButton(false);
        setErrors('');
        const decoded: Decoded = jwt_decode(response.token);

        try {
          await AsyncStorage.setItem('AUTH_TOKEN', response.token);
          await AsyncStorage.setItem('EMAIL', decoded.email);
          await AsyncStorage.setItem('USER_ID', decoded.user_id);
          await AsyncStorage.setItem('NAME', decoded.name);

          dispatch({
            type: 'SET_USER',
            payload: { token: response.token, user_id: decoded.user_id },
          });
          setDisableButton(false);
        } catch (e) {
          console.log('what is error', e);
          setDisableButton(false);
        }
      }
    } catch (e) {
      setDisableButton(false);
      console.log('what is error', e);
    }

    setDisableButton(false);
  }, [dispatch, emailAddress, password]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        {/*eslint-disable-next-line react-native/no-raw-text*/}
        <Text style={styles.header}>SkateSense</Text>
      </View>

      {errors.length > 0 && (
        <View>
          <Text style={styles.errors}>{errors}</Text>
        </View>
      )}

      <Input
        leftIconContainerStyle={styles.iconPadding}
        placeholderTextColor={'grey'}
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
        value={emailAddress}
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        onChangeText={(e: string) => setEmailAddress(e)}
        containerStyle={styles.inputContainerStyle}
      />

      <Input
        leftIconContainerStyle={styles.iconPadding}
        returnKeyType="go"
        placeholderTextColor={'grey'}
        onSubmitEditing={onSubmit}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={(pass: string) => setPassword(pass)}
        containerStyle={styles.inputContainerStyle}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Submit"
        buttonStyle={styles.submitButton}
        onPress={onSubmit}
        disabled={disableButton}
        loading={disableButton}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Sign Up"
        buttonStyle={styles.signupButton}
        onPress={() => navigation.navigate('SignUp')}
      />
    </KeyboardAvoidingView>
  );
};

export default Login;
