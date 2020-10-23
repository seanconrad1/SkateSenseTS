import * as Location from 'expo-location';
// conversion factor to miles
const factor = 0.621371;

const distance = (lon1, lat1, lon2, lat2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
  const dLon = (lon2 - lon1).toRad();
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) *
      Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * factor;
};

/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRad === 'undefined') {
  Number.prototype.toRad = function () {
    return (this * Math.PI) / 180;
  };
}

export const getCurrentLocation = async () =>
  Location.getCurrentPositionAsync({});

export const findDistance = (setDistanceFrom, spot) => {
  // Geolocation.getCurrentPosition(async pos => {
  //   return setDistanceFrom(
  //     distance(
  //       pos.coords.longitude,
  //       pos.coords.latitude,
  //       spot.location.latitude,
  //       spot.location.longitude,
  //     ) / 1609,
  //   );
  // });
};
