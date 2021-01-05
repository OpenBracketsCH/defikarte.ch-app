import {useContext, useEffect} from 'react';
import { Context } from '../context/DefibrillatorContext';

export default (navigation) => {
  const { state, getDefibrillators } = useContext(Context);  

  useEffect(() => {
    getDefibrillators();

    const listener = navigation.addListener('didFocus', () => {
      getDefibrillators();
    })

    return () => {
      listener.remove();
    }
  }, [])

  return [state];
}