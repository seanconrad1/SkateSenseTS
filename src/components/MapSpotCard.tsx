import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import NEW_BOOKMARK_MUTATION from '../graphql/mutations/newBookmarkMutation';
import DELETE_BOOKMARK_MUTATION from '../graphql/mutations/deleteBookmarkMutation';
import GET_BOOKMARKS from '../graphql/queries/getBookmarks';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as Haptics from 'expo-haptics';
import { Icon, Button } from 'react-native-elements';
import BookmarkButton from './BookmarkButton';
import { store } from "../store";
const CARD_WIDTH = wp('95%');

interface iSpot {

}

const MapSpotCard = ({ spot, raise, lower }) => {
  const [opened, setOpened] = useState(true)
  const modalRef = useRef(null)
  const { state, dispatch } = useContext(store);
  const { user_id } = state
  // const [bookmarked, setBookmarked] = useState(false);
  const { loading, error, data: bookmarks } = useQuery(GET_BOOKMARKS, {
    variables: { user_id }
  })
  const [createBookmark] = useMutation(NEW_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id,
        spot_id: spot._id,
      },
    },
    refetchQueries: [{ query: GET_BOOKMARKS, variables: { user_id } }],
    // notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
  });
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id: user_id,
        spot_id: spot._id,
      },
    },
    refetchQueries: [{ query: GET_BOOKMARKS, variables: { user_id } }],
    awaitRefetchQueries: true,
  });


  if (loading) {
    return <Text>Loading</Text>
  }
  if (error) {
    return <Text>Error{error}</Text>
  }

  let bookmarked = bookmarks.getBookmarks.map(i => i._id).some(r => r === spot._id)


  const _start = () => {
    raise()
    setOpened(true)
  };

  const _close = () => {
    lower()
    setOpened(false)
  };



  const bookmarkSpot = async () => {
    let response;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    try {
      response = await createBookmark();
    } catch (e) {
      console.log(e);
    }

  }

  const unBookmarkSpot = async () => {
    await deleteBookmark();
  };

  const config = {
    velocityThreshold: .8,
    directionalOffsetThreshold: 500
  };

  // <TouchableOpacity style={styles.btn} onPress={() => opened ? _close() : }>
  //           <Text style={styles.textBtn}>{opened ? "Lower" : "Raise"}</Text>
  //         </TouchableOpacity>

  const goToSpotPage = () => {
    console.log('getting here')
  };

  return (
    <GestureRecognizer
      onSwipeUp={(state) => _start()}
      onSwipeDown={(state) => _close()}
      config={config}
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >

      <View style={styles.card}>
        <View style={styles.tab} />
        <View style={styles.topButtons}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}`,
              )
            }
            style={styles.directionsButton}
          >
            <Icon
              containerStyle={styles.directionsButtonIcon}
              name="directions"
              size={20}
              type="material-community"
              color="black"
            />
          </TouchableOpacity>

          <BookmarkButton
            spot={spot}
            bookmarked={bookmarked}
            bookmarkSpot={bookmarkSpot}
            unBookmarkSpot={unBookmarkSpot}
          />
        </View>

        <TouchableWithoutFeedback onPress={goToSpotPage}>
          <Image
            style={styles.cardImage}
            resizeMode="cover"
            source={{ uri: `data:image/gif;base64,${spot.images[0].base64}` }}
          />
        </TouchableWithoutFeedback>

        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {spot.name}
          </Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {spot.description}
          </Text>
        </View>
      </View>
    </GestureRecognizer>
  );

};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: hp('40%'),
    padding: 10,
    elevation: 1,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  tab: {
    height: hp('.8%'),
    width: hp('5%'),
    marginBottom: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  cardImage: {
    zIndex: 2,
    borderRadius: 20,
    width: wp('90%'),
    height: hp('32%'),
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: hp('2%'),
    marginTop: hp('32%'),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },

  topButtons: {
    display: 'flex',
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: CARD_WIDTH - wp('5%'),
    position: 'absolute',
    marginTop: hp('2%')
  },

  directionsButton: {
    zIndex: 2,
    borderRadius: 40,
    justifyContent: 'center',
    backgroundColor: 'rgb(250,255,255)',
    elevation: 1,
    shadowOpacity: 0.3,
    shadowRadius: .5,
    shadowOffset: { height: 1, width: .5 },
  },
  directionsButtonIcon: {
    zIndex: 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },



  container: {
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  item: {},
  btn: {
    zIndex: 25,
    backgroundColor: "#480032",
    height: 40,
    padding: 3,
    justifyContent: "center",
    borderRadius: 6,
    width: '30%',
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  item1: {
    backgroundColor: "red",
    padding: 20,
    width: 100,
    margin: 10
  },

  textBtn: {
    color: "#f4f4f4",
    fontWeight: "bold",
    textAlign: "center"
  }

});

export default MapSpotCard;
