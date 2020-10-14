import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Linking,
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import GET_SPOTS from '../graphql/queries/getSpots';
import { Divider, Icon } from 'react-native-elements';
import TopHeader from '../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ramp from '../../assets/ramp.svg';

const SpotPage = ({ route, navigation }) => {
  const spot = route.params.spot;
  console.log(spot);

  const _renderItem = ({ item, key }) => (
    <View key={key}>
      <Image
        style={{ width: wp('100%'), height: hp('50%') }}
        source={{
          uri: `data:image/gif;base64,${item.base64}`,
        }}
      />
    </View>
  );

  return (
    <View style={styles.container} behavior="padding">
      <TopHeader name={spot.name} navigation={navigation} />

      <Icon
        raised
        size={hp('2.8')}
        name="directions"
        iconStyle={{ color: 'rgb(244, 2, 87)' }}
        containerStyle={styles.directionButton}
        onPress={() =>
          Linking.openURL(
            `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}&dirflg=d&t=h`
          )
        }
      />

      <Icon
        raised
        size={hp('2.8')}
        type="font-awesome"
        name="exclamation-triangle"
        iconStyle={{ color: 'orange' }}
        containerStyle={styles.reportButton}
        onPress={() => console.log('report!')}
      />

      <Animated.FlatList
        horizontal
        data={spot.images}
        renderItem={_renderItem}
        sliderWidth={wp('50%')}
        itemWidth={wp('50%')}
        scrollEventThrottle={2}
        snapToInterval={wp('100%')}
        keyExtractor={(item) => item._id}
        style={styles.flatListContainer}
      />

      <View style={styles.infoContainer}>
        <View style={styles.typeContainer}>
          <Image
            style={styles.littleIcons}
            source={require('../../assets/ramp.png')}
          />
          <Text style={styles.description}>{spot.spotType}</Text>
        </View>

        <View style={styles.containsContainer}>
          {spot.contains.map((contain, i) => (
            <View style={styles.contains}>
              <Text style={styles.containsText} key={i}>
                {contain}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>{spot.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    fontFamily: 'ProximaNova',
    alignItems: 'center',
  },
  flatListContainer: {
    height: '50%',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 10,
    // backgroundColor: 'lightgrey',
  },

  description: {
    fontSize: 17,
  },
  typeContainer: {
    height: hp('10%'),
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  littleIcons: {
    width: 50,
    height: 50,
  },
  containsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
    marginBottom: 20,
  },
  contains: {
    height: hp('5%'),
    backgroundColor: 'rgb(244, 2, 87)',
    alignContent: 'center',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  containsText: {
    fontSize: 20,
    color: 'white',
  },
  homeView: {
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  text: {
    margin: 20,
    fontFamily: 'ProximaNova',
    fontSize: 20,
    position: 'relative',
  },
  directionButton: {
    position: 'absolute',
    zIndex: 2,
    marginRight: wp('30%'),
    marginTop: hp('10%'),
    alignSelf: 'flex-end',
    paddingRight: wp('15%'),
  },
  reportButton: {
    position: 'absolute',
    zIndex: 2,
    marginLeft: wp('30%'),
    paddingRight: wp('15%'),
    marginTop: hp('90%'),
    alignSelf: 'flex-end',
  },
});

export default SpotPage;