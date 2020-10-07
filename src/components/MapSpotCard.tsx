import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
  Image,
  Animated
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import NEW_BOOKMARK_MUTATION from '../graphql/mutations/newBookmarkMutation';
import DELETE_BOOKMARK_MUTATION from '../graphql/mutations/deleteBookmarkMutation';
import GET_BOOKMARKS from '../graphql/queries/getBookmarks';

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

  console.log(bookmarked)


  const bookmarkSpot = async () => {
    let response;
    try {
      response = await createBookmark();
    } catch (e) {
      console.log(e);
      console.log(response);
    }

  }

  const unBookmarkSpot = async () => {
    await deleteBookmark();
  };

  const goToSpotPage = () => { };
  return (
    <View style={styles.card}>
      {/* <Arrow />  */}

      <View style={styles.topButtons}>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `http://maps.apple.com/?daddr=${spot.location.latitude},${spot.location.longitude}`,
            )
          }
          style={{ zIndex: 1 }}
        >
          <Icon
            raised
            containerStyle={{
              // position: 'relative',
              zIndex: 1,
              // marginLeft: 10,
              // marginTop: 10,
            }}
            name="directions"
            size={15}
            type="material-community"
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => opened ? _close() : _start()}>
          <Text style={styles.textBtn}>{opened ? "Lower" : "Raise"}</Text>
        </TouchableOpacity>
        <BookmarkButton
          spot={spot}
          bookmarked={bookmarked}
          bookmarkSpot={bookmarkSpot}
          unBookmarkSpot={unBookmarkSpot}

        />
      </View>

      <TouchableOpacity onPress={goToSpotPage}>
        <View>
          <Image
            style={styles.cardImage}
            resizeMode="cover"
            source={{ uri: `data:image/gif;base64,${spot.images[0].base64}` }}
            onPress={() => goToSpotPage(spot)}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.textContent}>
        <Text numberOfLines={1} style={styles.cardtitle}>
          {spot.name}
        </Text>
        <Text numberOfLines={1} style={styles.cardDescription}>
          {spot.description}
        </Text>
      </View>
    </View>
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
  },
  cardImage: {
    position: 'absolute',
    zIndex: 20,
    borderRadius: 20,
    flex: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  },





  container: {
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  item: {},
  btn: {
    backgroundColor: "#480032",
    height: 40,
    padding: 3,
    justifyContent: "center",
    borderRadius: 6,
    width: '30%'
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
