import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ramp from '../../assets/ramp.svg';

const SpotPage = ({ route, navigation }) => {
  const spot = route.params.spot;

  const getIcon = () => {
    switch (spot.spotType) {
      case 'Street Spot':
        return require('../../assets/stairs.png');
      case 'Skatepark':
        return require('../../assets/ramp.png');

      default:
        break;
    }
  };

  const _renderItem = ({ item, key }) => (
    <View key={key}>
      <Image
        style={styles.image}
        source={{
          uri: `data:image/gif;base64,${item.base64}`,
        }}
      />
    </View>
  );

  const reportSpot = () => {
    Alert.alert(
      'Report spot!',
      'Report?',
      [
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => console.log('REPORTED'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container} behavior="padding">
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
        onPress={reportSpot}
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

      <ScrollView style={{ height: '100%' }}>
        <View style={styles.infoContainer}>
          <View style={styles.typeContainer}>
            <Image style={styles.littleIcons} source={getIcon()} />
            <Text style={styles.description}>{spot.spotType}</Text>
          </View>

          <View style={styles.containsContainer}>
            {spot.contains.map((contain, i) => (
              <View key={i} style={styles.contains}>
                <Text style={styles.containsText}>{contain}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>{spot.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'ProximaNova',
    height: '100%',
    width: '100%',
    // backgroundColor: 'red',
  },
  flatListContainer: {
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    // backgroundColor: 'blue'
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
    flexWrap: 'wrap',
    alignContent: 'space-between',
    marginBottom: 20,
  },
  contains: {
    height: 45,
    backgroundColor: 'rgb(244, 2, 87)',
    alignContent: 'center',
    alignItems: 'center',
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
    marginTop: hp('2%'),
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
  image: {
    width: wp('100%'),
    height: hp('50%'),
  },
});

export default SpotPage;
