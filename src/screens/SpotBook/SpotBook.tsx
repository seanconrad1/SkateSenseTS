import React, { useState, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
// import GET_BOOKMARKS from '../../graphql/queries/getBookmarks';
import SpotCard from '../../components/SpotCard';
import SpotsButtonGroup from '../../components/SpotsButtonGroup';
import { MainContext } from '../../store';
import { getCurrentLocation } from '../../utils/helpers';
import Loading from '../../components/Loading';
import {
  streetSpotTypebuttons,
  streetSpotContains,
} from '../../utils/typesAndSelections';
import Modal from 'react-native-modalbox';
import CustomButtonGroup from '../../components/CustomButtonGroup';
import { handleDeleteSpot } from './helpers';

import {
  getUserCreatedSpots,
  getBookmarks,
  deleteBookmark,
} from '../../api/api';

const SpotBook = ({ navigation }) => {
  const { state: myStore } = useContext(MainContext);
  const [tab, setTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [refreshing] = useState(false);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const modalRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [mySpots, setMySpots] = useState();
  const [myBookmarks, setMyBookmarks] = useState();

  const [loading, setLoading] = useState(false);

  const filters = [...streetSpotTypebuttons, ...streetSpotContains];

  useFocusEffect(
    useCallback(() => {
      async function fetchMyAPI() {
        setLoading(true);
        const location = await getCurrentLocation();
        const response = await getUserCreatedSpots(
          myStore.user_id,
          location?.coords?.latitude,
          location?.coords?.longitude
        );
        setMySpots(response);
        const bookmarksResponse = await getBookmarks(myStore.user_id);
        setMyBookmarks(bookmarksResponse);
        setLoading(false);
      }
      fetchMyAPI();
      setLoading(false);
    }, [])
  );

  // const getCoords = async () => {
  //   return;
  // };

  const searchFilter = (input) => {
    if (input === '') {
      setSearchInput('');
      return mySpots;
    } else {
      setSearchInput(input.toLowerCase());
      return setFilteredSpots(
        mySpots?.filter((spot) =>
          spot.name.toLowerCase().includes(input.toLowerCase())
        )
      );
    }
  };

  const onChangeTab = (e: number) => setTab(e);

  const unBookmark = async (_id: string) => {
    try {
      console.log('what are these', _id, myStore.user_id);
      await deleteBookmark(myStore.user_id, _id);
      const getMyBookmarks = await getBookmarks(myStore.user_id);
      setMyBookmarks(getMyBookmarks);
    } catch (e) {
      alert('Unable to delete bookmark at this time.');
    }
  };

  const unBookmarkAlertMsg = (_id) => {
    Alert.alert(
      'Unbookmarking spot',
      'Are you sure you want to unbookmark this spot?',
      [
        { text: 'Yes', onPress: () => unBookmark(_id) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const deleteAlertMsg = async (_id: string) => {
    const location = await getCurrentLocation();

    Alert.alert(
      'Deleting spot',
      'Are you sure you want to delete this spot?',
      [
        {
          text: 'Yes',
          onPress: () =>
            handleDeleteSpot(_id, myStore.user_id, async () => {
              const response = await getUserCreatedSpots(
                myStore.user_id,
                location.coords.latitude,
                location.coords.longitude
              );
              setMySpots(response);
            }),
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

  const launchRefetch = async () => {
    if (tab === 0) {
      const location = await getCurrentLocation();
      const response = await getUserCreatedSpots(
        myStore.user_id,
        location.coords.latitude,
        location.coords.longitude
      );
      setMySpots(response);
    }
    if (tab === 1) {
      getBookmarks(myStore.user_id);
    }
  };

  const onClose = () => {
    modalRef?.current?.close();
  };

  // const onOpen = (index: number) => {
  //   modalRef!.current.open()
  //   // setSeletctedPhotoIndex(index)
  // }

  if (loading || mySpots === undefined) {
    return <Loading />;
  }

  const spotCard = ({ item }) => (
    <SpotCard
      spot={item}
      navigation={navigation}
      deleteAlertMsg={deleteAlertMsg}
    />
  );

  const bookmarkCard = ({ item }) => (
    <SpotCard
      spot={item}
      bookmark
      navigation={navigation}
      unBookmarkAlertMsg={unBookmarkAlertMsg}
    />
  );

  const whichSpots = searchInput ? filteredSpots : mySpots;

  return (
    <View style={styles.viewContainer}>
      <Input
        style={styles.search}
        placeholder="Search"
        returnKeyType="search"
        onChangeText={(value) => searchFilter(value)}
        // rightIcon={
        //   <Button title="Filter" onPress={onOpen} buttonStyle={styles.btn} />
        // }
      />

      <SpotsButtonGroup onChangeTab={onChangeTab} />

      <Modal
        swipeToClose={false}
        style={styles.modal}
        position={'center'}
        ref={modalRef}
      >
        <View style={styles.container}>
          {filters.map((filter, key) => (
            <TouchableOpacity key={key} style={styles.selectedButton}>
              <Text style={styles.buttonText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={'Apply'}
          onPress={onClose}
          buttonStyle={styles.applyButton}
        />
      </Modal>

      {tab === 0 &&
        (mySpots?.length > 0 ? (
          <FlatList
            data={whichSpots}
            keyExtractor={(item) => item._id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={launchRefetch}
              />
            }
            renderItem={spotCard}
          />
        ) : (
          <Text style={styles.noneText}>You haven't created any spots yet</Text>
        ))}

      {tab === 1 &&
        (myBookmarks.length > 0 ? (
          <FlatList
            data={myBookmarks}
            keyExtractor={(item) => item._id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={launchRefetch}
              />
            }
            renderItem={bookmarkCard}
          />
        ) : (
          <Text style={styles.noneText}>
            You haven't bookmarked any spots yet
          </Text>
        ))}
    </View>
  );
};

export default SpotBook;

const styles = StyleSheet.create({
  viewContainer: { flex: 1 },

  btn: {
    backgroundColor: 'rgb(244, 2, 87)',
    color: 'black',
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  applyButton: {
    backgroundColor: 'rgb(244, 2, 87)',
    color: 'black',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  modal: {
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 50,
    height: 420,
    width: 380,
    // backgroundColor: 'transparent'
  },

  container: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'row',
    color: 'grey',
    flexWrap: 'wrap',
    width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  selectedButton: {
    borderWidth: 0.4,
    borderRadius: 10,
    padding: 0,
    margin: 5,
    width: wp(25),
    backgroundColor: 'transparent',
    height: 45,
    color: 'blue',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  search: {
    marginLeft: wp('10%'),
    borderColor: 'black',
    borderRadius: 30,
    width: wp('100%'),
    height: hp('5%'),
    marginBottom: '1%',
    fontSize: 20,
  },

  noneText: {
    textAlign: 'center',
    color: 'grey',
    height: '100%',
  },
});
