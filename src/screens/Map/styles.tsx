import React from 'react'
import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  scrollView: {
    position: "absolute",
    backgroundColor: "transparent",
    bottom: -5,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },

  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 20,
    height: 20,
    // borderRadius: 4,
    // backgroundColor: "rgba(244, 2, 87, .9)",
  },
  locationButtonContainer: {
    position: "absolute",
    marginLeft: wp("80%"),
    marginTop: hp("50%"),
  },
  refreshContainer: {
    position: "absolute",
    paddingTop: 0,
    marginLeft: wp("53%"),
    marginTop: hp("6%"),
  },
  refreshButtonStyle: {
    backgroundColor: "white",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: wp("20%"),
  },
  refreshButtonTitle: {
    color: "rgb(244, 2, 87)",
    marginRight: 10,
    fontSize: wp("4"),
  },
  addSpotButtonContainer: {
    position: "absolute",
    paddingTop: 0,
    marginLeft: wp("3%"),
    marginTop: hp("50%"),
  },
  drawerButtonContainer: {
    position: "absolute",
    marginLeft: wp("3%"),
    marginTop: hp("5%"),
  },
});

export default styles