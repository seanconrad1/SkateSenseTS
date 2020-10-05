// store.js
import React, { createContext, useReducer } from "react";

const initialState = { loading: true };
const store = createContext(initialState);
const { Provider } = store;

export const SET_USER = "SET_USER";

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_USER:
        return { ...initialState, token: action.payload.token, user_id: action.payload.user_id };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
