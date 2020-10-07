import React, { useState, useContext, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
import GET_MY_SPOTS from '../../graphql/queries/getMySpots';
// import GET_BOOKMARKS from '../../graphql/queries/getBookmarks';
import DELETE_SPOT_MUTATION from '../../graphql/mutations/deleteSpotMutation';
import DELETE_BOOKMARK_MUTATION from '../../graphql/mutations/deleteBookmarkMutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { reducer, spotBookState } from './reducer';
import SpotCard from '../../components/SpotCard';
import SpotsButtonGroup from '../../components/SpotsButtonGroup';
import { store } from "../../store";
import TopHeader from "../../components/Header"

console.disableYellowBox = true;

const SpotBook = props => {
  const [state, dispatch] = useReducer(reducer, spotBookState);
  const [deleteSpot] = useMutation(DELETE_SPOT_MUTATION);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK_MUTATION);
  const { state: myStore } = useContext(store)

  const { navigation } = props


  const { data: createdSpots, loading, error, refetch } = useQuery(
    GET_MY_SPOTS,
    {
      variables: { user_id: myStore.user_id },
    },
  );

  console.log('WHAT ARE MY SPOTS', createdSpots)
  // const {
  //   data: bookmarks,
  //   loading: loading2,
  //   error: error2,
  // } = useQuery(GET_BOOKMARKS, {
  //   variables: { user_id: myStore.user_id },
  // });
  const [tab, setTab] = useState(0);
  const [term, setTerm] = useState('');
  const [refreshing] = useState(false);

  useEffect(() => {
    if (!loading && !error) {
      // dispatch({
      //   type: 'SET_SPOTS',
      //   payload: createdSpots.getUserCreatedSpots,
      // });
    }
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>An error occured</Text>;
  }

  const onSearchChange = e => setTerm(e);

  const onChangeTab = e => setTab(e);

  const unBookmark = async _id => {
    try {
      await deleteBookmark({
        variables: {
          bookmarkInput: {
            spot_id: _id,
            user_id: myStore.user_id,
          },
        },
      });
      dispatch({
        type: 'DELETE_BOOKMARK',
        payload: _id,
      });
    } catch (e) {
      alert('Unable to delete spot at this time.');
    }
  };

  const unBookmarkAlertMsg = _id => {
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
      { cancelable: false },
    );
  };

  const handleDeleteSpot = async _id => {
    try {
      await deleteSpot({
        variables: {
          _id,
        },
        refetchQueries: ['getUserCreatedSpots', 'getUser', 'getSpots'],
      });

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
      console.log('REFETCH 1');
    }
    if (tab === 1) {
      console.log('REFETCH 2');
    }
  };

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

          {state.mySpots.length > 0
            ? state.mySpots.map((spot, i) => (
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

      {tab === 1 &&
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={launchRefetch} />
          }>
          {state.bookmarkedSpots > 0
            ? state.bookmarkedSpots.map((spot, i) => (
              <SpotCard
                key={i}
                spot={spot}
                navigation={navigation}
                bookmark
                unBookmarkAlertMsg={unBookmarkAlertMsg}
              />
            ))
            : <Text style={styles.noneText}>You haven't bookmarked any spots yet</Text>}

        </ScrollView>

      }





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
