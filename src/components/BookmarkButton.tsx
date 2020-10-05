import React, { useState, useCallback, useEffect, useContext } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NEW_BOOKMARK_MUTATION from '../graphql/mutations/newBookmarkMutation';
import DELETE_BOOKMARK_MUTATION from '../graphql/mutations/deleteBookmarkMutation';
import { store } from "../store";
import GET_BOOKMARKS from '../graphql/queries/getBookmarks';

const BookmarkButton = ({ spot }) => {
  const [bookmarked, setBookmark] = useState(false);
  const { state, dispatch } = useContext(store);


  const { user_id } = state



  const {
    loading: loading2,
    error: error2,
    data: bookmarks,
    refetch,
  } = useQuery(GET_BOOKMARKS, {
    variables: { user_id },
  });

  const [createBookmark] = useMutation(NEW_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id,
        spot_id: spot._id,
      },
    },

    onCompleted: refetch,
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
  });
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id: user_id,
        spot_id: spot._id,
      },
    },
    onCompleted: refetch,
    awaitRefetchQueries: true,
  });


  useEffect(() => {
    checkIfUserBookmarkedSpot();
  }, [checkIfUserBookmarkedSpot]);

  const checkIfUserBookmarkedSpot = useCallback(() => {
    if (bookmarks && !loading2) {
      const isBookmarked = bookmarks.getUser.bookmarks.find(
        bmark => bmark._id === spot._id,
      );
      if (isBookmarked) {
        setBookmark(true);
      } else {
        setBookmark(false);
      }
      return null;
    }
  }, [bookmarks, loading2, spot._id]);

  const bookmarkSpot = async () => {
    let response;
    try {
      response = await createBookmark();
    } catch (e) {
      console.log(e);
      console.log(response);
    }
    checkIfUserBookmarkedSpot();
  };

  const unBookmarkSpot = async () => {
    await deleteBookmark();
    checkIfUserBookmarkedSpot();
  };


  return (
    <TouchableOpacity style={{ position: 'absolute', zIndex: 1 }}>
      {!bookmarked ? (
        <Icon
          raised
          containerStyle={{
            position: 'absolute',
            marginLeft: wp('80%'),
            marginTop: hp('1%'),
          }}
          name="bookmark"
          size={15}
          type="font-awesome"
          color="black"
          onPress={bookmarkSpot}
        />
      ) : (
          <Icon
            raised
            containerStyle={{
              position: 'absolute',
              marginLeft: wp('80%'),
              marginTop: hp('1%'),
            }}
            name="bookmark"
            size={15}
            type="font-awesome"
            color="rgb(244, 2, 87)"
            onPress={unBookmarkSpot}
          />
        )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;
