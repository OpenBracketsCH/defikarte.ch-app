import { useEffect } from 'react';
import distanceBetweenPoints from '../helpers/coordinateCalc.js'

export default (defibrillators, getDefibrillators, setDefisNearLocation, userLocation) => {
  const getDefisNearLocation = (defibrillators, location) => {
    return defibrillators
      .filter(d => {
        if (location) {
          const dist = distanceBetweenPoints(d.lat, d.lon, location.latitude, location.longitude);
          d.distance = dist;
          if (dist < 2000) {
            return true;
          }
        }

        return false;
      })
      .sort((d1, d2) => {
        return d1.distance - d2.distance;
      });
  };

  useEffect(() => {
    getDefibrillators();
    const timerId = setTimeout(() => getDefibrillators(), 60000);

    return () => {
      clearTimeout(timerId);
    }
  }, [])

  useEffect(() => {
    setDefisNearLocation(getDefisNearLocation(defibrillators, userLocation.location))
  }, [defibrillators, userLocation.location])
}