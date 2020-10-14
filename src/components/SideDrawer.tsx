import React, { useContext } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Divider, ListItem, Icon } from 'react-native-elements';
import { DrawerContentScrollView } from '@react-navigation/drawer';
//Context
import { store } from '../store';
import jwt_decode from 'jwt-decode';

interface Iprops { }

const SideMenu = (props: Iprops) => {
  const { state, dispatch } = useContext(store);
  const decoded = jwt_decode(state.token);
  const { navigation } = props;

  const logOut = async () => {
    await AsyncStorage.setItem('AUTH_TOKEN', '');
    await AsyncStorage.setItem('NAME', '');
    await AsyncStorage.setItem('EMAIL', '');
    await AsyncStorage.setItem('USER_ID', '');
    await AsyncStorage.setItem('ADMIN', '');

    dispatch({
      type: 'SET_USER',
      payload: false,
    });
  };

  const list = [
    {
      name: 'Map',
      icon: 'globe',
      type: 'font-awesome',
    },
    {
      name: 'My Spots',
      type: 'font-awesome',
      icon: 'bookmark',
    },

    // {
    //   name: 'Settings',
    //   type: 'font-awesome',
    //   icon: 'wrench',
    // },
  ];

  if (decoded.admin) {
    list.push(
      {
        name: 'Approvals',
        type: 'font-awesome',
        icon: 'check',
      },
      { name: 'Administration', type: 'font-awesome', icon: 'gear' }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkateSense</Text>

      <DrawerContentScrollView>
        <Divider />
        <View>
          {list.map((item, i) => (
            <ListItem key={i} onPress={() => navigation.navigate(item.name)}>
              <ListItem.Content style={styles.itemContainer}>
                <Icon
                  containerStyle={styles.iconContainer}
                  type={item.type}
                  name={item.icon}
                  iconStyle={styles.iconStyle}
                />
                <ListItem.Title style={styles.itemTitle}>
                  {item.name}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}

          <ListItem onPress={logOut}>
            <ListItem.Content style={styles.itemContainer}>
              <Icon
                containerStyle={styles.iconContainer}
                type="font-awesome"
                name="sign-out"
                iconStyle={styles.iconStyle}
              />
              <ListItem.Title style={styles.itemTitle}>Logout</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          {/* {this.props.user.user !== null ? this.approvals() : null}

            {this.props.user.user !== null ? this.administration() : null} */}
        </View>
        <Divider />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Lobster',
    justifyContent: 'space-around',
    color: 'black',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemTitle: {
    marginLeft: 15,
  },
  iconContainer: {
    width: 20,
  },
  iconStyle: {
    color: 'black',
  },
});

export default SideMenu;
