import * as Location from 'expo-location'

export const animateToUserLocation = async (mapRef) => {
  let location = await Location.getCurrentPositionAsync({});
  mapRef.current.animateToRegion(
    {
      latitude: location.coords.latitude - 0.02,
      longitude: location.coords.longitude,
      latitudeDelta: 0.115,
      longitudeDelta: 0.1121,
    },
    350,
  );
  return true
};
