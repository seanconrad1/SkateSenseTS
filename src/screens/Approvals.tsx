import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import GET_NOT_APPROVED_LIST from '../graphql/queries/getNotApprovedList';
import { Header, ListItem, Avatar } from 'react-native-elements';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import TopHeader from '../components/Header';
import Loading from '../components/Loading';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const Approvals = ({ navigation }) => {
  // const { loading, error, data } = useLazyQuery(GET_NOT_APPROVED_LIST);
  const [refreshing, setRefreshing] = useState(false)


  const [getSpotsNeedingApproval, { called, loading, data }] = useLazyQuery(
    GET_NOT_APPROVED_LIST)


  useEffect(() => {
    getSpots()
  }, [])

  const getSpots = () => {
    getSpotsNeedingApproval()

    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }



  if (loading || data === undefined) {
    return <Loading />
  }

  console.log(data);

  return (
    <View style={styles.container}>
      <TopHeader navigation={navigation} name="Approvals" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getSpotsNeedingApproval}
          />
        }
      >
        {data.getNotApprovedList.map((spot, i) => (
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
              }} />
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle}>{spot.name}</ListItem.Title>
              <View style={styles.subtitleView}>
                {/*  */}
                <Text>5 months ago</Text>
              </View>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </ListItem>
        ))}
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
  listItemStyle: {

  },
  avatarContainer: {
    // flex: 2, marginLeft: 20, marginTop: 115
  },
  listItemTitle: {

  },
  subtitleView: {
    marginLeft: 2
  }
});
