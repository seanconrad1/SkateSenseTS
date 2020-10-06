import React from 'react'
import { Header } from 'react-native-elements'

const TopHeader = ({ navigation, name }) => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-left',
        type: 'font-awesome',
        color: 'black',
        onPress: () => navigation.goBack(),
      }}
      centerComponent={{
        text: name,
        style: { color: 'black', fontSize: 25, fontFamily: 'Lobster' },
      }}
      backgroundColor="white"
      containerStyle={{
        justifyContent: 'space-around',
      }}
    />
  )
}

export default TopHeader
