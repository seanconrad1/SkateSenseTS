import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles';

const PhotoHolders = ({ state }) => (
  <View style={styles.imageBoxContainer}>
    <View style={styles.photoBox}>
      {state.photo && state.photo[0] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[0].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </View>

    <View style={styles.photoBox}>
      {state.photo && state.photo[1] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[1].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </View>

    <View style={styles.photoBox}>
      {state.photo && state.photo[2] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[2].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </View>

    <View style={styles.photoBox}>
      {state.photo && state.photo[3] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[3].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </View>
  </View>
);

export default PhotoHolders;
