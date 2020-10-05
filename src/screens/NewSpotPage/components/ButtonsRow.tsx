import React from 'react'
import { View, Button, Text } from 'react-native'
import styles from '../styles'

const ButtonsRow = ({ state, navigation, getCurrentLocation }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        buttonStyle={
          { backgroundColor: 'rgb(244, 2, 87)' }
        }
        title="Set Spot Location"
        onPress={() => navigation.navigate('LocationSelectorMap')}
      />
      <Text>OR</Text>
      <Button
        buttonStyle={
          state.currentLocationSelected
            ? styles.spotLocationSelected
            : styles.spotLocationButton
        }
        title="Use Current Location"
        onPress={getCurrentLocation}
      />
    </View>
  )
}
export default ButtonsRow