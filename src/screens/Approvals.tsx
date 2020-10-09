import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import GET_NOT_APPROVED_LIST from '../graphql/queries/getNotApprovedList';
import { Header, ListItem, Avatar } from 'react-native-elements';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import TopHeader from '../components/Header';
import Loading from '../components/Loading';

const Approvals = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_NOT_APPROVED_LIST);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Text>{error}</Text>
  }

  return (
    <View style={styles.container}>
      <TopHeader navigation={navigation} name="Approvals" />

      <ScrollView
      // refreshControl={
      //   <RefreshControl
      //   refreshing={this.state.refreshing}
      //   onRefresh={this._onRefresh}
      //   />
      // }
      >
        {data.getNotApprovedList.map((spot, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => navigation.navigate('ApprovalSpotPage', { skatespot: spot })}

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
