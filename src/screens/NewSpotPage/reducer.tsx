import { ActivityIndicatorComponent } from "react-native";
import { spotBookState } from "../SpotBook/reducer";
import { streetSpotContains } from "./typesAndSelections";

export const newSpotState = {
  name: null,
  description: null,
  kickout_level: 0,
  photo: [],
  validation: false,
  spotType: "",
  spotContains: [],
  selectedLat: null,
  selectedLng: null,
  spotSubmitted: false,
  currentLocationSelected: false,
  locationSelected: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_KICKOUT_LEVEL':
      return { ...state, kickout_level: action.payload };
    case 'SET_SPOT_TYPE':
      return { ...state, spotType: action.payload }
    case 'SET_SPOT_CONTAINS':
      return { ...state, spotContains: [...state.spotContains, action.payload] }
    case 'REMOVE_SPOT_CONTAINS':
      return { ...state, spotContains: state.spotContains.filter(i => i !== action.payload) }
    case 'SET_PHOTO':
      if (state.photo) {
        return { ...state, photo: [...state.photo, action.payload] };
      } else if (!state.photo) {
        return { ...state, photo: [action.payload] };
      }
    case 'REMOVE_PHOTO':
      state.photo.splice(action.payload, 1)
      return { ...state, photo: state.photo };
    case 'SPOT_SUBMITED':
      return { ...state, spotSubmitted: action.payload };
    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        selectedLat: action.payload.latitude,
        selectedLng: action.payload.longitude,
        currentLocationSelected: true,
        locationSelected: false,
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        selectedLat: null,
        selectedLng: null,
        currentLocationSelected: false,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        selectedLat: action.payload.latitude,
        selectedLng: action.payload.longitude,
        locationSelected: true,
        currentLocationSelected: false,
      };
    default:
      throw new Error();
  }
}
