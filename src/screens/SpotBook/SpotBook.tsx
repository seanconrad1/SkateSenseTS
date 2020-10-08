import React, { useState, useContext, useReducer, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  LogBox
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
import GET_MY_SPOTS from '../../graphql/queries/getMySpots';
import GET_SPOTS from "../../graphql/queries/getSpots";
// import GET_BOOKMARKS from '../../graphql/queries/getBookmarks';
import DELETE_SPOT_MUTATION from '../../graphql/mutations/deleteSpotMutation';
import DELETE_BOOKMARK_MUTATION from '../../graphql/mutations/deleteBookmarkMutation';
import { reducer, spotBookState } from './reducer';
import SpotCard from '../../components/SpotCard';
import SpotsButtonGroup from '../../components/SpotsButtonGroup';
import { store } from "../../store";
import TopHeader from "../../components/Header"

const SpotBook = ({ navigation }) => {
  const { state: myStore } = useContext(store)
  const [tab, setTab] = useState(0);
  const [term, setTerm] = useState('');
  const [refreshing] = useState(false);
  const [deleteSpot] = useMutation(DELETE_SPOT_MUTATION);

  const [getMySpots, { loading, data }] = useLazyQuery(GET_MY_SPOTS, {
    variables: { user_id: myStore.user_id },
  });

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getMySpots();
      // return () => {
      //   // Do something when the screen is unfocused
      //   // Useful for cleanup functions
      // };
    }, [])
  )

  const onSearchChange = e => setTerm(e);

  const onChangeTab = e => setTab(e);

  // const unBookmark = async _id => {
  //   try {
  //     await deleteBookmark({
  //       variables: {
  //         bookmarkInput: {
  //           spot_id: _id,
  //           user_id: myStore.user_id,
  //         },
  //       },
  //     });
  //     // dispatch({
  //     //   type: 'DELETE_BOOKMARK',
  //     //   payload: _id,
  //     // });
  //   } catch (e) {
  //     alert('Unable to delete spot at this time.');
  //   }
  // };

  // const unBookmarkAlertMsg = _id => {
  //   Alert.alert(
  //     'Unbookmarking spot',
  //     'Are you sure you want to unbookmark this spot?',
  //     [
  //       { text: 'Yes', onPress: () => unBookmark(_id) },
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //     ],
  //     { cancelable: false },
  //   );
  // };

  const handleDeleteSpot = async _id => {

    try {
      await deleteSpot({
        variables: {
          _id,
        },
        refetchQueries: [
          { query: GET_MY_SPOTS, variables: { user_id: myStore.user_id } },
          { query: GET_SPOTS }
        ],
      });

      getMySpots();

    } catch (e) {
      alert('Unable to delete spot at this time.');
    }
  };

  const deleteAlertMsg = _id => {
    Alert.alert(
      'Deleting spot',
      'Are you sure you want to delete this spot?',
      [
        { text: 'Yes', onPress: () => handleDeleteSpot(_id) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  const launchRefetch = () => {
    if (tab === 0) {
      getMySpots();
    }
    if (tab === 1) {
      console.log('REFETCH 2');
    }
  };

  if (loading || data === undefined) {
    return <Text>Loading</Text>
  }
  console.log('WHAT ARE MY SPOTS', data)


  return (
    <View>
      <TopHeader name="My Spots" navigation={navigation} />

      <TextInput
        style={styles.search}
        placeholder="Search"
        returnKeyType="search"
        onChangeText={value => onSearchChange(value)}
      />

      <SpotsButtonGroup onChangeTab={onChangeTab} />

      {tab === 0 &&
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={launchRefetch} />
          }>

          {data.getUserCreatedSpots.length > 0
            ? data.getUserCreatedSpots.map((spot, i) => (
              <SpotCard
                key={i}
                spot={spot}
                navigation={navigation}
                deleteAlertMsg={deleteAlertMsg}
              />
            ))
            : <Text style={styles.noneText}>You haven't created any spots yet</Text>}

        </ScrollView>
      }

      {/* {tab === 1 &&
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={launchRefetch} />
          }>
          <Text style={styles.noneText}>You haven't bookmarked any spots yet</Text>

        </ScrollView>

      } */}
    </View>
  );
};

export default SpotBook;

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: 200
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
    color: 'grey'
  }
});
