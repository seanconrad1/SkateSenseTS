import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styles from '../styles';

const PhotoHolders = ({ state, onOpen }) => (
  <View style={styles.imageBoxContainer}>
    <TouchableOpacity style={styles.photoBox} onPress={() => onOpen(0)}>
      {state.photo && state.photo[0] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[0].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity style={styles.photoBox} onPress={() => onOpen(1)}>
      {state.photo && state.photo[1] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[1].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity style={styles.photoBox} onPress={() => onOpen(2)}>
      {state.photo && state.photo[2] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[2].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity style={styles.photoBox} onPress={() => onOpen(2)}>
      {state.photo && state.photo[3] ? (
        <Image
          style={[styles.photoBox, { marginTop: -5 }]}
          source={{ uri: state.photo[3].uri }}
        />
      ) : (
        <Text> + </Text>
      )}
    </TouchableOpacity>
  </View>
);

export default PhotoHolders;
