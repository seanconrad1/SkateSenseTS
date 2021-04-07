import React, { useState, useContext, useCallback, useEffect } from "react";
import { View, KeyboardAvoidingView, Text, Alert, Platform,  } from "react-native";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import AsyncStorage from "@react-native-community/async-storage";
//Context
import { MainContext } from '../store';

import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useMutation } from "@apollo/react-hooks";
import LOGIN_MUTATION from "../graphql/mutations/loginMutation";
import styles from "../styles";

const FONT_SIZE_BIG = hp("8");
const FONT_SIZE_SMALL = hp("6");

interface Iresponse {
  data: {
    login: {
      token: string;
      email: string;
      user_id: string;
      name: string;
    };
  };
}

const Login = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState(
    __DEV__ ? "seanconrad123@gmail.com" : ""
  );
  const [password, setPassword] = useState(__DEV__ ? "skateaz" : "");
  const [disableButton, setDisableButton] = useState(false);
  const [errors, setErrors] = useState("");
  const { state, dispatch } = useContext(MainContext);
  const [login] = useMutation(LOGIN_MUTATION);

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
    let response: Iresponse;
    setDisableButton(true);
    try {
      response = await login({ variables: { email: emailAddress, password } });
      setDisableButton(false);
      setErrors("");
    } catch (e) {
      setDisableButton(false);
      setErrors(e.networkError.result.errors[0].message);
    }

    console.log(response!.data.login)

    const { token, email, user_id, name } = response!.data.login;


    if (token) {
      try {
        await AsyncStorage.setItem("AUTH_TOKEN", token);
        await AsyncStorage.setItem("EMAIL", email);
        await AsyncStorage.setItem("USER_ID", user_id);
        await AsyncStorage.setItem("NAME", name);

        dispatch({
          type: "SET_USER",
          payload: { token, user_id },
        });
        setDisableButton(false);
      } catch (e) {
        setDisableButton(false);
      }
    }

    setDisableButton(false);
  }, [dispatch, emailAddress, login, password]);

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
        placeholderTextColor={"grey"}
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
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
        placeholderTextColor={"grey"}
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
        onPress={() => navigation.navigate("SignUp")}
      />
    </KeyboardAvoidingView>
  );
};

export default Login;
