import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Divider, Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { approveSpot, deleteSpot, getspot, getSpotOwner } from '../api/api';

const ApprovalSpotPage = ({ route, navigation }) => {
  const [spotOwner, setSpotOwner] = useState();
  const [loading, setLoading] = useState(false);
  const spot = route.params.spot;

  useFocusEffect(
    useCallback(() => {
      async function fetchMyAPI() {
        setLoading(true);
        const response = await getSpotOwner(spot.owner._id);
        setSpotOwner(response);
        setLoading(false);
      }
      fetchMyAPI();
      setLoading(false);
    }, [])
  );

  const _renderItem = ({ item, index }) => (
    <View>
      <Image
        style={{ width: wp('100%'), height: hp('50%') }}
        source={{
          uri: `data:image/gif;base64,${item.base64}`,
        }}
      />
    </View>
  );

  const deleteSpotAndNav = async () => {
    const reponse = await deleteSpot(spot._id);

    navigation.goBack();
  };

  const deletingSpotAlert = () => {
    Alert.alert(
      'Delete spot?',
      'Spot will be deleted.',
      [
        {
          text: 'Delete',
          onPress: () => deleteSpotAndNav(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const approveSpotButton = async () => {
    const response = await approveSpot(spot._id);

    await sendPushNotification();
    navigation.navigate('Approvals');
  };

  const sendPushNotification = async () => {
    const cleanedToken = spotOwner?.push_token;

    const message = {
      to: cleanedToken,
      sound: 'default',
      title: 'Spot Approved!',
      body: 'Your spot was approved, check it out!',
      data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  if (loading) {
    return <Text>loading</Text>;
  }

  return (
    <View style={styles.container} behavior="padding">
      <Icon
        raised
        size={hp('2.8')}
        name="directions"
        iconStyle={{ color: 'rgb(244, 2, 87)' }}
        containerStyle={styles.iconContainer}
        onPress={() =>
          Linking.openURL(
            `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}&dirflg=d&t=h`
          )
        }
      />

      <Animated.FlatList
        horizontal
        data={spot.images}
        renderItem={_renderItem}
        sliderWidth={wp('50%')}
        itemWidth={wp('50%')}
        scrollEventThrottle={1}
        snapToInterval={wp('100%')}
        keyExtractor={(item, i) => i}
      />

      <Text style={styles.text}>
        SPOT NAME: {spot.name}
        {'\n'}
        DESCRIPTION: {spot.description}
        {'\n'}
        OWNER: {spot.owner.name}
        {'\n'}
        TYPE: {spot.spotType}
        {'\n'}
        CONTAINS:{' '}
        {spot.contains.map((i) => (
          <Text>{i}, </Text>
        ))}
      </Text>

      <Divider />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={deletingSpotAlert}>
          <Icon
            raised
            size={hp('7')}
            name="times"
            type="font-awesome"
            iconStyle={{ color: 'rgb(244, 2, 87)' }}
            containerStyle={styles.button}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={approveSpotButton}>
          <Icon
            raised
            size={hp('7')}
            name="check"
            type="font-awesome"
            iconStyle={{ color: 'green' }}
            containerStyle={styles.button}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApprovalSpotPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: hp('5%'),
    marginBottom: hp('10%'),
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  homeView: {
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  text: {
    margin: 20,
    fontFamily: 'ProximaNova',
    // letterSpacing: 3,
    fontSize: 20,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    top: '2%',
    right: '5%',
  },
});
