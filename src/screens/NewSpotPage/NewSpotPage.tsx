import React, { useReducer, useEffect, useState, useContext, useRef } from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { useMutation } from '@apollo/react-hooks';
import * as ImagePicker from 'expo-image-picker';
import { reducer, newSpotState } from './reducer';
import NEW_SPOT_MUTATION from '../../graphql/mutations/newSpotMutation';
import GET_SPOTS from '../../graphql/queries/getSpots';
// import Geolocation from '@react-native-community/geolocation';
import ImageResizer from 'react-native-image-resizer';
import CustomButtonGroup from '../../components/CustomButtonGroup';
import styles from './styles'
import PhotoHolders from './components/PhotoHolders'
import ButtonsRow from './components/ButtonsRow'
import InputsContainer from './components/InputsContainer'
import { streetSpotTypebuttons, streetSpotContains } from './typesAndSelections'
import TopHeader from '../../components/Header'
import { validate } from 'graphql';
import Modal from 'react-native-modalbox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { store } from "../../store";
import * as Permissions from 'expo-permissions';

const NewSpotPage = props => {
  const [disableButton, setDisableButton] = useState(false);
  const [state, dispatch] = useReducer(reducer, newSpotState);
  const [createSpot, { data }] = useMutation(NEW_SPOT_MUTATION);
  const { state: myStore } = useContext(store);
  const { navigation } = props
  const modalRef = useRef(null)
  const [selectedPhotoIndex, setSeletctedPhotoIndex] = useState(0)


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  // let latitude;
  // let longitude;

  // if (props.route.params) {
  // latitude = props.route.params.selectedLocation.latitude;
  // longitude = props.route.params.selectedLocation.longitude;
  // }

  // useEffect(() => {
  //   if (props.route.params) {
  //     const latitude = props.route.params.selectedLocation.latitude;
  //     const longitude = props.route.params.selectedLocation.longitude;
  //     dispatch({ type: 'SET_LOCATION', payload: { latitude, longitude } });
  //   }
  // }, [props.route.params]);

  const launchCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.cancelled) {
        dispatch({ type: 'SET_PHOTO', payload: result.uri });
        onClose()
      }
    }
  }

  const getPhotoFromCameraRoll = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      dispatch({ type: 'SET_PHOTO', payload: result.uri });
      onClose()
    }
  };

  const approvalAlert = () => {
    Alert.alert(
      'Thanks for submitting a spot!',
      'Your spot needs to go through approval before being posted. It should be approved within a day.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Map'),
        },
      ],
      { cancelable: false },
    );
  };

  const getCurrentLocation = () => {
    if (!state.currentLocationSelected) {
      // Geolocation.getCurrentPosition(position => {
      // dispatch({
      //   type: 'SET_CURRENT_LOCATION',
      //   payload: {
      //     latitude: position.coords.latitude,
      //     longitude: position.coords.longitude,
      //   },
      // });
      // });
    } else {
      dispatch({
        type: 'REMOVE_LOCATION',
        payload: {},
      });
    }
  };

  const validate = () => {
    console.log(state.photo)
    if (!state.name) {
      alert("Spot name is required")
      return false
    }
    if (!state.description) {
      alert("Spot description is required")
      return false
    }
    if (state.photo.length <= 0) {
      alert("Spot must have at least 1 photo")
      return false
    }
    return true
  }


  const onSubmit = async () => {
    // dispatch({ type: 'SPOT_SUBMITED', payload: true });

    if (validate()) {
      const images = state.photo.map(img => {
        return { base64: btoa(img) };
      });

      setDisableButton(true);
      try {
        await createSpot({
          variables: {
            spotInput: {
              name: state.name,
              description: state.description,
              kickout_level: state.kickout_level,
              location: {
                latitude: 40.7128,
                longitude: -74.0060,
              },
              owner: myStore.user_id,
              images,
            },
          },
          refetchQueries: ['getSpots'],
        });

        dispatch({ type: 'CLEAR_STATE' })
        setDisableButton(false);
        approvalAlert();

      } catch (e) {
        console.log(e.networkError.result.errors[0].message)
        alert('Unable to create spot at this time.');
        setDisableButton(false);
      }
    }

  };


  const onClose = () => {
    modalRef!.current.close()
  }

  const onOpen = (index: number) => {
    modalRef!.current.open()
    setSeletctedPhotoIndex(index)
  }

  const removePhoto = (index: number) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: index })
    onClose()
  }

  return (

    <View style={styles.topView}>
      <TopHeader navigation={navigation} name={'Create New Spot'} />

      <Modal swipeToClose={false} style={[styles.modal, { height: state.photo && state.photo[selectedPhotoIndex] ? 280 : 200 }]} position={"bottom"} ref={modalRef}>
        <TouchableOpacity onPress={getPhotoFromCameraRoll} style={styles.textContainer} >
          <Text style={styles.modelText}>Camera Roll</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={launchCamera} style={styles.textContainer}>
          <Text style={styles.modelText}>Take Photo</Text>
        </TouchableOpacity>
        {state.photo && state.photo[selectedPhotoIndex]
          ? <TouchableOpacity onPress={removePhoto} style={styles.textContainer}>
            <Text style={[styles.modelText, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
          : null}

        <TouchableOpacity onPress={onClose} style={styles.textContainer}>
          <Text style={styles.modelText}>Cancel</Text>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scrollview}>

        <View style={styles.insideContainer}>

          <PhotoHolders
            state={state}
            onOpen={onOpen}
          />
          <ButtonsRow
            navigation={navigation}
            getCurrentLocation={getCurrentLocation}
            state={state}
          />

          {state.photo.length > 0 ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: 10,
              }}>
              <Text>Photo Uploaded</Text>
              <Icon name="check" />
            </View>
          ) : null}

          {state.selectedLat && state.selectedLat ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: 10,
              }}>
              <Text>Location Selected</Text>
              <Icon name="check" />
            </View>
          ) : null}


          <InputsContainer state={state} dispatch={dispatch} />

          <Text
            style={styles.text}>
            Kickout meter
          </Text>
          {/* <Slider
            thumbTintColor="rgb(244, 2, 87)"
            style={styles.sliderStyles}
            step={1}
            maximumValue={10}
            animateTransitions={true}
            value={state.kickout}
            onValueChange={value =>
              dispatch({ type: 'SET_KICKOUT_LEVEL', payload: value })
            }
          /> */}

          <Text
            style={styles.text}>
            Spot Type
          </Text>

          <View style={styles.containsContainer}>
            {streetSpotTypebuttons.map((button, key) => (
              <CustomButtonGroup key={key} contains={false} type state={state} dispatch={dispatch} button={button} />
            ))}
          </View>

          <Text
            style={styles.text}>
            Spot Contains
          </Text>
          <View style={styles.containsContainer}>
            {streetSpotContains.map((button, key) => (
              <CustomButtonGroup key={key} type={false} contains state={state} dispatch={dispatch} button={button} />
            ))}
          </View>
          <View>
            <Button
              title="Submit"
              buttonStyle={styles.submitButton}
              disabled={disableButton}
              loading={disableButton}
              onPress={onSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </View >
  );
};


export default NewSpotPage;


  // const resize = photos => {
    // ImageResizer.createResizedImage(photos.uri, 350, 280, 'JPEG', 300)
    //   .then(res => {
    //     // response.uri is the URI of the new image that can now be displayed, uploaded...
    //     // response.path is the path of the new image
    //     // response.name is the name of the new image with the extension
    //     // response.size is the size of the new image
    //     RNFS.readFile(res.path, 'base64')
    //       .then(respo => {
    //         const photo = {
    //           path: res.path,
    //           uri: res.uri,
    //           data: respo,
    //         };
    //         if (state.photo && state.photo.length === 4) {
    //           return null;
    //         }
    //         dispatch({ type: 'SET_PHOTO', payload: photo });
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    //     // // Limit to 4 photos uploaded
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     // Oops, something went wrong. Check that the filename is correct and
    //     // inspect err to get more details.
    //   });
  // };