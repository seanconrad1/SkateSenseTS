// store.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  loading: true,
  darkMode: true,
  primary: 'white',
  secondary: 'rgb(40, 44, 52)',
  push_token: '',
};

const store = createContext(initialState);
const { Provider } = store;

export const SET_USER = 'SET_USER';
export const SET_PUSH_TOKEN = 'SET_PUSH_TOKEN';

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_USER:
        return {
          ...initialState,
          token: action.payload.token,
          user_id: action.payload.user_id,
          admin: action.payload.admin,
        };
      case SET_PUSH_TOKEN:
        return { ...initialState, push_token: action.payload.push_token };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
