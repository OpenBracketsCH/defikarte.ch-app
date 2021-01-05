import { useContext, useState, useEffect } from 'react';
import { Context } from '../context/LocationContext';

export default () => {
  const { state, getUserLocation } = useContext(Context);

  useEffect(() => {
    let timerId = null;
    if (state.enabled) {
      timerId = setTimeout(() => {
        getUserLocation();
      }, 10000)
    }

    return () => {
      if (timerId){
        clearTimeout(timerId);
      }
    }
  }, [state.enabled]);

  return [state, getUserLocation];
}