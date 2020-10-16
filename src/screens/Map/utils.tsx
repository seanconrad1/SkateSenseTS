import * as Location from 'expo-location';
import { getCurrentLocation } from '../../utils/helpers';

export const animateToUserLocation = async (mapRef) => {



  const location = await getCurrentLocation()
  mapRef.current.animateToRegion({
    latitude: location.coords.latitude - .025,
    longitude: location.coords.longitude,
    latitudeDelta: 0.115,
    longitudeDelta: 0.1121
  }, 1000)

};
