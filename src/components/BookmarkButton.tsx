import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

const BookmarkButton = ({ spot, bookmarkSpot, unBookmarkSpot, bookmarked }) => {

  return (
    <TouchableOpacity style={{ zIndex: 1 }}>
      {!bookmarked ? (
        <Icon
          raised
          containerStyle={{
            // position: 'absolute',
            // marginLeft: wp('80%'),
            // marginTop: hp('1%'),
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
              // position: 'absolute',
              // marginLeft: wp('80%'),
              // marginTop: hp('1%'),
            }}
            name="bookmark"
            size={15}
            type="font-awesome"
            color="red"
            onPress={unBookmarkSpot}
          />
        )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;
