import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
  Share,
  Alert,
} from 'react-native';
import { Icon, Card, Divider } from 'react-native-elements';
import { findDistance } from '../utils/helpers';

const SpotCard = ({
  spot,
  navigation,
  bookmark,
  unBookmarkAlertMsg,
  deleteAlertMsg,
}) => {
  const [distanceFrom, setDistanceFrom] = useState('');

  findDistance(setDistanceFrom, spot);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${spot.name}`,
        url: `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('SpotPage', {
          skatespot: spot,
        });
      }}>
      <Card
        key={spot.id}
        title={spot.name}
        image={{ uri: `data:image/gif;base64,${spot.images[0].base64}` }}
        containerStyle={styles.spot}>
        <Text style={styles.aboutContainer}>
          <Text style={styles.aboutContainerItem}>About: </Text>
          <Text>{spot.description}</Text>
          {'\n'}

          {distanceFrom && (
            <>
              <Text style={styles.aboutContainerItem}>Distance: </Text>
              <Text>{distanceFrom.toFixed(2)}mi</Text>
            </>
          )}
          {'\n'}
          <Text style={styles.aboutContainerItem}>Kickout Level: </Text>
          <Text>{spot.kickout_level}</Text>
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.iconContainer}>
          <Icon
            raised
            name="directions"
            size={17}
            type="material-community"
            color="black"
            onPress={() =>
              Linking.openURL(
                `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}`,
              )
            }
          />
          {bookmark ? (
            <Icon
              raised
              name="bookmark"
              size={15}
              type="font-awesome"
              color="rgb(244, 2, 87)"
              onPress={() => unBookmarkAlertMsg(spot._id)}
            />
          ) : (
            <Icon
              raised
              name="trash"
              type="font-awesome"
              size={17}
              color="rgb(244, 2, 87)"
              onPress={() => deleteAlertMsg(spot._id)}
            />
          )}

          <Icon
            raised
            name="share"
            type="material-community"
            size={17}
            color="rgb(244, 2, 87)"
            onPress={() => onShare(spot)}
          />
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  spot: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutContainer: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  aboutContainerItem: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  // lastSpot: {
  //   paddingBottom: 100,
  //   borderRadius: 20,
  //   shadowOpacity: 0.75,
  //   shadowRadius: 3,
  //   shadowColor: 'grey',
  //   shadowOffset: { height: 1, width: 1 },
  // },
});

export default SpotCard;
