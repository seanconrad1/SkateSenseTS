import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Header, ListItem, Avatar } from 'react-native-elements';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../components/Loading';
import moment from 'moment';
import { getNotApprovedList } from '../api/api';

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const Approvals = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notApprovedList, setNotApprovedList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchMyAPI() {
        setLoading(true);
        const response = await getNotApprovedList();
        setNotApprovedList(response);
        setLoading(false);
      }
      fetchMyAPI();
      setLoading(false);
    }, [])
  );

  const getSpots = async () => {
    const response = await getNotApprovedList();
    setNotApprovedList(response);

    // setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  if (loading || notApprovedList === undefined) {
    return <Loading />;
  }

  // if (error) {
  //   return <View>{error}</View>;
  // }

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={data.publications.edges}
        renderItem={(item) => }
        refreshing={networkStatus === 4}
        onRefresh={() => refetch}
        keyExtractor={item => item.node.id}
        numColumns={2}
        style={styles.container}>
      </FlatList> */}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getSpots} />
        }
      >
        {notApprovedList.length > 0 ? (
          notApprovedList.map((spot, i: string) => (
            <ListItem
              key={i}
              bottomDivider
              onPress={() => navigation.navigate('ApprovalSpotPage', { spot })}
            >
              <Avatar
                containerStyle={styles.avatarContainer}
                size="large"
                rounded
                source={{
                  uri: `data:image/gif;base64,${spot.images[0].base64}`,
                }}
              />

              <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>
                  {spot.name}
                </ListItem.Title>
                <View style={styles.subtitleView}>
                  <Text>5 months ago</Text>
                </View>
              </ListItem.Content>

              <ListItem.Chevron color="black" />
            </ListItem>
          ))
        ) : (
          <View style={styles.noMoreItems}>
            <Text>No more spots to approve</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Approvals;

// _onRefresh = () => {
//     this.setState({ refreshing: true });
//     this.getSkateSpots();
//     // this.fetchUserData(this.user.user.id)
//     this.setState({ refreshing: false });
//   };

const styles = StyleSheet.create({
  container: {
    textDecorationColor: 'black',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    resizeMode: 'stretch',
  },
  noMoreItems: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  listItemStyle: {},
  avatarContainer: {
    // flex: 2, marginLeft: 20, marginTop: 115
  },
  listItemTitle: {},
  subtitleView: {
    marginLeft: 2,
  },
});
