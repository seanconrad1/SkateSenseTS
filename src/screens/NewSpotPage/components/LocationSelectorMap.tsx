import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Button } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getCurrentLocation } from '../../../utils/helpers'

import markerIcon from '../../../../assets/markerIcon.png';
import { animateToUserLocation } from '../../Map/utils';
import { reducer, newSpotState } from '../reducer';

console.disableYellowBox = true;

const { height, width } = Dimensions.get('window');

const LocationSelectorMap = ({ navigation }) => {
  const [region, setRegion] = useState('');
  const [userLocation, setUserLocation] = useState({});
  const [state, dispatch] = useReducer(reducer, newSpotState);

  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation()
      setUserLocation(location.coords)
    })();
  }, []);


  useEffect(() => {
    if (state.locationSelected) {
      navigation.navigate("New Spot Page", { region })
    }
  }, [state]);

  const onRegionChange = region => {
    setRegion(region);
  };

  const selectLocation = () => {
    // this.navigation.goBack('yo', )

    dispatch({
      type: 'SET_LOCATION',
      payload: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    });
  };


  if (userLocation.latitude === undefined) {
    return <Text>Loading...</Text>;
  }



  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
  )
}

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
