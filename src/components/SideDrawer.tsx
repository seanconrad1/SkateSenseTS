import React, { useContext } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Divider, ListItem } from "react-native-elements";
import { DrawerContentScrollView } from "@react-navigation/drawer";
//Context
import { store } from "../store";
import jwt_decode from "jwt-decode";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 40,
  },
  divider: { backgroundColor: "grey", marginTop: 0 },
  title: {
    fontFamily: "Lobster",
    justifyContent: "space-around",
    color: "black",
    fontSize: 40,
    alignSelf: "center",
    marginTop: 20,
  },
});

interface Iprops { }

const SideMenu = (props: Iprops) => {
  const { state, dispatch } = useContext(store);
  const decoded = jwt_decode(state.token);
  const { navigation } = props

  const logOut = async () => {
    await AsyncStorage.setItem("AUTH_TOKEN", "");
    await AsyncStorage.setItem("NAME", "");
    await AsyncStorage.setItem("EMAIL", "");
    await AsyncStorage.setItem("USER_ID", "");
    await AsyncStorage.setItem("ADMIN", "");

    dispatch({
      type: "SET_USER",
      payload: false,
    });
  };

  let list = [
    {
      name: "Map",
      icon: "globe",
      type: "font-awesome",
    },
    {
      name: "My Spots",
      type: "font-awesome",
      icon: "bookmark",
    },

    // {
    //   name: 'Settings',
    //   type: 'font-awesome',
    //   icon: 'wrench',
    // },
  ];


  if (decoded.admin) {
    list.push({
      name: "Approvals",
      type: "font-awesome",
      icon: "globe",
    })
  }

  // administration = () => {
  //   if (this.props.user.user.username === 'seanrad') {
  //     return (
  //       <ListItem
  //         title="Administration"
  //         leftIcon={{ name: 'gear', type: 'font-awesome' }}
  //         onPress={() => this.props.navigation.navigate('AdminConsole')}
  //       />
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkateSense</Text>

      <DrawerContentScrollView>
        <Divider style={styles.divider} />
        <View>
          {list.map((item, i) => {
            return (
              <ListItem key={i} onPress={() => navigation.navigate(item.name)} >
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem>
            )
          })}
          <ListItem onPress={logOut}>
            <ListItem.Title>Logout</ListItem.Title>
          </ListItem>

          {/* {this.props.user.user !== null ? this.approvals() : null}

            {this.props.user.user !== null ? this.administration() : null} */}
        </View>
      </DrawerContentScrollView>
    </View >
  );
};

export default SideMenu;
