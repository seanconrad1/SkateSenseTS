import React, {
  useState,
  useContext,
  useCallback,
  useRef
} from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Input, Divider, Button} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
import GET_MY_SPOTS from '../../graphql/queries/getMySpots';
import GET_SPOTS from '../../graphql/queries/getSpots';
import GET_BOOKMARKS from '../../graphql/queries/getBookmarks';
// import GET_BOOKMARKS from '../../graphql/queries/getBookmarks';
import DELETE_SPOT_MUTATION from '../../graphql/mutations/deleteSpotMutation';
import DELETE_BOOKMARK_MUTATION from '../../graphql/mutations/deleteBookmarkMutation';
import SpotCard from '../../components/SpotCard';
import SpotsButtonGroup from '../../components/SpotsButtonGroup';
import { store } from '../../store';
import TopHeader from '../../components/Header';
import { getCurrentLocation } from '../../utils/helpers';
import Loading from '../../components/Loading';
import {streetSpotTypebuttons, streetSpotContains} from '../../utils/typesAndSelections'
import Modal from 'react-native-modalbox';
import CustomButtonGroup from '../../components/CustomButtonGroup';

const SpotBook = ({ navigation }) => {
  const { state: myStore } = useContext(store);
  const [tab, setTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [refreshing] = useState(false);
  const [deleteSpot] = useMutation(DELETE_SPOT_MUTATION);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK_MUTATION);
  const [location, setLocation] = useState();
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const modalRef = useRef(null)
  const[isOpen, setOpen] = useState(false)

  const [getMySpots, { loading, data: mySpots }] = useLazyQuery(GET_MY_SPOTS);

  const filters = [... streetSpotTypebuttons, ...streetSpotContains]

  const [
    getMyBookmarks,
    { loading: loading2, data: myBookmarks },
  ] = useLazyQuery(GET_BOOKMARKS, {
    variables: { user_id: myStore.user_id },
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchMyAPI() {
        const location = await getCurrentLocation();
        getMySpots({
          variables: {
            locationInput: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        });
        getMyBookmarks();

      }
      fetchMyAPI();
    }, [])
  );

  const getCoords = async () => {
    return;
  };

  const searchFilter = (input) => {
    if (input === "") {
      setSearchInput("");
      return mySpots.getUserCreatedSpots;
    } else {
      setSearchInput(input.toLowerCase());
      return setFilteredSpots(
        mySpots.getUserCreatedSpots.filter((spot) => spot.name.toLowerCase().includes(input.toLowerCase()))
      );
    }
  };
  
  const onChangeTab = (e) => setTab(e);

  const unBookmark = async (_id) => {
    try {
      await deleteBookmark({
        variables: {
          bookmarkInput: {
            spot_id: _id,
            user_id: myStore.user_id,
          },
        },
        refetchQueries: [
          { query: GET_BOOKMARKS, variables: { user_id: myStore.user_id } },
          { query: GET_SPOTS },
        ],
      });

      getMyBookmarks();
    } catch (e) {
      alert('Unable to delete spot at this time.');
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

  const handleDeleteSpot = async (_id) => {
    const location = await getCurrentLocation();

    try {
      await deleteSpot({
        variables: {
          _id,
        },
        refetchQueries: [
          {
            query: GET_MY_SPOTS,
            variables: {
              locationInput: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            },
          },
          { query: GET_SPOTS },
        ],
      });
      getMySpots({
        variables: {
          locationInput: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      });
    } catch (e) {
      alert('Unable to delete spot at this time.');
    }
  };

  const deleteAlertMsg = (_id) => {
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
      { cancelable: false }
    );
  };

  const launchRefetch = async () => {
    if (tab === 0) {
      const location = await getCurrentLocation();
      getMySpots({
        variables: {
          locationInput: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      });
    }
    if (tab === 1) {
      getMyBookmarks();
    }
  };

  const onClose = () => {
    modalRef!.current.close()
  }

  const onOpen = (index: number) => {
    modalRef!.current.open()
    // setSeletctedPhotoIndex(index)
  }




  if (loading || mySpots === undefined) {
    return <Loading />;
  }
  if (loading2 || myBookmarks === undefined) {
    return <Loading />;
  }


  const whichSpots = searchInput ? filteredSpots : mySpots.getUserCreatedSpots


  return (
    <View>
      <TopHeader name="My Spots" navigation={navigation} />

      <Input
        style={styles.search}
        placeholder="Search"
        returnKeyType="search"
        onChangeText={(value) => searchFilter(value)}
        // rightIcon={
        //   <Button title="Filter" onPress={onOpen} buttonStyle={styles.btn}/>
        //   }
      />
      

      <SpotsButtonGroup onChangeTab={onChangeTab} />

      <Modal swipeToClose={false}  style={styles.modal} position={"center"} ref={modalRef} >
          {/* <ScrollView showsHorizontalScrollIndicator={false} style={styles.scrollview}> */}
          <View style={styles.container}>
              {filters.map((filter, key) => {
                return(
                    <TouchableOpacity key={key} style={styles.selectedButton}>
                      <Text style={styles.buttonText}>{filter}</Text>
                    </TouchableOpacity>
                )
              })}
            </View>
          <Button title={"Apply"} onPress={onClose} buttonStyle={styles.applyButton}/>
        </Modal>


      {tab === 0 && (
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={launchRefetch} />
          }
        >
          {mySpots.getUserCreatedSpots.length > 0 ? (            
            whichSpots.map((spot, i) => (
              <SpotCard
                key={i}
                spot={spot}
                navigation={navigation}
                deleteAlertMsg={deleteAlertMsg}
              />
            ))
          ) : (
            <Text style={styles.noneText}>
              You haven't created any spots yet
            </Text>
          )}
        </ScrollView>
      )}

      {tab === 1 && (
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={launchRefetch} />
          }
        >
          {myBookmarks.getBookmarks.length > 0 ? (
            myBookmarks.getBookmarks.map((spot, i) => (
              <SpotCard
                key={i}
                spot={spot}
                bookmark
                navigation={navigation}
                unBookmarkAlertMsg={unBookmarkAlertMsg}
              />
            ))
          ) : (
            <Text style={styles.noneText}>
              You haven't bookmarked any spots yet
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default SpotBook;

const styles = StyleSheet.create({

  btn: {
    backgroundColor: 'rgb(244, 2, 87)',
    color: 'black',
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },

  applyButton:{
    backgroundColor: 'rgb(244, 2, 87)',
    color: 'black',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10

  },


  containerStyle: {
    paddingBottom: 200,
    height: '100%',
  },

  modal: {
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    borderRadius: 50,
    height: 420,
    width: 380,
    // backgroundColor: 'transparent'
  },

  container:{
    flex: 1, 
    marginHorizontal: 20,
    flexDirection: 'row',
    color: 'grey',
    flexWrap: 'wrap',
    width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },

  selectedButton: {
    borderWidth: .4,
    borderRadius: 10,
    padding:0, 
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

