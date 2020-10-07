import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const BookmarkButton = ({ spot, bookmarkSpot, unBookmarkSpot, bookmarked }) => {

  return (
    <TouchableOpacity style={styles.shadow}>
      {!bookmarked ? (
        <Icon
          containerStyle={styles.containerStyle}
          name="bookmark"
          size={20}
          type="font-awesome"
          color="black"
          onPress={bookmarkSpot}
        />
      ) : (
          <Icon
            containerStyle={styles.containerStyle}
            name="bookmark"
            size={20}
            type="font-awesome"
            color="rgb(244, 2, 87)"
            onPress={unBookmarkSpot}
          />
        )}
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
    shadowRadius: .5,
    shadowOffset: { height: 1, width: .5 },
  },

  containerStyle: {
    zIndex: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
  }
})

export default BookmarkButton;
