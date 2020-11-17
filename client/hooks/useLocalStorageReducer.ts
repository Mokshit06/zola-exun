import { Reducer, ReducerState, useEffect, useReducer, useState } from 'react';

const PREFIX = 'exun-';

export default function useLocalStorageReducer<R extends Reducer<any, any>>(
  key: string,
  reducer: R,
  initialState: ReducerState<R>
) {
  const prefixedKey = PREFIX + key;

  const getState = (): ReducerState<R> => {
    if (typeof localStorage !== 'undefined') {
      const jsonValue = localStorage.getItem(prefixedKey);
      if (jsonValue != null) return JSON.parse(jsonValue);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(reducer, getState());

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(state));
  }, [state]);

  return [state, dispatch] as const;
}
