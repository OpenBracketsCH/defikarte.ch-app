import { useContext, useEffect } from 'react';
import { Context } from '../context/DefibrillatorContext';

export default (navigation) => {
  const { state, getDefibrillators, setDefisNearLocation } = useContext(Context);

  useEffect(() => {
    getDefibrillators();

    // probably not the best thing, because the request takes something about 10s. This makes the touch behavior slow, for MainScreen and ListScreen (in both the defis will be reloaded)
    const listener = navigation.addListener('didFocus', () => {
      getDefibrillators();
    })

    return () => {
      listener.remove();
    }
  }, [])

  return [state.defibrillators, state.defisNearLocation, setDefisNearLocation];
}