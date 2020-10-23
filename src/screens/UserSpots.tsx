import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import TopHeader from '../components/Header';
import { ListItem, Divider, Avatar } from 'react-native-elements';

const UserSpots = (props) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('Spot Page', { spot: item })}
    >
      <ListItem>
        <Avatar
          size="large"
          rounded
          source={{ uri: `data:image/gif;base64,${item.images[0].base64}` }}
        />
        <ListItem.Content style={styles.content}>
          <ListItem.Title style={styles.title}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            {item.description}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron style={styles.chevron} />
      </ListItem>
      <Divider />
    </TouchableOpacity>
  );

  const noItems = ({ item }) => (
    <View>
      <Text>No Items</Text>
    </View>
  );

  return (
    <>
      <TopHeader
        name={`${props.route.params.user.name}'s spots`}
        navigation={props.navigation}
      />

      {props.route.params.user.spots.length > 0 ? (
        <FlatList
          data={props.route.params.user.spots}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View>
          <Text>User has no spots</Text>
        </View>
      )}
    </>
  );
};

export default UserSpots;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(40, 44, 52)',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  content: {
    width: '100%',
    justifyContent: 'space-between',
  },
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: 'grey' },

  chevron: { color: 'black' },
  button: {
    height: 50,
    width: 50,
  },
});
