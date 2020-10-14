import React, { useState, FunctionComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface iProps {
  button: string;
  dispatch: ({}) => void;
  state: {};
  type: boolean;
  contains: boolean;
  key: number;
}

const CustomButtonGroup: FunctionComponent<iProps> = ({
  type,
  contains,
  button,
  state,
  dispatch,
}) => {
  const handleOnClick = () => {
    if (contains) {
      if (!state.spotContains.some((i) => i === button)) {
        dispatch({ type: 'SET_SPOT_CONTAINS', payload: button });
      } else {
        dispatch({ type: 'REMOVE_SPOT_CONTAINS', payload: button });
      }
    }
    if (type) {
      dispatch({ type: 'SET_SPOT_TYPE', payload: button });
    }
  };

  const getStyle = () => {
    if (contains && state.spotContains.includes(button)) {
      return styles.selectedButton;
    } else if (type && state.spotType === button) {
      return styles.selectedButton;
    } else {
      return styles.button;
    }
  };

  return (
    <TouchableOpacity onPress={() => handleOnClick()} style={getStyle()}>
      <Text style={styles.buttonText}>{button}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    width: wp('29.5%'),
    height: 50,
    color: 'blue',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 5,
  },
  buttonText: {
    color: 'black',
  },

  selectedButton: {
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    width: wp('29.5%'),
    backgroundColor: 'rgb(244, 2, 87)',
    height: 50,
    color: 'blue',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomButtonGroup;
