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
    marginLeft: wp("84%"),
    marginTop: hp("50%"),
  },
  addSpotButton: {
    display: 'flex'
  },
  addSpotIcon: {
    textAlign: 'center'
  },
  addSpotButtonContainer: {
    position: "absolute",
    alignItems: 'center',
    paddingTop: 0,
    marginLeft: wp("5%"),
    marginTop: hp("50%"),
  },
  refreshContainer: {
    position: "absolute",
    paddingTop: 0,
    marginLeft: wp("53%"),
    marginTop: hp("5%"),
  },
  refreshButtonStyle: {
    backgroundColor: 'white',
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: wp("20%"),
  },
  refreshButtonTitle: {
    color: "rgb(244, 2, 87)",
    marginRight: 10,
    fontSize: wp("4"),
  },

  drawerButtonContainer: {
    position: "absolute",
    marginLeft: wp("5%"),
    marginTop: hp("5%"),
  },

  error: {
    marginTop: hp('50%'),
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }


});

export default styles