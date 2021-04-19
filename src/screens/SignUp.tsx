import React, { useState, useEffect, useContext } from 'react';
import { View, KeyboardAvoidingView, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MainContext } from '../store';
import styles from '../styles';
import { registerForPushNotificationsAsync } from '../utils/helpers';
import { createUser } from '../api/api';
import jwt_decode from 'jwt-decode';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const globalState = useContext(MainContext);
  const [disableButton, setDisableButton] = useState(false);
  const { dispatch } = globalState;
  // const [errors, setErrors] = useState("");

  interface Decoded {
    user_id: string;
    email: string;
    admin: boolean;
    name: string;
    iat: number;
    exp: number;
    push_token: string;
  }

  const onSubmit = async () => {
    const push_token = await registerForPushNotificationsAsync();
    if (email && name && password && confirmPassword) {
      setDisableButton(true);

      const data = await createUser(email, name, password, push_token);
      if (data.error) {
        setError(data.error.message);
        setDisableButton(false);
      } else {
        setDisableButton(false);
        setError('');

        const decoded: Decoded = jwt_decode(data.token);

        console.log('data.token', data.token);
        console.log('decoded.push_token', decoded.push_token);
        console.log('decoded.email', decoded.email);
        console.log('decoded.user_id', decoded.user_id);
        console.log('decoded.name', decoded.name);

        try {
          await AsyncStorage.setItem('AUTH_TOKEN', data.token);
          await AsyncStorage.setItem('PUSH_TOKEN', push_token);
          await AsyncStorage.setItem('EMAIL', decoded.email);
          await AsyncStorage.setItem('USER_ID', decoded.user_id);
          await AsyncStorage.setItem('NAME', decoded.name);
        } catch (e) {
          console.log(e);
        }

        dispatch({
          type: 'SET_USER',
          payload: {
            user_id: decoded.user_id,
            token: data.token,
            push_token: decoded.push_token,
          },
        });
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        if (!error) {
          navigation.navigate('NavDrawer', { screen: 'Map' });
        }
      }
    }
  };

  console.log(error);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Animated.Text style={styles.header}>Signup</Animated.Text>
      </View>
      <View>
        <Text style={styles.errors}>{error}</Text>
      </View>

      <Input
        placeholder="Name"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        value={name}
        placeholderTextColor={'grey'}
        autoCapitalize="none"
        textContentType="name"
        autoCompleteType="name"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={(u) => setName(u)}
        leftIconContainerStyle={styles.iconStyle}
        style={styles.inputContainerStyle}
      />
      <Input
        placeholder="Email"
        leftIcon={<Icon name="envelope" size={22} color="black" />}
        clearButtonMode="never"
        value={email}
        placeholderTextColor={'grey'}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        onChangeText={(em) => setEmail(em)}
        leftIconContainerStyle={styles.iconStyle}
        style={styles.inputContainerStyle}
      />
      <Input
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={'grey'}
        value={password}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={(p) => setPassword(p)}
        leftIconContainerStyle={styles.iconStyle}
        style={styles.inputContainerStyle}
      />
      <Input
        placeholder="Confirm password"
        autoCapitalize="none"
        value={confirmPassword}
        placeholderTextColor={'grey'}
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={(confirm) => setConfirmPassword(confirm)}
        leftIconContainerStyle={styles.iconStyle}
        style={styles.inputContainerStyle}
      />
      <Button
        title="Submit"
        buttonStyle={styles.signupSubmit}
        onPress={() => onSubmit()}
        disabled={disableButton}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
