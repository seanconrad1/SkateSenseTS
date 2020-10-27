import { Platform } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
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

export async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
