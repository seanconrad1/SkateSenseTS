import React from 'react';
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
import { useMutation } from '@apollo/react-hooks';
import APPROVE_SPOT_MUTATION from '../graphql/mutations/approveSpotMutation';
import DELETE_SPOT_MUTATION from '../graphql/mutations/deleteSpotMutation';

import GET_SPOTS from '../graphql/queries/getSpots';
import GET_NOT_APPROVED_LIST from '../graphql/queries/getNotApprovedList';
import { Divider, Icon } from 'react-native-elements';
import TopHeader from '../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ApprovalSpotPage = ({ route, navigation }) => {
  const [approveSpotMutation] = useMutation(APPROVE_SPOT_MUTATION);
  const [deleteSpot] = useMutation(DELETE_SPOT_MUTATION);

  const spot = route.params.spot;

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
    await deleteSpot({
      variables: { _id: spot._id },
      refetchQueries: [{ query: GET_SPOTS }, { query: GET_NOT_APPROVED_LIST }],
    });

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

  const approveSpot = async () => {
    await approveSpotMutation({
      variables: { _id: spot._id },
      refetchQueries: [{ query: GET_SPOTS }, { query: GET_NOT_APPROVED_LIST }],
    });

    navigation.navigate('Approvals');
  };

  return (
    <View style={styles.container} behavior="padding">
      <TopHeader name="Spot Approval" navigation={navigation} />

      <Icon
        raised
        size={hp('2.8')}
        name="directions"
        iconStyle={{ color: 'rgb(244, 2, 87)' }}
        containerStyle={{
          position: 'absolute',
          zIndex: 1,
          marginLeft: wp('85%'),
          marginTop: '20%',
        }}
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

        <TouchableOpacity onPress={approveSpot}>
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
});
