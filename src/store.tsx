import React, { createContext, useReducer } from 'react';

const initialState = {
  loading: true,
  darkMode: true,
  primary: 'white',
  secondary: 'rgb(40, 44, 52)',
};

export const SET_USER = 'SET_USER';

const MainContext = createContext(initialState);

const reducer = (state, action) => {
  console.log(state, action);
  try {
    switch (action.type) {
      case SET_USER:
        return {
          ...initialState,
          token: action.payload.token,
          user_id: action.payload.user_id,
          admin: action.payload.admin,
          push_token: action.payload.push_token,
        };
      default:
        throw new Error();
    }
  } catch (e) {
    console.log('switch case error', e);
  }
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, StateProvider };
