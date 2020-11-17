import { createContext, useContext, useReducer, useState } from 'react';
import useLocalStorageReducer from 'hooks/useLocalStorageReducer';

interface GlobalContext {}

const GlobalContext = createContext(null);

export default function useGlobal() {
  return useContext(GlobalContext);
}

const initialState = {
  fans: false,
  cctv: false,
  lights: false,
  ac: false,
};

const globalReducer = (
  state: typeof initialState,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case 'TURN_ON':
      return {
        ...state,
        [action.payload]: true,
      };
    case 'TURN_OFF':
      return {
        ...state,
        [action.payload]: false,
      };
    default:
      return state;
  }
};

export function GlobalProvider({ children }) {
  const [state, dispatch] = useLocalStorageReducer(
    'appliances',
    globalReducer,
    initialState
  );

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
