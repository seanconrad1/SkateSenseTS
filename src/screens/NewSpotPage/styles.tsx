import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  topView: {
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    marginHorizontal: 20,
    flex: 1,
  },
  insideContainer: {
    // flex: 1,
    // height: '100%',
    flex: 1,
  },
  imageBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoBox: {
    width: wp('21%'),
    height: wp('21%'),
    backgroundColor: 'grey',
    borderWidth: 5,
    borderColor: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: wp('40%'),
  },
  spotLocationButton: {
    width: wp('38'),
    flexWrap: 'wrap',
    backgroundColor: 'rgb(244, 2, 87)',
  },
  spotLocationSelected: {
    width: wp('38%'),
    // marginLeft: wp('2'),
    backgroundColor: 'rgb(52, 235, 131)',
  },

  inputsContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    // width: wp('38'),
    width: '100%',
  },

  sliderStyles: {
    width: '100%',
  },

  spotTypeButtonsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  containsContainer: {
    flexDirection: 'row',
    color: 'grey',
    flexWrap: 'wrap',
    alignSelf: 'center',
    width: '100%',
  },

  submitButton: {
    alignSelf: 'center',
    marginTop: hp('5%'),
    backgroundColor: 'rgb(244, 2, 87)',
    width: wp('80%'),
    height: hp('6%'),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
    marginBottom: hp('10%'),
  },

  requiredStar: {
    color: 'red',
    marginBottom: -10,
  },

  text: {
    alignSelf: 'flex-start',
    marginLeft: wp('1%'),
    opacity: 0.5,
    fontSize: 17,
    marginTop: 10,
  },

  modal: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    width: '90%',
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  textContainer: {
    padding: 20,
    width: '100%',
    // backgroundColor: 'blue',
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  modelText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'rgb(35, 75, 178)',
  },
});
export default styles;
