import React, { useState, useEffect, useContext } from 'react';
import { View, KeyboardAvoidingView, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CREATE_USER from '../graphql/mutations/newUserMutation';
import { useMutation } from '@apollo/react-hooks';
import { store } from '../store';
import styles from '../styles';

const SignUp = (props) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const globalState = useContext(store);
  const [disableButton, setDisableButton] = useState(false);
  const { dispatch } = globalState;
  // const [errors, setErrors] = useState("");

  interface Idata {
    data: {
      createUser: {
        name: string;
        email: string;
        user_id: string;
        token: string;
      };
    };
  }

  const [
    createUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_USER);

  const onSubmit = async () => {
    let data: Idata;
    const obj = {
      userInput: {
        email,
        name,
        password,
      },
    };

    try {
      data = await createUser({ variables: obj });
      setDisableButton(false);
      setError('');
    } catch (e) {
      setError(e.networkError.result.errors[0].message);
    }

    dispatch({
      type: "SET_USER",
      payload: {
        user_id: data!.data.createUser.user_id,
        token: data!.data.createUser.token,
      },
    });

    try {
      await AsyncStorage.setItem("AUTH_TOKEN", data!.data.createUser.token);
    } catch (e) {
      return e;
    }
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    if (!error) {
      props.navigation.navigate("NavDrawer", { screen: "Map" });
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
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Submit"
        buttonStyle={styles.signupSubmit}
        onPress={() => onSubmit()}
        disabled={mutationLoading}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
