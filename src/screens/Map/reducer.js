import { Animated } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const getLocation = () => {
  let initReg;
  Geolocation.getCurrentPosition(position => {
    let initReg = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.115,
      longitudeDelta: 0.1121,
    };
  });
  return initReg;
};
// geoLocationSwitch: true,

export const mapState = {
  initialRegion: getLocation(),
  geoLocationSwitch: false,
  animation: new Animated.Value(0),
  index: 0,
  updateCounter: 0,
  region: {
    latitudeDelta: 0.115,
    longitudeDelta: 0.1121,
  },
  filteredSpots: [
    {
      id: 1,
      name: 'MySkateSpot',
      owner: { name: 'Sean' },
      state: 'NY',
      city: 'NYC',
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      description: 'A good spot',
      kickout_level: 10,
      images: [{ base64: 'asrgaseg' }],
    },
  ],
  map: {},
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_SPOTS':
      return { ...state, filteredSpots: action.payload };
    case 'SET_INIT_LOCATION':
      return {
        ...state,
        initialRegion: action.payload.initialRegion,
        geoLocationSwitch: action.payload.geoLocationSwitch,
      };
    case 'SET_MAP':
      return { ...state, map: action.payload };
    case 'SET_CURRENT_REGION':
      return { ...state, currentRegion: action.payload };
    case 'UPDATE_COUNTER':
      return { ...state, updateCounter: action.payload };
    default:
      throw new Error();
  }
}
