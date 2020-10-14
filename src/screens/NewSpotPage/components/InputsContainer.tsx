import React from 'react';
import { Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import styles from '../styles';

const InputsContainer = ({ dispatch, state }) => (
  <View style={styles.inputsContainerStyle}>
    <Text style={styles.requiredStar}>*</Text>
    <Input
      containerStyle={{ marginTop: -10 }}
      placeholder="Spot Name"
      clearButtonMode="never"
      autoCorrect={false}
      maxLength={25}
      value={state.name}
      keyboardType="default"
      onChangeText={(name) => dispatch({ type: 'SET_NAME', payload: name })}
    />

    <Text style={styles.requiredStar}>*</Text>
    <Input
      containerStyle={{ marginTop: -10 }}
      placeholder="Description"
      clearButtonMode="never"
      maxLength={150}
      autoCorrect={false}
      keyboardType="default"
      value={state.description}
      onChangeText={(description) =>
        dispatch({ type: 'SET_DESCRIPTION', payload: description })
      }
    />
  </View>
);

export default InputsContainer;
