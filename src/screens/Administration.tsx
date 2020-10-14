import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

import { useLazyQuery, useApolloClient, useQuery } from '@apollo/react-hooks';
import GET_USERS from '../graphql/queries/getUsers';
import Loading from '../components/Loading';

const Administration = () => {
  const [users, setUsers] = useState('');
  const { loading, error, data } = useQuery(GET_USERS);
  const client = useApolloClient();

  // useEffect(() => {
  //   callQuery();
  // }, []);

  // const callQuery = async () => {
  //   const { data } = await client.query({
  //     query: GET_USERS,
  //   });
  //   setUsers(data);
  // };

  if (loading) {
    return <Loading />;
  }

  console.log(data.getUsers);

  return data.getUsers.map((user, i) => (
    <ListItem onPress={console.log('test')} key={i}>
      <ListItem.Content>
        <ListItem.Title>{user.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  ));
};

export default Administration;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(40, 44, 52)',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  button: {
    height: 50,
    width: 50,
  },
});
