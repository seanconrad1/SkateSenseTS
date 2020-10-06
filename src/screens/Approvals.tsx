import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import GET_NOT_APPROVED_LIST from '../graphql/queries/getNotApprovedList';
import { Header, ListItem } from 'react-native-elements';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const Approvals = props => {
  const { loading, error, data } = useQuery(GET_NOT_APPROVED_LIST);

  console.log(data);

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: 'menu',
          color: 'black',
          onPress: () => props.navigation.openDrawer(),
        }}
        centerComponent={{
          text: 'Approvals',
          style: { color: 'black', fontSize: 25, fontFamily: 'Lobster' },
        }}
        backgroundColor="white"
        containerStyle={{
          fontFamily: 'Lobster',
          justifyContent: 'space-around',
        }}
      />

      <ScrollView
      // refreshControl={
      //   <RefreshControl
      //   refreshing={this.state.refreshing}
      //   onRefresh={this._onRefresh}
      //   />
      // }
      >
        {data.getNotApprovedList.map((spot, i) => (
          <View key={i}>
            <ListItem
              title={spot.name}
              leftAvatar={{
                uri: `data:image/gif;base64,${spot.images[0].base64}`,
              }}
            // onPress={() => this.props.navigation.navigate('ApprovalSpotPage', { skatespot: spot })}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Approvals;

// _onRefresh = () => {
//     this.setState({ refreshing: true });
//     this.props.getSkateSpots();
//     // this.props.fetchUserData(this.props.user.user.id)
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
});
