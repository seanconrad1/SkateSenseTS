import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Button } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';

import markerIcon from '../../../assets/markerIcon.png';

console.disableYellowBox = true;

const { height, width } = Dimensions.get('window');

const LocationSelectorMap = props => {
  const [region, setRegion] = useState('');
  const [userLocation, setUserLocation] = useState({});
  const [geoLocationSwitch, setGeolocationSwitch] = useState(false);

  useEffect(() => {
    getUserLocationHandler();
  }, []);

  const onRegionChange = region => {
    setRegion(region);
  };

  const selectLocation = () => {
    // this.props.navigation.goBack('yo', )
    props.navigation.navigate('New Spot', {
      selectedLocation: region,
    });
  };

  const getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setGeolocationSwitch(true);
    });
  };

  if (!userLocation.latitude) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={userLocation}
        onRegionChange={onRegionChange}
      />

      <View>
        <Image
          source={markerIcon}
          style={{
            position: 'absolute',
            marginTop: hp('45%'),
            marginLeft: wp('44%'),
            width: 50,
            height: 50,
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: '85%',
          left: '0%',
          justifyContent: 'center',
        }}>
        <Button
          title="Submit Location"
          buttonStyle={{
            width,
            height: 80,
            backgroundColor: 'rgb(244, 2, 87)',
          }}
          onPress={selectLocation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    position: 'absolute',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LocationSelectorMap;
