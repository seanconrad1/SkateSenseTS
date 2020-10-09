import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import styles from '../styles'

const ButtonsRow = ({ state, navigation, getCurrentLocation, locationSelected, currentLocationSelected }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        buttonStyle={
          locationSelected
            ? styles.spotLocationSelected
            : styles.spotLocationButton
        }
        title="Set Spot Location"
        onPress={() => navigation.navigate('LocationSelectorMap')}
      />
      <Text>OR</Text>
      <Button
        buttonStyle={
          currentLocationSelected
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