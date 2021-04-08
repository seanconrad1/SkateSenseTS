import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import { MainContext } from '../store';
import { createBookmark, getBookmark, deleteBookmark } from '../api/api';

const BookmarkButton = ({ spot }) => {
  const { state, dispatch } = useContext(MainContext);
  const [bookmarked, setBookmarked] = useState(null);
  const { user_id } = state;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let response;

    async function getTheBookmark() {
      setLoading(true);
      response = await getBookmark(user_id, spot._id);
      if (response.error) {
        console.log(response.error.message);
      } else {
        setBookmarked(response.bookmarked);
      }
      setLoading(false);
    }

    console.log('response', response);
    getTheBookmark();
  }, [bookmarked]);

  const bookmarkSpot = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      setLoading(true);
      const response = await createBookmark(user_id, spot._id);
      setBookmarked(true);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const unBookmarkSpot = async () => {
    setLoading(true);
    const response = await deleteBookmark(user_id, spot._id);
    setBookmarked(false);

    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={bookmarked ? unBookmarkSpot : bookmarkSpot}
      style={styles.shadow}
    >
      <Icon
        containerStyle={styles.containerStyle}
        name="bookmark"
        size={20}
        type="font-awesome"
        color={bookmarked ? 'rgb(244, 2, 87)' : 'black'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    zIndex: 1,
    borderRadius: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 1,
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    shadowOffset: { height: 1, width: 0.5 },
  },

  containerStyle: {
    zIndex: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
});

export default BookmarkButton;
