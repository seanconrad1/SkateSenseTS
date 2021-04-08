import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/core';
import { getUsers } from '../api/api';

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const Administration = ({ navigation }) => {
  const [users, setUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchMyAPI() {
        setLoading(true);
        const response = await getUsers();
        setUsers(response);
        setLoading(false);
      }
      fetchMyAPI();
      setLoading(false);
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  const refreshUsers = async () => {
    setRefreshing(true);
    const response = await getUsers();
    setUsers(response);
    wait(2000).then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('User Spots', { user: item })}
    >
      <ListItem>
        <ListItem.Content style={styles.content}>
          <ListItem.Title style={styles.title}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            {item.email}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={styles.subtitle}>
            Spots posted: {item.spots.length}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron style={styles.chevron} />
      </ListItem>
      <Divider />
    </TouchableOpacity>
  );

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshUsers} />
      }
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Administration;

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
