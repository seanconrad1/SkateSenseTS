import Geolocation from '@react-native-community/geolocation';

export const animateToUserLocation = mapRef => {
  Geolocation.getCurrentPosition(position => {
    mapRef.current.animateToRegion(
      {
        latitude: position.coords.latitude - 0.02,
        longitude: position.coords.longitude,
        latitudeDelta: 0.115,
        longitudeDelta: 0.1121,
      },
      350,
    );
  });
};
