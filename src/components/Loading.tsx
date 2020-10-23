import React, { Component } from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

const Loading = () => (
  <View style={styles.container}>
    <Image
      style={styles.imageStyle}
      source={require('../../assets/loader.gif')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: window.height,
    backgroundColor: 'rgb(227, 227, 227)',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  imageStyle: {
    width: 40,
    height: 40,
  },
});

export default Loading;
