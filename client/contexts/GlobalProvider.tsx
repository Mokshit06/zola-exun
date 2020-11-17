import useLocalStorageReducer from 'hooks/useLocalStorageReducer';
import { createContext, Dispatch, useContext } from 'react';

interface GlobalContext {
  state: typeof initialState;
  dispatch: Dispatch<{
    type: string;
    payload: string;
  }>;
}

const GlobalContext = createContext<GlobalContext>(null);

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

export const GlobalProvider: React.FC = ({ children }) => {
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
};
